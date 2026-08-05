// Adaptive pacing: the daily new-card budget stops being a fixed number and
// responds to the calendar. Early in a block, if you're behind on coverage,
// it pushes harder; in the last two weeks before an exam it tapers new
// material so the session becomes consolidation rather than cramming.
//
// Deliberately deterministic and explainable — every decision comes back with
// a `reason` string the UI can show, because a study app that silently changes
// your workload is a study app you stop trusting.
//
// See vault/Improvement-Proposals.md (P5).
import { getNewLimit, getScheduler } from './settings.js'
import { getSchedule, daysUntil } from './schedule.js'

const MAX_MULTIPLIER = 2 // never more than double the chosen pace

function targetDays(rotationId, schedule) {
  const block = schedule.rotations[rotationId] || {}
  const d = (x) => {
    const n = daysUntil(x)
    return n != null && n >= 0 ? n : null
  }
  return d(block.exam) ?? d(block.end)
}

/**
 * Today's new-card budget for one rotation.
 * @returns {{ budget: number, base: number, reason: string, adjusted: boolean }}
 */
export function dailyBudgetFor(rotationId, cards, stateMap, opts = {}) {
  const base = opts.newLimit != null ? opts.newLimit : getNewLimit()
  const plain = { budget: base, base, reason: '', adjusted: false }

  if (getScheduler() === 'classic' || base === 0) return plain

  const schedule = opts.schedule || getSchedule()
  const daysLeft = targetDays(rotationId, schedule)
  if (daysLeft == null) return plain

  // Final stretch: stop feeding in new material, consolidate what's there.
  if (daysLeft <= 3) {
    return { budget: 0, base, adjusted: true, reason: `Exam in ${daysLeft} day${daysLeft === 1 ? '' : 's'} — reviews only, no new cards.` }
  }
  if (daysLeft <= 7) {
    const budget = Math.max(1, Math.round(base * 0.4))
    return { budget, base, adjusted: true, reason: `Exam in ${daysLeft} days — easing off new cards to make room for review.` }
  }
  if (daysLeft <= 14) {
    const budget = Math.max(1, Math.round(base * 0.7))
    return { budget, base, adjusted: true, reason: `Exam in ${daysLeft} days — tapering new cards as review load builds.` }
  }

  // Still time to cover ground: push harder if coverage is behind schedule.
  const deck = cards?.length || 0
  if (!deck) return plain
  let seen = 0
  for (const c of cards) if (stateMap?.[c.id]) seen++
  const remaining = deck - seen
  if (remaining === 0) return plain

  const needed = Math.ceil(remaining / daysLeft)
  if (needed <= base) return plain

  const budget = Math.min(needed, base * MAX_MULTIPLIER)
  return {
    budget,
    base,
    adjusted: true,
    reason: `${remaining} cards left and ${daysLeft} days — raised to ${budget}/day to cover the deck in time.`,
  }
}
