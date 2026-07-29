// Sync all BabyClerk progress (SRS schedule, quiz bests, checklists, imported/AI
// cards, prefs) to the `progress` table as one JSON blob per user. Offline-first:
// on sign-in we MERGE remote into local card-by-card so studying on two devices
// (or offline on the wards) doesn't clobber anything.
import { supabase } from './supabaseClient.js'

const PREFIX = 'babyclerk:'
const EXCLUDE = new Set(['babyclerk:apiKey']) // never sync the API key

// Map of strippedKey -> raw localStorage string (values are stored as-is).
function localBlob() {
  const out = {}
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k && k.startsWith(PREFIX) && !EXCLUDE.has(k)) out[k.slice(PREFIX.length)] = localStorage.getItem(k)
  }
  return out
}

// Stable snapshot string for change detection (keys sorted).
export function snapshot() {
  const b = localBlob()
  return JSON.stringify(Object.keys(b).sort().map((k) => [k, b[k]]))
}

const pj = (raw, fb) => {
  try {
    return raw == null ? fb : JSON.parse(raw)
  } catch {
    return fb
  }
}

// Merge one key's local + remote raw values into the value we should keep.
function mergeKey(key, localRaw, remoteRaw) {
  if (localRaw == null) return remoteRaw
  if (remoteRaw == null) return localRaw
  if (localRaw === remoteRaw) return localRaw

  if (key.startsWith('srs:')) {
    const a = pj(localRaw, {})
    const b = pj(remoteRaw, {})
    const out = { ...a }
    for (const [id, st] of Object.entries(b)) {
      const cur = out[id]
      if (!cur) out[id] = st
      else {
        // Keep whichever was reviewed more recently (more reps, then later due).
        const newer = (st.reps || 0) > (cur.reps || 0) || (Date.parse(st.due) || 0) > (Date.parse(cur.due) || 0)
        if (newer) out[id] = st
      }
    }
    return JSON.stringify(out)
  }

  if (key.startsWith('custom:')) {
    const a = pj(localRaw, {})
    const b = pj(remoteRaw, {})
    const union = (x = [], y = []) => {
      const seen = new Set(x.map((i) => i.id))
      return [...x, ...y.filter((i) => !seen.has(i.id))]
    }
    return JSON.stringify({
      flashcards: union(a.flashcards, b.flashcards),
      viva: union(a.viva, b.viva),
      mcqs: union(a.mcqs, b.mcqs),
    })
  }

  if (key.startsWith('checklist:')) {
    const a = pj(localRaw, {})
    const b = pj(remoteRaw, {})
    const out = { ...a }
    for (const [k, v] of Object.entries(b)) out[k] = out[k] || v
    return JSON.stringify(out)
  }

  if (key.startsWith('quizbest:')) {
    return JSON.stringify(Math.max(pj(localRaw, 0) || 0, pj(remoteRaw, 0) || 0))
  }

  if (key.startsWith('newlog:')) {
    const a = pj(localRaw, null)
    const b = pj(remoteRaw, null)
    if (!a) return remoteRaw
    if (!b) return localRaw
    if (a.date === b.date) return JSON.stringify({ date: a.date, count: Math.max(a.count || 0, b.count || 0) })
    return JSON.stringify(a.date > b.date ? a : b)
  }

  if (key === 'schedule') {
    const a = pj(localRaw, null)
    const b = pj(remoteRaw, null)
    if (!a) return remoteRaw
    if (!b) return localRaw
    // Keep the schedule edited most recently on any device.
    return JSON.stringify((b.updatedAt || 0) > (a.updatedAt || 0) ? b : a)
  }

  // Preferences (model, newLimit) and anything else: keep this device's value.
  return localRaw
}

// Pull the user's remote blob and merge into localStorage. Returns true if local changed.
export async function pullMerge() {
  const { data, error } = await supabase.from('progress').select('data').maybeSingle()
  if (error) throw error
  const remote = data?.data || {}
  const local = localBlob()
  const keys = new Set([...Object.keys(local), ...Object.keys(remote)])
  let changed = false
  for (const k of keys) {
    const merged = mergeKey(k, local[k] ?? null, remote[k] ?? null)
    if (merged == null) continue
    const full = PREFIX + k
    if (merged !== localStorage.getItem(full)) {
      localStorage.setItem(full, merged)
      changed = true
    }
  }
  return changed
}

// Upload the current local blob for this user.
export async function pushLocal(userId) {
  const { error } = await supabase
    .from('progress')
    .upsert({ user_id: userId, data: localBlob(), updated_at: new Date().toISOString() })
  if (error) throw error
}
