// Stores user-added study content (from AI generation or import) in localStorage,
// layered on top of the built-in seeded rotation content.
import { getRotation } from '../data/rotations/index.js'
import { montisCards } from '../data/montis/index.js'

const PREFIX = 'babyclerk:custom:'

function key(rotationId) {
  return PREFIX + rotationId
}

export function loadCustom(rotationId) {
  try {
    const raw = localStorage.getItem(key(rotationId))
    const parsed = raw ? JSON.parse(raw) : null
    return {
      flashcards: parsed?.flashcards ?? [],
      viva: parsed?.viva ?? [],
      mcqs: parsed?.mcqs ?? [],
    }
  } catch {
    return { flashcards: [], viva: [], mcqs: [] }
  }
}

function saveCustom(rotationId, data) {
  localStorage.setItem(key(rotationId), JSON.stringify(data))
}

// Append items to a kind ('flashcards' | 'viva' | 'mcqs'). Assigns unique custom IDs.
export function appendCustom(rotationId, kind, items) {
  const current = loadCustom(rotationId)
  const stamped = items.map((it, i) => ({
    ...it,
    id: `custom-${kind}-${Date.now()}-${i}`,
    custom: true,
  }))
  current[kind] = [...current[kind], ...stamped]
  saveCustom(rotationId, current)
  return current[kind]
}

export function deleteCustom(rotationId, kind, itemId) {
  const current = loadCustom(rotationId)
  current[kind] = current[kind].filter((it) => it.id !== itemId)
  saveCustom(rotationId, current)
}

export function clearCustom(rotationId, kind) {
  const current = loadCustom(rotationId)
  current[kind] = []
  saveCustom(rotationId, current)
}

// Returns the rotation with the bundled Montis deck + your own content merged
// into the built-in arrays. Order: seeded → Montis → your imports/AI cards.
export function getRotationMerged(rotationId) {
  const base = getRotation(rotationId)
  if (!base) return base
  const custom = loadCustom(rotationId)
  const montis = montisCards(rotationId)

  // Guard against double-loading for anyone who imported the Montis files
  // before they were bundled: drop custom flashcards that duplicate a Montis
  // card by content.
  const montisKeys = new Set(montis.map((c) => c.front + '||' + c.back))
  const customCards = custom.flashcards.filter((c) => !montisKeys.has(c.front + '||' + c.back))

  return {
    ...base,
    flashcards: [...base.flashcards, ...montis, ...customCards],
    viva: [...base.viva, ...custom.viva],
    mcqs: [...base.mcqs, ...custom.mcqs],
  }
}
