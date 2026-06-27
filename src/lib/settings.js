// API key + model settings, stored locally in the browser.
const KEY_API = 'babyclerk:apiKey'
const KEY_MODEL = 'babyclerk:model'

export const DEFAULT_MODEL = 'claude-opus-4-8'

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
