// Collect due flashcards across every rotation (built-in + your imported/AI cards)
// for the one-tap "Study due" session, and order them so the most valuable cards
// come first. See vault/AI-Personalization-Engine.md (the prioritizer layer).
import { rotations } from '../data/rotations/index.js'
import { getRotationMerged } from './customContent.js'
import { readStored } from './useLocalStorage.js'
import { sessionFor } from './scheduler.js'
import { isNew } from './srs.js'
import { getAttempts, summarize } from './attempts.js'
import { getSchedule, examDaysFor } from './schedule.js'

// Everything to study now, across rotations — reviews due + each rotation's
// remaining daily new-card allowance.
export function collectDue(now = Date.now()) {
  const entries = []
  for (const r of rotations) {
    const merged = getRotationMerged(r.id)
    const srs = readStored(`srs:${r.id}`, {})
    for (const card of sessionFor(merged.flashcards, srs, r.id, now).all) {
      entries.push({
        rotationId: r.id,
        rotationName: r.name,
        emoji: r.emoji,
        card,
        isNew: isNew(srs[card.id]),
      })
    }
  }
  return entries
}

// Reorder a due queue so weak topics and imminent-exam rotations rise. This
// changes only the ORDER, never what's due — and reviews still precede brand-new
// cards, so spaced-repetition timing is untouched. If the user does only part of
// a session, they hit what matters most first.
export function orderForFocus(
  entries,
  { attempts = getAttempts(), schedule = getSchedule() } = {}
) {
  const { byTopic } = summarize(attempts)

  // Known accuracy for a (rotation, topic), or null if too few attempts.
  const topicAcc = (rotationId, topic) => {
    if (!topic) return null
    const e = byTopic[JSON.stringify([rotationId, topic])]
    if (!e || e.n < 3) return null
    return e.correct / e.n
  }

  const examBoost = (rotationId) => {
    const d = examDaysFor(rotationId, schedule)
    if (d == null) return 0
    if (d <= 3) return 0.6
    if (d <= 7) return 0.45
    if (d <= 14) return 0.3
    if (d <= 30) return 0.15
    return 0
  }

  const score = (e) => {
    const acc = topicAcc(e.rotationId, e.card.topic)
    const weakness = acc == null ? 0.3 : 1 - acc // unknown topics sit neutral
    return weakness + examBoost(e.rotationId)
  }

  return entries
    .map((e, i) => ({ e, i, s: score(e) }))
    // reviews before new; then weakest/most-urgent first; stable on ties.
    .sort((a, b) => (a.e.isNew ? 1 : 0) - (b.e.isNew ? 1 : 0) || b.s - a.s || a.i - b.i)
    .map((x) => x.e)
}

// True when there's enough signal (weak topics or set exams) for ordering to
// meaningfully differ from the default — used to show a subtle UI hint.
export function hasFocusData(attempts = getAttempts(), schedule = getSchedule()) {
  const { byTopic } = summarize(attempts)
  const enoughTopic = Object.values(byTopic).some((e) => e.n >= 3)
  const anyExam = Object.values(schedule.rotations || {}).some((r) => r.exam)
  return enoughTopic || anyExam
}

export function countAllDue(now = Date.now()) {
  return collectDue(now).length
}
