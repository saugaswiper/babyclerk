// Stores user-added study content (from AI generation or import) in localStorage,
// layered on top of the built-in seeded rotation content.
import { getRotation } from '../data/rotations/index.js'
import { montisCards } from '../data/montis/index.js'
import { readStored, writeStored } from './useLocalStorage.js'
import { freshState } from './srs.js'

const PREFIX = 'babyclerk:custom:'

// Small stable string hash so re-missing the same question doesn't duplicate the card.
function hashStr(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}

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

// Turn a missed MCQ into a flashcard, seeded as due NOW so it bypasses the
// daily new-card cap and shows up in your very next review. Idempotent per
// question (re-missing won't duplicate). Returns true if newly added.
export function addMissCard(rotationId, mcq) {
  const id = `miss-${hashStr(mcq.question)}`
  const current = loadCustom(rotationId)
  if (current.flashcards.some((c) => c.id === id)) return false

  const letter = String.fromCharCode(65 + mcq.answer)
  const back =
    `Correct: ${letter}. ${mcq.options[mcq.answer]}` +
    (mcq.explanation ? `\n\n${mcq.explanation}` : '')
  current.flashcards.push({
    id,
    topic: mcq.topic ? `Missed · ${mcq.topic}` : 'Missed questions',
    front: mcq.question,
    back,
    custom: true,
    miss: true,
  })
  saveCustom(rotationId, current)

  // Seed SRS state so it's review-due immediately (not gated by the new-card budget).
  const srsKey = `srs:${rotationId}`
  const srs = readStored(srsKey, {})
  if (!srs[id]) {
    srs[id] = freshState()
    writeStored(srsKey, srs)
  }
  return true
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
