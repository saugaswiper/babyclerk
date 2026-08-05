// FSRS (Free Spaced Repetition Scheduler), v4.5 update equations with the
// published default parameters. Implemented directly — ~100 lines of arithmetic,
// no dependency, which keeps the offline/ward-ready constraint in
// vault/Principles.md intact.
//
// Why replace SM-2: SM-2 tracks one number (ease) and multiplies intervals by
// it, so a card you keep failing spirals into a punishingly short interval and
// never recovers ("ease hell") — it punishes exactly the struggling student
// this app exists for. FSRS models memory as two separate quantities,
// *stability* (how long the memory lasts) and *difficulty* (how hard this
// material is for you), and schedules from an explicit target retention.
//
// See vault/Improvement-Proposals.md (P5).

// prettier-ignore
const W = [
  0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.0310, 1.6474,
  0.1367, 1.0461, 2.1072, 0.0793, 0.3246, 1.5870, 0.2272, 2.8755,
]

const DECAY = -0.5
const FACTOR = Math.pow(0.9, 1 / DECAY) - 1 // 19/81
const TARGET_RETENTION = 0.9
const MIN_STABILITY = 0.1
const MAX_INTERVAL = 365 * 5

// Our UI has three buttons; FSRS grades are 1..4. We never emit "easy".
const GRADE = { again: 1, hard: 2, good: 3 }

const clampD = (d) => Math.min(10, Math.max(1, d))

// Probability of recall after `elapsedDays` at stability `s`.
export function retrievability(elapsedDays, s) {
  if (!(s > 0)) return 0
  return Math.pow(1 + (FACTOR * Math.max(0, elapsedDays)) / s, DECAY)
}

// Days until recall falls to the target retention.
export function intervalFor(s) {
  const raw = (s / FACTOR) * (Math.pow(TARGET_RETENTION, 1 / DECAY) - 1)
  return Math.min(MAX_INTERVAL, Math.max(1, Math.round(raw)))
}

const initialStability = (g) => Math.max(MIN_STABILITY, W[g - 1])
// Linear in the grade — this is the 4.5 form. (FSRS-5 uses an exponential here,
// but only with its own 19-weight set; mixing the two collapses difficulty to 1
// and makes intervals run away.)
const initialDifficulty = (g) => clampD(W[4] - (g - 3) * W[5])

function nextDifficulty(d, g) {
  const next = d - W[6] * (g - 3)
  // Mean-revert toward the difficulty of a card first rated "easy", so a single
  // bad day doesn't brand a card as hard forever.
  return clampD(W[7] * initialDifficulty(4) + (1 - W[7]) * next)
}

function stabilityOnSuccess(s, d, r, g) {
  const hardPenalty = g === 2 ? W[15] : 1
  const easyBonus = g === 4 ? W[16] : 1
  const growth =
    Math.exp(W[8]) *
    (11 - d) *
    Math.pow(s, -W[9]) *
    (Math.exp(W[10] * (1 - r)) - 1) *
    hardPenalty *
    easyBonus
  return Math.max(MIN_STABILITY, s * (1 + growth))
}

function stabilityOnLapse(s, d, r) {
  const next =
    W[11] * Math.pow(d, -W[12]) * (Math.pow(s + 1, W[13]) - 1) * Math.exp(W[14] * (1 - r))
  // A lapse can never make a memory more durable than it already was.
  return Math.max(MIN_STABILITY, Math.min(next, s))
}

// SM-2 state → FSRS state, for cards reviewed before this scheduler existed.
// The old interval was chosen to land at ~90% recall, which is exactly what
// stability means, so it transfers directly. Ease maps onto difficulty inversely.
export function fromSm2(state) {
  if (!state) return null
  if (state.s > 0) return { s: state.s, d: clampD(state.d ?? 5) }
  if (!(state.interval > 0)) return null
  // SM-2 ease runs from its 1.3 floor to about 3.5 in practice; map that span
  // onto difficulty 10..1 so the default 2.5 lands mid-scale.
  const ease = state.ease ?? 2.5
  return { s: Math.max(MIN_STABILITY, state.interval), d: clampD(10 - ((ease - 1.3) * 9) / 2.2) }
}

/**
 * One FSRS review. Returns the next {s, d, interval} — the caller owns `due`,
 * `last`, `reps` and the legacy SM-2 fields.
 * @param {object|null} state existing card state (SM-2 or FSRS), null if new
 * @param {'again'|'hard'|'good'} grade
 * @param {number} elapsedDays days since this card was last reviewed
 */
export function fsrsReview(state, grade, elapsedDays) {
  const g = GRADE[grade] || 3
  const prior = fromSm2(state)

  let s
  let d
  if (!prior) {
    s = initialStability(g)
    d = initialDifficulty(g)
  } else {
    const r = retrievability(elapsedDays, prior.s)
    d = nextDifficulty(prior.d, g)
    s = g === 1 ? stabilityOnLapse(prior.s, prior.d, r) : stabilityOnSuccess(prior.s, prior.d, r, g)
  }

  return { s, d, interval: intervalFor(s) }
}
