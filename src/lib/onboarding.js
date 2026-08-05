// First-run state. The adaptive engine is invisible until the app knows the
// student's dates and has a few answers logged — onboarding exists to get
// there in about a minute. See vault/Improvement-Proposals.md (P3).
import { readStored, writeStored } from './useLocalStorage.js'
import { hasSchedule } from './schedule.js'
import { getAttempts } from './attempts.js'

const KEY = 'onboarded'

export function isOnboarded() {
  return readStored(KEY, false) === true
}

export function setOnboarded(done = true) {
  writeStored(KEY, done)
}

// Should we send this visitor to /welcome? Only someone genuinely new — never
// interrupt anyone who already has a schedule or study history (including
// users from before onboarding existed).
export function needsOnboarding() {
  if (isOnboarded()) return false
  if (hasSchedule()) return false
  return getAttempts().length === 0
}
