// Where each rotation sits relative to today, and how much NEW material that
// phase deserves. This is the daily-budget half of the prioritizer described in
// vault/AI-Personalization-Engine.md (Layer 3): `orderForFocus` decides the
// ORDER of what's already due, this decides HOW MUCH new material a rotation
// opens up in the first place.
//
// Reviews are never touched. Once a card has been seen, spaced repetition owns
// it and it comes back when it's due no matter which block you're on —
// otherwise finishing a rotation would quietly erase what you learned on it.
// Only the brand-new-card tap opens and closes here.
import { getSchedule, hasSchedule, todayStr, daysUntil, examDaysFor, countdown } from './schedule.js'
import { getNewLimit, isAdaptiveBudget } from './settings.js'

// A rotation starts priming this many days before day one.
export const LEAD_DAYS = 21
// An exam this close keeps a deck open even after its block has ended.
export const EXAM_TAIL_DAYS = 30
// Inside this window the MCCQE pulls every deck back up to a broad sweep.
export const MCCQE_SWEEP_DAYS = 60

// weight scales the daily new-card limit — a ladder of quarters, so "why am I
// seeing this much?" always has a one-sentence answer. `short` is the home-tile
// pill. Only a finished block drops to zero: everything still ahead of you keeps
// at least a trickle, so entering a schedule early never empties the app.
const PHASES = {
  current: { weight: 1, label: 'On rotation now', short: 'on now' },
  exam: { weight: 0.75, label: 'Exam coming up', short: 'exam soon' },
  upcoming: { weight: 0.5, label: 'Starts soon', short: 'starts soon' },
  sweep: { weight: 0.5, label: 'MCCQE sweep', short: 'MCCQE' },
  later: { weight: 0.25, label: 'Later in the year', short: 'light trickle' },
  undated: { weight: 0.25, label: 'No dates set', short: 'no dates' },
  done: { weight: 0, label: 'Block finished', short: 'reviews only' },
  // No schedule entered at all — pacing stays exactly as it was before.
  off: { weight: 1, label: '', short: '' },
}

function basePhase(entry, today, now) {
  if (!entry.start && !entry.end) return 'undated'
  const started = entry.start ? entry.start <= today : false
  const finished = entry.end ? entry.end < today : false
  if (started && !finished) return 'current'
  if (finished) return 'done'
  const startsIn = daysUntil(entry.start, now)
  if (startsIn != null && startsIn > 0) return startsIn <= LEAD_DAYS ? 'upcoming' : 'later'
  return 'undated'
}

// Floors only ever raise the budget — being on the rotation outranks everything.
function raise(phase, candidate) {
  return PHASES[candidate].weight > PHASES[phase].weight ? candidate : phase
}

function noteFor(phase, { startsIn, examIn, mccqeIn }) {
  switch (phase) {
    case 'current':
      return 'You’re on it now — full new-card pace.'
    case 'exam':
      return `Exam ${countdown(examIn)} — still opening new cards to finish the deck.`
    case 'upcoming':
      return `Starts ${countdown(startsIn)} — priming now so you don’t walk in cold.`
    case 'sweep':
      return `MCCQE ${countdown(mccqeIn)} — every deck back in rotation.`
    case 'undated':
      return 'No dates set — light background pace.'
    case 'later':
      return startsIn != null
        ? `Starts ${countdown(startsIn)} — a light trickle until it’s closer.`
        : 'A light trickle for now.'
    case 'done':
      return 'Block finished — reviews only, so what you learned sticks.'
    default:
      return ''
  }
}

function describe(phase, ctx) {
  const meta = PHASES[phase]
  return {
    phase,
    weight: meta.weight,
    label: meta.label,
    short: meta.short,
    note: noteFor(phase, ctx),
    startsIn: ctx.startsIn,
    examIn: ctx.examIn,
    mccqeIn: ctx.mccqeIn,
  }
}

// Where this rotation sits today: { phase, weight, label, short, note, startsIn, examIn, mccqeIn }
export function phaseFor(rotationId, { schedule = getSchedule(), now = Date.now() } = {}) {
  const empty = { startsIn: null, examIn: null, mccqeIn: null }
  if (!hasSchedule(schedule)) return describe('off', empty)

  const entry = schedule.rotations[rotationId] || {}
  const ctx = {
    startsIn: daysUntil(entry.start, now),
    examIn: examDaysFor(rotationId, schedule, now),
    mccqeIn: daysUntil(schedule.mccqe, now),
  }

  let phase = basePhase(entry, todayStr(now), now)
  if (ctx.examIn != null && ctx.examIn <= EXAM_TAIL_DAYS) phase = raise(phase, 'exam')
  if (ctx.mccqeIn != null && ctx.mccqeIn >= 0 && ctx.mccqeIn <= MCCQE_SWEEP_DAYS) {
    phase = raise(phase, 'sweep')
  }
  return describe(phase, ctx)
}

// Scale the user's per-rotation limit by the phase. A non-zero weight never
// rounds down to zero — a rotation that's "in play" always introduces something.
function limitFromWeight(weight) {
  const base = getNewLimit()
  if (base <= 0) return 0
  if (!isAdaptiveBudget() || weight >= 1) return base
  if (weight <= 0) return 0
  return Math.max(1, Math.round(base * weight))
}

// New cards this rotation may introduce today, before today's intros are subtracted.
export function newLimitFor(rotationId, opts = {}) {
  return limitFromWeight(phaseFor(rotationId, opts).weight)
}

// Phase + today's budget in one pass — what the UI wants.
export function rotationPlan(rotationId, opts = {}) {
  const p = phaseFor(rotationId, opts)
  return { ...p, newLimit: limitFromWeight(p.weight) }
}

// The next block to begin: { id, startsIn } (soonest first), or null.
// Includes blocks with no deck (Anesthesia/Emergency/…) — callers decide what
// to offer for those, but "what's next" should stay honest.
export function nextUp(schedule = getSchedule(), now = Date.now()) {
  let best = null
  for (const [id, r] of Object.entries(schedule.rotations || {})) {
    const startsIn = daysUntil(r.start, now)
    if (startsIn == null || startsIn <= 0) continue
    if (!best || startsIn < best.startsIn) best = { id, startsIn }
  }
  return best
}
