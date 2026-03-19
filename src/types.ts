export type DayType = 'A' | 'B' | 'C' | 'D'
export type Phase = 1 | 2 | 3

export interface WorkoutSet {
  reps: number
  weight: number
  done: boolean
}

export interface ExerciseEntry {
  name: string
  sets: WorkoutSet[]
  restSeconds: number
}

export interface WarmupItem {
  name: string
  done: boolean
}

export interface WorkoutSession {
  day: DayType
  exercises: ExerciseEntry[]
  warmup: WarmupItem[]
  completed: boolean
  startedAt: string
  completedAt?: string
}

export interface PRRecord {
  maxReps: number
  maxWeight: number
  date: string
}

export interface WorkoutState {
  currentWeek: number
  currentPhase: Phase
  workouts: Record<string, WorkoutSession>
  personalRecords: Record<string, PRRecord>
}

export interface ExerciseTemplate {
  name: string
  sets: number
  reps: string
  load: string
  rest: number
  tip?: string
  minPhase?: Phase
}

export interface DayTemplate {
  id: DayType
  name: string
  label: string
  duration: string
  color: string
  exercises: ExerciseTemplate[]
}
