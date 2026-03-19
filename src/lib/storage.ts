import { WorkoutState } from '../types'

export const STORAGE_KEY = 'street-lifting-data'

/** Returns local date as YYYY-MM-DD (avoids UTC offset bugs from toISOString) */
export function toLocalDateString(date: Date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export const initialState: WorkoutState = {
  currentWeek: 1,
  currentPhase: 1,
  workouts: {},
  personalRecords: {},
}

export function loadState(): WorkoutState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || !parsed.workouts) return initialState
    return { ...initialState, ...parsed }
  } catch {
    return initialState
  }
}

export function saveState(state: WorkoutState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Safari private browsing or quota exceeded
  }
}
