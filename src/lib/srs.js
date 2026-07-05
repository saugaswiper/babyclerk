// A lightweight SM-2-style spaced-repetition scheduler.
// Each card's review state is { ease, interval, due, reps }.
// `due` is an ISO date string; a card is "due" when due <= now.

const DAY = 24 * 60 * 60 * 1000

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

// grade: 'again' (0) | 'hard' (3) | 'good' (5)
export function review(state, grade, now = Date.now()) {
  const s = state ? { ...state } : freshState()

  if (grade === 'again') {
    s.ease = Math.max(1.3, s.ease - 0.2)
    s.interval = 0
    s.reps = 0
    s.due = new Date(now + 10 * 60 * 1000).toISOString() // 10 min — same session
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
