// Stores user-added study content (from AI generation or import) in localStorage,
// layered on top of the built-in seeded rotation content.
import { getRotation } from '../data/rotations/index.js'

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

// Returns the rotation with user content merged into the built-in arrays.
export function getRotationMerged(rotationId) {
  const base = getRotation(rotationId)
  if (!base) return base
  const custom = loadCustom(rotationId)
  return {
    ...base,
    flashcards: [...base.flashcards, ...custom.flashcards],
    viva: [...base.viva, ...custom.viva],
    mcqs: [...base.mcqs, ...custom.mcqs],
  }
}
