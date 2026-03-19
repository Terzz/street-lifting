import { WorkoutState, WorkoutSession, DayType, Phase, PRRecord, ExerciseEntry } from '../types'
import { PROGRAM, WARMUP } from '../constants/program'
import { toLocalDateString } from './storage'

/** Map for O(1) day template lookup */
const DAY_MAP = new Map(PROGRAM.map((d) => [d.id, d]))

/** Map for O(1) exercise template lookup by name */
const EXERCISE_MAP = new Map(
  PROGRAM.flatMap((d) => d.exercises.map((e) => [e.name, e]))
)

export function getDayTemplate(day: DayType) {
  return DAY_MAP.get(day) ?? null
}

export function getExerciseTemplate(name: string) {
  return EXERCISE_MAP.get(name) ?? null
}

export function getExercisesForDay(day: DayType, phase: Phase) {
  const template = DAY_MAP.get(day)!
  return template.exercises.filter((e) => !e.minPhase || e.minPhase <= phase)
}

export function createWorkoutSession(day: DayType, phase: Phase): WorkoutSession {
  const exercises = getExercisesForDay(day, phase)
  return {
    day,
    exercises: exercises.map((e) => ({
      name: e.name,
      sets: Array.from({ length: e.sets }, () => ({ reps: 0, weight: 0, done: false })),
      restSeconds: e.rest,
    })),
    warmup: WARMUP.map((w) => ({ name: w.name, done: false })),
    completed: false,
    startedAt: new Date().toISOString(),
  }
}

export function getPreviousSession(
  state: WorkoutState,
  day: DayType,
  beforeDate: string
): WorkoutSession | null {
  return (
    Object.entries(state.workouts)
      .filter(([date, w]) => w.day === day && w.completed && date < beforeDate)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([, w]) => w)[0] ?? null
  )
}

export function detectPRs(
  session: WorkoutSession,
  existing: Record<string, PRRecord>,
  date: string
): Record<string, PRRecord> {
  const updated = { ...existing }
  for (const exercise of session.exercises) {
    const doneSets = exercise.sets.filter((s) => s.done)
    if (doneSets.length === 0) continue

    const maxWeight = Math.max(...doneSets.map((s) => s.weight))
    const maxReps = Math.max(...doneSets.map((s) => s.reps))
    const current = updated[exercise.name]

    if (!current || maxWeight > current.maxWeight || maxReps > current.maxReps) {
      updated[exercise.name] = {
        maxWeight: current ? Math.max(maxWeight, current.maxWeight) : maxWeight,
        maxReps: current ? Math.max(maxReps, current.maxReps) : maxReps,
        date,
      }
    }
  }
  return updated
}

export function totalVolume(session: WorkoutSession): number {
  return session.exercises.reduce(
    (sum, ex) =>
      sum + ex.sets.reduce((s, set) => s + (set.done ? set.reps * Math.max(set.weight, 1) : 0), 0),
    0
  )
}

export function totalSets(session: WorkoutSession): number {
  return session.exercises.reduce(
    (sum, ex) => sum + ex.sets.filter((s) => s.done).length,
    0
  )
}

export function getWeekDates(weekNumber: number, referenceDate: string): string[] {
  // Week 1 starts on the Monday of the reference date's week
  const ref = new Date(referenceDate)
  const dayOfWeek = ref.getDay()
  const monday = new Date(ref)
  monday.setDate(ref.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
  // Adjust for week number
  monday.setDate(monday.getDate() + (weekNumber - 1) * 7)

  const dates: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    dates.push(toLocalDateString(d))
  }
  return dates
}

export function getPreviousSetsForExercise(
  state: WorkoutState,
  day: DayType,
  exerciseName: string,
  beforeDate: string
): ExerciseEntry | null {
  const prev = getPreviousSession(state, day, beforeDate)
  if (!prev) return null
  return prev.exercises.find((e) => e.name === exerciseName) ?? null
}
