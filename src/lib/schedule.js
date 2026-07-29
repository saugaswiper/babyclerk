// Rotation schedule + exam dates (optional). Drives current-rotation
// prioritization and exam countdowns on the home screen. Stored locally and
// synced like other progress. See vault/AI-Personalization-Engine.md — this is
// the date-awareness substrate the adaptive tutor builds on.
import { readStored, writeStored } from './useLocalStorage.js'

const KEY = 'schedule'

// Shape: { updatedAt, mccqe: 'YYYY-MM-DD'|'', rotations: { [id]: { start, end, exam } } }
export function getSchedule() {
  const s = readStored(KEY, null)
  if (!s || typeof s !== 'object') return { updatedAt: 0, mccqe: '', rotations: {} }
  return { updatedAt: s.updatedAt || 0, mccqe: s.mccqe || '', rotations: s.rotations || {} }
}

export function setSchedule(next) {
  writeStored(KEY, { ...next, updatedAt: Date.now() })
}

// Local YYYY-MM-DD (string comparison works for these, so no timezone math needed).
export function todayStr() {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

// Whole days from today until dateStr (negative = past). null if no/invalid date.
export function daysUntil(dateStr) {
  if (!dateStr) return null
  const today = new Date(todayStr() + 'T00:00:00')
  const target = new Date(dateStr + 'T00:00:00')
  if (Number.isNaN(target.getTime())) return null
  return Math.round((target - today) / 86400000)
}

export function countdown(days) {
  if (days == null) return ''
  if (days === 0) return 'today'
  if (days === 1) return 'tomorrow'
  if (days < 0) return `${-days} day${days === -1 ? '' : 's'} ago`
  return `in ${days} days`
}

export function getCurrentRotationId(schedule = getSchedule()) {
  const today = todayStr()
  for (const [id, r] of Object.entries(schedule.rotations)) {
    if (r.start && r.end && r.start <= today && today <= r.end) return id
  }
  return null
}

// Future exams, soonest first: [{ rotationId, date, days, label? }]
export function getUpcomingExams(schedule = getSchedule()) {
  const out = []
  for (const [id, r] of Object.entries(schedule.rotations)) {
    if (r.exam) {
      const days = daysUntil(r.exam)
      if (days != null && days >= 0) out.push({ rotationId: id, date: r.exam, days })
    }
  }
  if (schedule.mccqe) {
    const days = daysUntil(schedule.mccqe)
    if (days != null && days >= 0) out.push({ rotationId: null, date: schedule.mccqe, days, label: 'MCCQE' })
  }
  return out.sort((a, b) => a.days - b.days)
}

// Days until this rotation's exam (future only), or null.
export function examDaysFor(rotationId, schedule = getSchedule()) {
  const exam = schedule.rotations[rotationId]?.exam
  const d = daysUntil(exam)
  return d != null && d >= 0 ? d : null
}

export function hasSchedule(schedule = getSchedule()) {
  return Object.keys(schedule.rotations).length > 0 || !!schedule.mccqe
}
