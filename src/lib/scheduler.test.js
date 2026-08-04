// `newAllowance` is the single chokepoint the schedule-aware budget flows
// through — home counts, per-rotation counts and the cross-rotation queue all
// read it. These cover the join: phase → allowance → what's actually "due".
import { describe, it, expect, beforeEach } from 'vitest'

const store = new Map()
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  key: (i) => [...store.keys()][i] ?? null,
  get length() {
    return store.size
  },
}

const { newAllowance, countToday, sessionFor, introducedToday, noteIntroduced } = await import('./scheduler.js')

const IM = 'internal-medicine'
const ON_IM = new Date('2026-09-25T12:00:00').getTime() // inside the IM block
const deck = (n, prefix = 'c') => Array.from({ length: n }, (_, i) => ({ id: `${prefix}${i}` }))

function setSchedule() {
  store.set(
    'babyclerk:schedule',
    JSON.stringify({
      updatedAt: 1,
      mccqe: '',
      rotations: {
        [IM]: { start: '2026-09-14', end: '2026-10-11' },
        surgery: { start: '2026-11-09', end: '2027-01-17' },
      },
    })
  )
}

beforeEach(() => {
  store.clear()
})

describe('newAllowance', () => {
  it('follows the rotation phase', () => {
    setSchedule()
    expect(newAllowance(IM, ON_IM)).toBe(20) // on it now
    expect(newAllowance('surgery', ON_IM)).toBe(5) // months off
  })

  it('subtracts cards already introduced today', () => {
    setSchedule()
    store.set('babyclerk:newlog:' + IM, JSON.stringify({ date: '2026-9-25', count: 6 }))
    expect(introducedToday(IM, ON_IM)).toBe(6)
    expect(newAllowance(IM, ON_IM)).toBe(14)
  })

  it('never goes negative when the limit is lowered mid-day', () => {
    setSchedule()
    store.set('babyclerk:newlog:' + IM, JSON.stringify({ date: '2026-9-25', count: 50 }))
    expect(newAllowance(IM, ON_IM)).toBe(0)
  })

  it('resets on a new day', () => {
    setSchedule()
    store.set('babyclerk:newlog:' + IM, JSON.stringify({ date: '2026-9-24', count: 20 }))
    expect(newAllowance(IM, ON_IM)).toBe(20)
  })
})

describe('countToday', () => {
  it('weights the day toward the rotation you are on', () => {
    setSchedule()
    expect(countToday(deck(500), {}, IM, ON_IM)).toBe(20)
    expect(countToday(deck(500), {}, 'surgery', ON_IM)).toBe(5)
  })

  it('is capped by how many new cards actually remain', () => {
    setSchedule()
    expect(countToday(deck(3), {}, IM, ON_IM)).toBe(3)
  })

  it('always counts due reviews, even for a paused rotation', () => {
    setSchedule()
    const after = new Date('2026-10-15T12:00:00').getTime() // IM finished
    const cards = deck(5)
    const seen = Object.fromEntries(
      cards.map((c) => [c.id, { ease: 2.5, interval: 1, reps: 1, due: '2026-10-14T00:00:00.000Z' }])
    )
    expect(newAllowance(IM, after)).toBe(0) // no new cards
    expect(countToday(cards, seen, IM, after)).toBe(5) // but reviews still land
  })
})

describe('sessionFor', () => {
  it('puts due reviews ahead of new cards and trims new to the allowance', () => {
    setSchedule()
    const cards = [...deck(2, 'seen'), ...deck(50, 'new')]
    const seen = {
      seen0: { ease: 2.5, interval: 1, reps: 1, due: '2026-09-24T00:00:00.000Z' },
      seen1: { ease: 2.5, interval: 1, reps: 1, due: '2026-09-24T00:00:00.000Z' },
    }
    const s = sessionFor(cards, seen, IM, ON_IM)
    expect(s.reviews).toHaveLength(2)
    expect(s.news).toHaveLength(20)
    expect(s.all.slice(0, 2).map((c) => c.id)).toEqual(['seen0', 'seen1'])
  })

  it('still serves reviews for a rotation whose new cards are paused', () => {
    setSchedule()
    const after = new Date('2026-10-15T12:00:00').getTime()
    const cards = [...deck(1, 'seen'), ...deck(10, 'new')]
    const seen = { seen0: { ease: 2.5, interval: 1, reps: 1, due: '2026-10-01T00:00:00.000Z' } }
    const s = sessionFor(cards, seen, IM, after)
    expect(s.reviews).toHaveLength(1)
    expect(s.news).toHaveLength(0)
  })
})

describe('noteIntroduced', () => {
  it('accumulates within a day and starts over on the next', () => {
    setSchedule()
    noteIntroduced(IM, 3, ON_IM)
    noteIntroduced(IM, 2, ON_IM)
    expect(introducedToday(IM, ON_IM)).toBe(5)
    expect(newAllowance(IM, ON_IM)).toBe(15)

    const tomorrow = new Date('2026-09-26T12:00:00').getTime()
    expect(introducedToday(IM, tomorrow)).toBe(0)
  })
})
