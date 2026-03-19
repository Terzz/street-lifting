import { createContext, useContext, useReducer, useEffect, useRef, ReactNode } from 'react'
import { WorkoutState, DayType, Phase } from '../types'
import { loadState, saveState } from '../lib/storage'
import { createWorkoutSession, detectPRs } from '../lib/programLogic'

type Action =
  | { type: 'START_WORKOUT'; day: DayType; date: string }
  | { type: 'UPDATE_SET'; date: string; exerciseIndex: number; setIndex: number; field: 'reps' | 'weight' | 'done'; value: number | boolean }
  | { type: 'COMPLETE_WORKOUT'; date: string }
  | { type: 'SET_PHASE'; phase: Phase }
  | { type: 'SET_WEEK'; week: number }
  | { type: 'TOGGLE_WARMUP'; date: string; index: number }
  | { type: 'IMPORT_DATA'; data: WorkoutState }

function workoutReducer(state: WorkoutState, action: Action): WorkoutState {
  switch (action.type) {
    case 'START_WORKOUT': {
      const existing = state.workouts[action.date]
      if (existing && existing.day === action.day) return state
      const session = createWorkoutSession(action.day, state.currentPhase)
      return {
        ...state,
        workouts: { ...state.workouts, [action.date]: session },
      }
    }
    case 'UPDATE_SET': {
      const workout = state.workouts[action.date]
      if (!workout) return state
      const exercises = [...workout.exercises]
      const exercise = { ...exercises[action.exerciseIndex] }
      const sets = [...exercise.sets]
      sets[action.setIndex] = { ...sets[action.setIndex], [action.field]: action.value }
      exercise.sets = sets
      exercises[action.exerciseIndex] = exercise
      return {
        ...state,
        workouts: { ...state.workouts, [action.date]: { ...workout, exercises } },
      }
    }
    case 'COMPLETE_WORKOUT': {
      const workout = state.workouts[action.date]
      if (!workout) return state
      const updatedPRs = detectPRs(workout, state.personalRecords, action.date)
      return {
        ...state,
        workouts: {
          ...state.workouts,
          [action.date]: { ...workout, completed: true, completedAt: new Date().toISOString() },
        },
        personalRecords: updatedPRs,
      }
    }
    case 'SET_PHASE':
      return { ...state, currentPhase: action.phase }
    case 'SET_WEEK':
      return { ...state, currentWeek: Math.max(1, state.currentWeek + action.week) }
    case 'TOGGLE_WARMUP': {
      const workout = state.workouts[action.date]
      if (!workout) return state
      const warmup = [...workout.warmup]
      warmup[action.index] = { ...warmup[action.index], done: !warmup[action.index].done }
      return {
        ...state,
        workouts: { ...state.workouts, [action.date]: { ...workout, warmup } },
      }
    }
    case 'IMPORT_DATA':
      return action.data
    default:
      return state
  }
}

interface WorkoutContextValue {
  state: WorkoutState
  dispatch: React.Dispatch<Action>
}

const WorkoutContext = createContext<WorkoutContextValue | null>(null)

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workoutReducer, null, loadState)
  const saveTimer = useRef<number | null>(null)

  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(() => saveState(state), 300)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [state])

  return (
    <WorkoutContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkoutContext.Provider>
  )
}

export function useWorkout() {
  const ctx = useContext(WorkoutContext)
  if (!ctx) throw new Error('useWorkout must be used within WorkoutProvider')
  return ctx
}
