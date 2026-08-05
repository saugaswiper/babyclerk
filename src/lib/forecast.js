// Exam-readiness forecast — "will I be ready?" answered from data the app
// already has: SRS state, deck size, exam date, daily new-card budget.
// No AI, no network, works offline. Every number here is explainable: it
// traces back to a card's review history and the calendar.
//
// See vault/Improvement-Proposals.md (P1) and vault/AI-Personalization-Engine.md
// (Layer 5 — forecast).
import { readStored } from './useLocalStorage.js'
import { getNewLimit } from './settings.js'
import { getSchedule, daysUntil } from './schedule.js'

const DAY = 86400000

// SM-2 picks each interval aiming for ~90% recall when the card next comes due.
// That single assumption gives us a forgetting curve per card: recall decays to
// 0.9 after one interval, 0.81 after two, and so on.
const RETAIN_AT_INTERVAL = 0.9
// Below this we call a card "faded" — it needs a refresh before exam day.
const RISK_RECALL = 0.6
// A just-failed or still-learning card (interval 0) decays fast.
const LEARNING_STABILITY = 0.5

// Probability you'd recall this card at time `atMs`, assuming no further review.
export function recallAt(state, atMs) {
  if (!state) return 0
  const dueMs = new Date(state.due).getTime()
  if (!Number.isFinite(dueMs)) return 0
  const stability = state.interval > 0 ? state.interval : LEARNING_STABILITY
  const lastReviewMs = dueMs - stability * DAY
  const elapsedDays = Math.max(0, (atMs - lastReviewMs) / DAY)
  return Math.min(1, Math.pow(RETAIN_AT_INTERVAL, elapsedDays / stability))
}

// What are we counting down to for this rotation? Its own exam if it has one,
// otherwise the end of the block, otherwise the MCCQE.
function targetFor(rotationId, schedule) {
  const block = schedule.rotations[rotationId] || {}
  const future = (d) => d && daysUntil(d) != null && daysUntil(d) >= 0
  if (future(block.exam)) return { date: block.exam, kind: 'exam', label: 'exam' }
  if (future(block.end)) return { date: block.end, kind: 'end', label: 'end of rotation' }
  if (future(schedule.mccqe)) return { date: schedule.mccqe, kind: 'mccqe', label: 'MCCQE' }
  return null
}

/**
 * Forecast one rotation.
 * @returns null when there's no deck, otherwise a plain object of numbers.
 */
export function forecastRotation(rotationId, cards, opts = {}) {
  const deck = cards?.length || 0
  if (!deck) return null

  const schedule = opts.schedule || getSchedule()
  const srsState = opts.srsState || readStored(`srs:${rotationId}`, {})
  const budget = opts.newLimit != null ? opts.newLimit : getNewLimit()
  const now = opts.now || Date.now()

  const target = targetFor(rotationId, schedule)
  const daysLeft = target ? daysUntil(target.date) : null
  // Exams are morning affairs; the exact hour barely moves the curve.
  const targetMs = target ? new Date(target.date + 'T09:00:00').getTime() : now

  let seen = 0
  let strongNow = 0
  let sumNow = 0
  let sumTarget = 0
  let atRisk = 0
  for (const c of cards) {
    const st = srsState[c.id]
    if (!st) continue
    seen++
    const rNow = recallAt(st, now)
    const rTarget = recallAt(st, targetMs)
    sumNow += rNow
    sumTarget += rTarget
    if (rNow >= RISK_RECALL) strongNow++
    if (rTarget < RISK_RECALL) atRisk++
  }

  const remaining = deck - seen
  const coverage = seen / deck
  const readinessNow = sumNow / deck
  const readinessAtTarget = sumTarget / deck

  // Pace: at the current daily new-card budget, how much of the deck will you
  // have met by the target date?
  let projectedSeen = seen
  let perDayNeeded = null
  let onPace = true
  let extraPerDay = 0
  if (daysLeft != null) {
    projectedSeen = Math.min(deck, seen + budget * Math.max(daysLeft, 0))
    perDayNeeded = daysLeft > 0 ? Math.ceil(remaining / daysLeft) : remaining
    onPace = projectedSeen >= deck
    extraPerDay = Math.max(0, perDayNeeded - budget)
  }
  const projectedCoverage = projectedSeen / deck

  // The verdict is about *pace*, not about readinessAtTarget — that number
  // assumes you stop studying entirely, so it would flag almost everyone.
  const verdict = !target
    ? 'no-target'
    : onPace
      ? 'on-track'
      : projectedCoverage >= 0.85
        ? 'tight'
        : 'behind'

  const f = {
    rotationId,
    deck,
    seen,
    remaining,
    strongNow,
    fadedNow: seen - strongNow,
    unseen: remaining,
    coverage,
    readinessNow,
    readinessAtTarget,
    atRisk,
    targetDate: target?.date || '',
    targetKind: target?.kind || '',
    targetLabel: target?.label || '',
    daysLeft,
    budget,
    projectedSeen,
    projectedCoverage,
    perDayNeeded,
    onPace,
    extraPerDay,
    verdict,
  }
  f.headline = headlineFor(f)
  return f
}

// One honest sentence: where the current pace lands you, and the fix.
export function headlineFor(f) {
  const p = (x) => Math.round(x * 100)
  if (f.verdict === 'no-target') {
    return `You've met ${p(f.coverage)}% of this deck. Add an exam date on your schedule to get a pace plan.`
  }
  const by = f.targetKind === 'exam' ? 'by exam day' : f.targetKind === 'mccqe' ? 'by the MCCQE' : 'by the end of the block'
  if (f.remaining === 0) {
    return f.atRisk > 0
      ? `You've met the whole deck — ${f.atRisk} card${f.atRisk === 1 ? '' : 's'} need at least one more review ${by}. Keep clearing due cards and you're set.`
      : `You've met the whole deck and it's all holding. Keep clearing reviews and you're set.`
  }
  if (f.onPace) {
    const spare = f.perDayNeeded > 0 ? Math.max(0, f.daysLeft - Math.ceil(f.remaining / Math.max(f.budget, 1))) : 0
    return spare >= 2
      ? `On pace — at ${f.budget} new cards/day you'll finish the deck with ~${spare} days to spare.`
      : `On pace to finish the deck ${by} — no slack, so don't skip a day.`
  }
  return `At ${f.budget} new cards/day you'll reach ${p(f.projectedCoverage)}% of the deck ${by}. You need ${f.perDayNeeded}/day to cover it all.`
}

// Forecast every rotation that has a deck and something to count down to,
// soonest target first. `decks` is [{ id, cards }].
export function forecastAll(decks, opts = {}) {
  const schedule = opts.schedule || getSchedule()
  return decks
    .map((d) => forecastRotation(d.id, d.cards, { ...opts, schedule }))
    .filter((f) => f && f.daysLeft != null)
    .sort((a, b) => a.daysLeft - b.daysLeft)
}

// Worth putting on screen? A deck you've never touched, counting down to a
// distant MCCQE, is noise — every rotation would read "0%, on pace".
export function isWorthShowing(f) {
  if (!f) return false
  return f.seen > 0 || f.targetKind === 'exam' || f.targetKind === 'end'
}

export const VERDICT_LABEL = {
  'on-track': 'On track',
  tight: 'Tight',
  behind: 'Behind pace',
  'no-target': 'No date set',
}

export function verdictColor(verdict) {
  if (verdict === 'on-track') return 'var(--good, #16a34a)'
  if (verdict === 'tight') return 'var(--warning, #d97706)'
  if (verdict === 'behind') return 'var(--danger)'
  return 'var(--text-faint)'
}
