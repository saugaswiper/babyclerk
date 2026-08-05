// Spaced repetition. Two schedulers live here:
//
//   'adaptive' (default) — FSRS-4.5, see fsrs.js
//   'classic'            — the original SM-2-style scheduler, kept as an escape hatch
//
// A card's state is { ease, interval, due, reps, last } plus { s, d } once FSRS
// has touched it. Both schedulers maintain `interval`/`due`/`reps`/`last`, and
// FSRS never discards the SM-2 fields — so switching modes in either direction
// is safe, and migration happens lazily on each card's next review.
// `due` is an ISO date string; a card is "due" when due <= now.
import { fsrsReview, easeFromDifficulty } from './fsrs.js'
import { getScheduler } from './settings.js'

const DAY = 24 * 60 * 60 * 1000
const LAPSE_DELAY = 10 * 60 * 1000 // re-show a failed card later in the same session

export function freshState() {
  return { ease: 2.5, interval: 0, due: new Date().toISOString(), reps: 0 }
}

export function isDue(state, now = Date.now()) {
  if (!state) return true
  return new Date(state.due).getTime() <= now
}

// A card is "new" until it has been graded once (no stored state).
export function isNew(state) {
  return !state
}

// A card is "review-due" only if it has been seen before and its due time has passed.
export function isReviewDue(state, now = Date.now()) {
  return !!state && new Date(state.due).getTime() <= now
}

// Local calendar day (device timezone) used for the daily new-card budget.
export function todayStr(now = Date.now()) {
  const d = new Date(now)
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

// When was this card last reviewed? Cards from before `last` existed infer it
// from their due date and interval, which is exactly how they were scheduled.
export function lastReviewedAt(state) {
  if (!state) return null
  if (state.last) return state.last
  const due = Date.parse(state.due)
  if (!Number.isFinite(due)) return null
  const span = state.interval > 0 ? state.interval : 0.5
  return due - span * DAY
}

// grade: 'again' | 'hard' | 'good'
export function review(state, grade, now = Date.now()) {
  return getScheduler() === 'classic' ? sm2Review(state, grade, now) : adaptiveReview(state, grade, now)
}

function adaptiveReview(state, grade, now) {
  const last = lastReviewedAt(state)
  const elapsedDays = last != null ? Math.max(0, (now - last) / DAY) : 0
  const { s, d, interval } = fsrsReview(state, grade, elapsedDays)

  const prev = state || freshState()
  const next = {
    ...prev,
    s,
    d,
    interval,
    last: now,
    reps: grade === 'again' ? 0 : (prev.reps || 0) + 1,
    // Keep the SM-2 field maintained so switching back to 'classic' still works.
    // Derived from FSRS difficulty rather than nudged, so it recovers when you
    // recover — see easeFromDifficulty().
    ease: easeFromDifficulty(d),
  }
  // A failed card comes back this session; its FSRS interval still governs the
  // next real review once it's recalled.
  next.due = new Date(grade === 'again' ? now + LAPSE_DELAY : now + interval * DAY).toISOString()
  return next
}

function sm2Review(state, grade, now = Date.now()) {
  const s = state ? { ...state, last: now } : { ...freshState(), last: now }

  if (grade === 'again') {
    s.ease = Math.max(1.3, s.ease - 0.2)
    s.interval = 0
    s.reps = 0
    s.due = new Date(now + LAPSE_DELAY).toISOString() // same session
    return s
  }

  s.reps += 1

  if (grade === 'hard') {
    s.ease = Math.max(1.3, s.ease - 0.15)
    s.interval = s.interval === 0 ? 1 : Math.max(1, Math.round(s.interval * 1.2))
  } else {
    // 'good'
    s.ease = s.ease + 0.1
    if (s.reps === 1) s.interval = 1
    else if (s.reps === 2) s.interval = 3
    else s.interval = Math.round(s.interval * s.ease)
  }

  s.due = new Date(now + s.interval * DAY).toISOString()
  return s
}

// Count how many cards in a deck are currently due (or new).
export function countDue(cards, stateMap, now = Date.now()) {
  return cards.reduce((n, c) => (isDue(stateMap[c.id], now) ? n + 1 : n), 0)
}
