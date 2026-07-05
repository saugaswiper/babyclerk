// Collect due flashcards across every rotation (built-in + your imported/AI cards)
// for the one-tap "Study due" session.
import { rotations } from '../data/rotations/index.js'
import { getRotationMerged } from './customContent.js'
import { readStored } from './useLocalStorage.js'
import { isDue } from './srs.js'

export function collectDue(now = Date.now()) {
  const entries = []
  for (const r of rotations) {
    const merged = getRotationMerged(r.id)
    const srs = readStored(`srs:${r.id}`, {})
    for (const card of merged.flashcards) {
      if (isDue(srs[card.id], now)) {
        entries.push({ rotationId: r.id, rotationName: r.name, emoji: r.emoji, card })
      }
    }
  }
  return entries
}

export function countAllDue(now = Date.now()) {
  return collectDue(now).length
}
