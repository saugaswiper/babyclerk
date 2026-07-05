import { useCallback, useEffect, useState } from 'react'

const PREFIX = 'babyclerk:'

// Persist a piece of state to localStorage so progress survives reloads.
export function useLocalStorage(key, initialValue) {
  const fullKey = PREFIX + key
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(fullKey)
      return raw != null ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(fullKey, JSON.stringify(value))
    } catch {
      /* storage full or unavailable — fail silently */
    }
  }, [fullKey, value])

  const reset = useCallback(() => setValue(initialValue), [initialValue])

  return [value, setValue, reset]
}

// One-off read without subscribing (used for dashboard stats).
export function readStored(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw != null ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

// One-off write (used by cross-rotation flows like Study Today).
export function writeStored(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    /* storage full or unavailable — fail silently */
  }
}
