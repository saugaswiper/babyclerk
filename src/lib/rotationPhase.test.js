// The pacing ladder decides how much a student studies each day, and it's all
// date math — a silent regression here is one nobody notices until they've
// under-prepared for a rotation. Dates below are pinned to the Queen's MEDS 2028
// Stream 1 preset (Internal Medicine 2026-09-14 → 2026-10-11).
import { describe, it, expect, beforeEach } from 'vitest'
import { phaseFor, rotationPlan, nextUp, newLimitFor, LEAD_DAYS } from './rotationPhase.js'

const IM = 'internal-medicine'

// Minimal localStorage so settings.js/schedule.js reads work under node.
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

const at = (d) => new Date(`${d}T12:00:00`).getTime()

// A schedule with Internal Medicine and Surgery blocks, plus optional extras.
function sched({ rotations = {}, mccqe = '' } = {}) {
  return {
    updatedAt: 1,
    mccqe,
    rotations: {
      [IM]: { start: '2026-09-14', end: '2026-10-11' },
      surgery: { start: '2026-11-09', end: '2027-01-17' },
      ...rotations,
    },
  }
}

beforeEach(() => {
  store.clear()
})

describe('phaseFor', () => {
  it('is `current` inside the block, on both boundary days', () => {
    const s = sched()
    expect(phaseFor(IM, { schedule: s, now: at('2026-09-14') }).phase).toBe('current')
    expect(phaseFor(IM, { schedule: s, now: at('2026-09-25') }).phase).toBe('current')
    expect(phaseFor(IM, { schedule: s, now: at('2026-10-11') }).phase).toBe('current')
  })

  it('is `done` the day after the block ends', () => {
    expect(phaseFor(IM, { schedule: sched(), now: at('2026-10-12') }).phase).toBe('done')
  })

  it('primes within the lead window and only trickles outside it', () => {
    const s = sched()
    // LEAD_DAYS before the 14th is the last priming day; one more day out is not.
    const lastPriming = at('2026-09-14') - LEAD_DAYS * 86400000
    expect(phaseFor(IM, { schedule: s, now: lastPriming }).phase).toBe('upcoming')
    expect(phaseFor(IM, { schedule: s, now: lastPriming - 86400000 }).phase).toBe('later')
  })

  it('treats a rotation with no dates as undated, not as finished', () => {
    expect(phaseFor('neurology', { schedule: sched(), now: at('2026-09-25') }).phase).toBe('undated')
  })

  it('reopens a finished block when its exam is still ahead', () => {
    const s = sched({ rotations: { [IM]: { start: '2026-09-14', end: '2026-10-11', exam: '2026-10-20' } } })
    expect(phaseFor(IM, { schedule: s, now: at('2026-10-15') }).phase).toBe('exam')
  })

  it('lets the block you are on outrank its own imminent exam', () => {
    const s = sched({ rotations: { [IM]: { start: '2026-09-14', end: '2026-10-11', exam: '2026-10-09' } } })
    expect(phaseFor(IM, { schedule: s, now: at('2026-10-07') }).phase).toBe('current')
  })

  it('drops back to done once the exam has passed', () => {
    const s = sched({ rotations: { [IM]: { start: '2026-09-14', end: '2026-10-11', exam: '2026-10-20' } } })
    expect(phaseFor(IM, { schedule: s, now: at('2026-10-21') }).phase).toBe('done')
  })

  it('sweeps every finished deck back in when the MCCQE is near', () => {
    const s = sched({ mccqe: '2026-11-20' })
    expect(phaseFor(IM, { schedule: s, now: at('2026-10-15') }).phase).toBe('sweep')
  })

  it('does not let the MCCQE sweep demote the rotation you are on', () => {
    const s = sched({ mccqe: '2026-10-20' })
    expect(phaseFor(IM, { schedule: s, now: at('2026-09-25') }).phase).toBe('current')
  })

  it('reports `off` — and full pace — when no schedule exists at all', () => {
    const empty = { updatedAt: 0, mccqe: '', rotations: {} }
    const p = phaseFor(IM, { schedule: empty, now: at('2026-09-25') })
    expect(p.phase).toBe('off')
    expect(p.weight).toBe(1)
  })
})

describe('newLimitFor', () => {
  const on = at('2026-09-25') // mid-Internal-Medicine

  it('gives the current block the full limit and scales the rest down', () => {
    const s = sched()
    expect(newLimitFor(IM, { schedule: s, now: on })).toBe(20)
    expect(newLimitFor('surgery', { schedule: s, now: on })).toBe(5) // later, x0.25
  })

  it('pauses new cards for a finished block but never for one still ahead', () => {
    const s = sched()
    const after = at('2026-10-15')
    expect(newLimitFor(IM, { schedule: s, now: after })).toBe(0)
    // Surgery hasn't happened yet — it must keep a trickle, or a student who
    // sets their schedule early opens an app with nothing in it.
    expect(newLimitFor('surgery', { schedule: s, now: after })).toBeGreaterThan(0)
  })

  it('respects a custom base limit', () => {
    store.set('babyclerk:newLimit', '8')
    const s = sched()
    expect(newLimitFor(IM, { schedule: s, now: on })).toBe(8)
    expect(newLimitFor('surgery', { schedule: s, now: on })).toBe(2)
  })

  it('never rounds a rotation that is still in play down to zero', () => {
    store.set('babyclerk:newLimit', '1') // 1 x 0.25 would round to 0
    expect(newLimitFor('surgery', { schedule: sched(), now: on })).toBe(1)
  })

  it('honours a base limit of 0 as reviews-only everywhere', () => {
    store.set('babyclerk:newLimit', '0')
    expect(newLimitFor(IM, { schedule: sched(), now: on })).toBe(0)
  })

  it('falls back to a flat limit when adaptive pacing is switched off', () => {
    store.set('babyclerk:adaptiveBudget', '0')
    const s = sched()
    expect(newLimitFor(IM, { schedule: s, now: on })).toBe(20)
    expect(newLimitFor('surgery', { schedule: s, now: on })).toBe(20)
  })

  it('changes nothing for a user who has entered no schedule', () => {
    const empty = { updatedAt: 0, mccqe: '', rotations: {} }
    for (const id of [IM, 'surgery', 'neurology']) {
      expect(newLimitFor(id, { schedule: empty, now: on })).toBe(20)
    }
  })
})

describe('rotationPlan', () => {
  it('carries the phase, the budget and an explanation together', () => {
    const plan = rotationPlan(IM, { schedule: sched(), now: at('2026-09-25') })
    expect(plan).toMatchObject({ phase: 'current', weight: 1, newLimit: 20 })
    expect(plan.note).toBeTruthy()
  })
})

describe('nextUp', () => {
  it('picks the soonest block that has not started', () => {
    expect(nextUp(sched(), at('2026-09-25'))).toEqual({ id: 'surgery', startsIn: 45 })
  })

  it('ignores the block currently running', () => {
    expect(nextUp(sched(), at('2026-09-25')).id).not.toBe(IM)
  })

  it('returns null once everything has started', () => {
    expect(nextUp(sched(), at('2027-06-01'))).toBeNull()
  })
})
