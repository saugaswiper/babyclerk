// API key + model settings, stored locally in the browser.
const KEY_API = 'babyclerk:apiKey'
const KEY_MODEL = 'babyclerk:model'
const KEY_NEWLIMIT = 'babyclerk:newLimit'
const KEY_SCHEDULER = 'babyclerk:scheduler'

export const DEFAULT_MODEL = 'claude-opus-4-8'
export const DEFAULT_NEW_LIMIT = 20

// Max brand-new cards introduced per rotation per day (0 = reviews only).
export function getNewLimit() {
  try {
    const raw = localStorage.getItem(KEY_NEWLIMIT)
    if (raw == null) return DEFAULT_NEW_LIMIT
    const n = parseInt(raw, 10)
    return Number.isFinite(n) && n >= 0 ? n : DEFAULT_NEW_LIMIT
  } catch {
    return DEFAULT_NEW_LIMIT
  }
}

export function setNewLimit(n) {
  localStorage.setItem(KEY_NEWLIMIT, String(Math.max(0, n | 0)))
}

// 'adaptive' = FSRS memory model + exam-aware daily load. 'classic' = the
// original SM-2 scheduler and a fixed budget. Switching is safe either way:
// both schedulers maintain the same card fields. See vault/Features.md.
export function getScheduler() {
  try {
    return localStorage.getItem(KEY_SCHEDULER) === 'classic' ? 'classic' : 'adaptive'
  } catch {
    return 'adaptive'
  }
}

export function setScheduler(mode) {
  localStorage.setItem(KEY_SCHEDULER, mode === 'classic' ? 'classic' : 'adaptive')
}

export const MODEL_OPTIONS = [
  { id: 'claude-opus-4-8', label: 'Claude Opus 4.8 — most capable' },
  { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6 — faster / cheaper' },
  { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5 — cheapest' },
]

export function getApiKey() {
  try {
    return localStorage.getItem(KEY_API) || ''
  } catch {
    return ''
  }
}

export function setApiKey(value) {
  if (value) localStorage.setItem(KEY_API, value)
  else localStorage.removeItem(KEY_API)
}

export function getModel() {
  try {
    return localStorage.getItem(KEY_MODEL) || DEFAULT_MODEL
  } catch {
    return DEFAULT_MODEL
  }
}

export function setModel(value) {
  localStorage.setItem(KEY_MODEL, value || DEFAULT_MODEL)
}
