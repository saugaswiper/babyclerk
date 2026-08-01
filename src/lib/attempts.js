// Per-answer telemetry — the substrate for weak-area targeting and the adaptive
// tutor (see vault/AI-Personalization-Engine.md). Local-first, synced, capped.
// One append-only record per graded answer. Privacy: this is the user's data —
// synced to their own row, exportable/deletable, never shared.
import { readStored, writeStored } from './useLocalStorage.js'

const KEY = 'attempts'
const CAP = 4000 // keep the most recent N; bounds the sync blob

// a: { rotation, kind, cardId, topic, correct, grade?, latencyMs?, ts? }
export function logAttempt(a) {
  try {
    const list = readStored(KEY, [])
    const ts = a.ts || Date.now()
    list.push({
      id: `${ts}-${Math.random().toString(36).slice(2, 8)}`,
      ts,
      rotation: a.rotation || null,
      kind: a.kind || 'flashcard', // 'flashcard' | 'mcq' | 'viva'
      cardId: a.cardId || null,
      topic: a.topic || null,
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

// Accuracy rolled up by rotation and by rotation+topic. Keys are composite but
// each entry also carries its own rotation/topic fields, so topic names with
// any characters (spaces, punctuation) are safe.
export function summarize(attempts = getAttempts()) {
  const byRotation = {}
  const byTopic = {}
  for (const a of attempts) {
    const rotation = a.rotation || 'unknown'
    bump(byRotation, rotation, a.correct, { rotation })
    if (a.topic) {
      bump(byTopic, JSON.stringify([rotation, a.topic]), a.correct, { rotation, topic: a.topic })
    }
  }
  return { byRotation, byTopic, total: attempts.length }
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
