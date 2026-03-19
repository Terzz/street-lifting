import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useCallback, useMemo } from 'react'
import { useWorkout } from '../context/WorkoutContext'
import { useTimer, unlockAudio } from '../hooks/useTimer'
import { DAY_COLORS } from '../constants/theme'
import { getDayTemplate, getPreviousSession } from '../lib/programLogic'
import Header from '../components/layout/Header'
import WarmupBlock from '../components/workout/WarmupBlock'
import ExerciseCard from '../components/workout/ExerciseCard'
import RestTimer from '../components/workout/RestTimer'
import { DayType } from '../types'

export default function ActiveWorkout() {
  const { date } = useParams<{ date: string }>()
  const navigate = useNavigate()
  const { state, dispatch } = useWorkout()
  const timer = useTimer()

  const workout = date ? state.workouts[date] : null
  const dayTemplate = workout ? getDayTemplate(workout.day) : null

  // Compute previous session ONCE per render, not per exercise
  const previousSession = useMemo(
    () => (workout && date ? getPreviousSession(state, workout.day, date) : null),
    [state.workouts, workout?.day, date]
  )

  // Wake lock to keep screen on
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null
    const acquire = async () => {
      try {
        wakeLock = await navigator.wakeLock?.request('screen')
      } catch { /* not supported */ }
    }
    acquire()
    return () => { wakeLock?.release() }
  }, [])

  const handleSetUpdate = useCallback(
    (exerciseIndex: number, setIndex: number, field: 'reps' | 'weight' | 'done', value: number | boolean) => {
      if (!date) return
      dispatch({ type: 'UPDATE_SET', date, exerciseIndex, setIndex, field, value })
    },
    [date, dispatch]
  )

  const handleSetChecked = useCallback(
    (exerciseIndex: number) => {
      if (!workout) return
      unlockAudio()
      const exercise = workout.exercises[exerciseIndex]
      timer.start(exercise.restSeconds)
    },
    [workout, timer]
  )

  const handleFinish = useCallback(() => {
    if (!date) return
    dispatch({ type: 'COMPLETE_WORKOUT', date })
    navigate(`/summary/${date}`, { replace: true })
  }, [date, dispatch, navigate])

  if (!date || !workout || !dayTemplate) {
    return (
      <div className="min-h-screen bg-bg">
        <Header title="Seance introuvable" showBack />
        <div className="p-4 text-center text-zinc-500">
          Aucune seance trouvee pour cette date.
        </div>
      </div>
    )
  }

  const color = DAY_COLORS[workout.day]
  const allSetsDone = workout.exercises.every((e) => e.sets.every((s) => s.done))

  return (
    <div className="min-h-screen bg-bg pb-32">
      <Header title={`${dayTemplate.name} — ${dayTemplate.label}`} showBack />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-3">
        {/* Duration indicator */}
        <div className="text-xs text-zinc-500 text-center">{dayTemplate.duration}</div>

        {/* Warmup */}
        <WarmupBlock
          items={workout.warmup}
          onToggle={(index) => dispatch({ type: 'TOGGLE_WARMUP', date, index })}
        />

        {/* Exercises */}
        {workout.exercises.map((exercise, i) => {
          const prevExercise = previousSession?.exercises.find((e) => e.name === exercise.name)
          return (
            <ExerciseCard
              key={i}
              exercise={exercise}
              previousSets={prevExercise?.sets ?? null}
              color={color}
              onSetUpdate={(setIndex, field, value) => handleSetUpdate(i, setIndex, field, value)}
              onSetChecked={() => handleSetChecked(i)}
            />
          )
        })}

        {/* Finish button */}
        <button
          onClick={handleFinish}
          className={`w-full py-4 rounded-lg text-sm font-semibold transition-colors ${
            allSetsDone
              ? 'bg-pull text-bg active:bg-pull/80'
              : 'bg-surface border border-border text-zinc-400 active:bg-border'
          }`}
        >
          {allSetsDone ? 'Terminer la seance' : 'Terminer la seance (series incompletes)'}
        </button>
      </div>

      {/* Rest Timer Overlay */}
      <RestTimer
        remaining={timer.remaining}
        isRunning={timer.isRunning}
        progress={timer.progress}
        onStop={timer.stop}
      />
    </div>
  )
}
