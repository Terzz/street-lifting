import { WorkoutState } from '../types'
import { initialState, toLocalDateString } from './storage'

export function exportJSON(state: WorkoutState): void {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `street-lifting-backup-${toLocalDateString()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function exportCSV(state: WorkoutState): void {
  const rows = ['Date,Jour,Exercice,Serie,Reps,Charge (kg)']
  for (const [date, session] of Object.entries(state.workouts)) {
    for (const exercise of session.exercises) {
      exercise.sets.forEach((set, i) => {
        if (set.done) {
          rows.push(`${date},${session.day},${exercise.name},${i + 1},${set.reps},${set.weight}`)
        }
      })
    }
  }
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `street-lifting-export-${toLocalDateString()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function parseImportedJSON(text: string): WorkoutState | null {
  try {
    const parsed = JSON.parse(text)
    if (!parsed || typeof parsed !== 'object' || !parsed.workouts) return null
    return { ...initialState, ...parsed }
  } catch {
    return null
  }
}
