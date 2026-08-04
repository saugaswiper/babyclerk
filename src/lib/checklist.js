// Prep-checklist progress. Ticks are stored by index under `checklist:<id>`
// (see pages/Checklist.jsx), so progress is just a count over that map.
import { readStored } from './useLocalStorage.js'

export function prepProgress(rotationId, checklist = []) {
  const checked = readStored(`checklist:${rotationId}`, {})
  const done = checklist.reduce((n, _, i) => (checked[i] ? n + 1 : n), 0)
  return { done, total: checklist.length, left: checklist.length - done }
}
