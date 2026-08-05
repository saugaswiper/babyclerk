// Per-answer telemetry — the substrate for weak-area targeting and the adaptive
// tutor (see vault/AI-Personalization-Engine.md). Local-first, synced, capped.
// One append-only record per graded answer. Privacy: this is the user's data —
// synced to their own row, exportable/deletable, never shared.
import { readStored, writeStored } from './useLocalStorage.js'
import { conceptFor } from './ontology.js'

const KEY = 'attempts'
const CAP = 4000 // keep the most recent N; bounds the sync blob

// a: { rotation, kind, card?, cardId, topic, correct, grade?, latencyMs?, ts? }
//
// Pass `card` and the concept is resolved here, at write time — the card isn't
// available when the log is read back, and the log is append-only history we
// never rewrite. Attempts recorded before the ontology existed have no
// `concept` and fall back to `topic` everywhere downstream.
export function logAttempt(a) {
  try {
    const list = readStored(KEY, [])
    const ts = a.ts || Date.now()
    const concept = a.card ? conceptFor(a.card, a.rotation) : null
    list.push({
      id: `${ts}-${Math.random().toString(36).slice(2, 8)}`,
      ts,
      rotation: a.rotation || null,
      kind: a.kind || 'flashcard', // 'flashcard' | 'mcq' | 'viva'
      cardId: a.cardId || null,
      topic: a.topic || null,
      concept: concept?.label || null,
      conceptId: concept?.id || null,
      correct: !!a.correct,
      grade: a.grade || null, // flashcards: 'again' | 'hard' | 'good'
      latencyMs: a.latencyMs != null ? Math.round(a.latencyMs) : null,
    })
    if (list.length > CAP) list.splice(0, list.length - CAP)
    writeStored(KEY, list)
  } catch {
    /* never let logging break a study session */
  }
}

export function getAttempts() {
  return readStored(KEY, [])
}

export function clearAttempts() {
  writeStored(KEY, [])
}

function bump(map, k, correct, meta) {
  const e = map[k] || (map[k] = { n: 0, correct: 0, ...meta })
  e.n += 1
  if (correct) e.correct += 1
}

// The label we roll mastery up by: the normalized concept when we have one,
// otherwise the card's raw topic string (pre-ontology attempts, and cards we
// couldn't classify).
export function topicKeyOf(a) {
  return a.concept || a.topic || null
}

// Accuracy rolled up by rotation and by rotation+concept. Keys are composite but
// each entry also carries its own rotation/topic fields, so names with any
// characters (spaces, punctuation) are safe.
export function summarize(attempts = getAttempts()) {
  const byRotation = {}
  const byTopic = {}
  const byConcept = {}
  for (const a of attempts) {
    const rotation = a.rotation || 'unknown'
    bump(byRotation, rotation, a.correct, { rotation })
    const topic = topicKeyOf(a)
    if (topic) {
      bump(byTopic, JSON.stringify([rotation, topic]), a.correct, { rotation, topic })
      // Cross-rotation view: the same concept met in different blocks. This is
      // the payoff of the ontology — "you're weak on fluids everywhere".
      if (a.conceptId) {
        const e = byConcept[a.conceptId] || (byConcept[a.conceptId] = { conceptId: a.conceptId, topic: a.concept, n: 0, correct: 0, rotations: new Set() })
        e.n += 1
        if (a.correct) e.correct += 1
        e.rotations.add(rotation)
      }
    }
  }
  return { byRotation, byTopic, byConcept, total: attempts.length }
}

// Concepts you've met in more than one rotation, weakest first — a weakness
// that follows you between blocks is worth more attention than a local one.
export function crossRotationWeakness(attempts = getAttempts(), { min = 6, limit = 4 } = {}) {
  const { byConcept } = summarize(attempts)
  return Object.values(byConcept)
    .filter((e) => e.rotations.size > 1 && e.n >= min)
    .map((e) => ({ ...e, rotations: [...e.rotations], acc: e.correct / e.n }))
    .sort((a, b) => a.acc - b.acc || b.n - a.n)
    .slice(0, limit)
}

// Weakest topics: lowest accuracy first, requiring a minimum sample size so a
// single miss doesn't dominate. Returns [{ rotation, topic, n, correct, acc }].
export function weakestTopics(attempts = getAttempts(), { min = 3, limit = 8 } = {}) {
  const { byTopic } = summarize(attempts)
  return Object.values(byTopic)
    .map((e) => ({ ...e, acc: e.correct / e.n }))
    .filter((t) => t.n >= min)
    .sort((a, b) => a.acc - b.acc || b.n - a.n)
    .slice(0, limit)
}
