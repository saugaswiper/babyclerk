// Builds study sessions with a daily new-card budget, so a big bundled deck
// trickles in instead of dumping ~1,900 cards as "due" at once.
import { isNew, isReviewDue, todayStr } from './srs.js'
import { readStored, writeStored } from './useLocalStorage.js'
import { newLimitFor } from './rotationPhase.js'

// How many new cards have already been introduced in this rotation today.
export function introducedToday(rotationId, now = Date.now()) {
  const log = readStored(`newlog:${rotationId}`, null)
  if (!log || log.date !== todayStr(now)) return 0
  return log.count || 0
}

// Record that `k` new cards were introduced (resets the counter on a new day).
export function noteIntroduced(rotationId, k = 1, now = Date.now()) {
  const today = todayStr(now)
  const log = readStored(`newlog:${rotationId}`, null)
  const count = (log && log.date === today ? log.count : 0) + k
  writeStored(`newlog:${rotationId}`, { date: today, count })
}

// New cards still allowed today for this rotation. The ceiling is scaled by
// where the rotation sits on your schedule (see rotationPhase.js), so the block
// you're on leads and ones long past or far off stay at reviews only.
export function newAllowance(rotationId, now = Date.now()) {
  return Math.max(0, newLimitFor(rotationId, { now }) - introducedToday(rotationId, now))
}

// Ordered session for one rotation: reviews due first, then today's new cards.
export function sessionFor(cards, stateMap, rotationId, now = Date.now()) {
  const reviews = cards.filter((c) => isReviewDue(stateMap[c.id], now))
  const allowance = newAllowance(rotationId, now)
  const news = allowance > 0 ? cards.filter((c) => isNew(stateMap[c.id])).slice(0, allowance) : []
  return { reviews, news, all: [...reviews, ...news] }
}

// "Due today" = reviews due + today's remaining new allowance (capped by new cards left).
export function countToday(cards, stateMap, rotationId, now = Date.now()) {
  let reviews = 0
  let newLeft = 0
  for (const c of cards) {
    const st = stateMap[c.id]
    if (isReviewDue(st, now)) reviews++
    else if (isNew(st)) newLeft++
  }
  return reviews + Math.min(newLeft, newAllowance(rotationId, now))
}
