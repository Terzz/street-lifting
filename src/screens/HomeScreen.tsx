import { useNavigate } from 'react-router-dom'
import { useWorkout } from '../context/WorkoutContext'
import { PROGRAM } from '../constants/program'
import { DayType } from '../types'
import DayCard from '../components/home/DayCard'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import { toLocalDateString } from '../lib/storage'

const DAY_ORDER: DayType[] = ['A', 'B', 'C', 'D']

export default function HomeScreen() {
  const navigate = useNavigate()
  const { state, dispatch } = useWorkout()
  const { canInstall, isIOS, isInstalled, install } = useInstallPrompt()

  const today = toLocalDateString()

  // Determine which days are done this week (simple: check last 7 days)
  const last7Days: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    last7Days.push(toLocalDateString(d))
  }

  const doneDays = new Set(
    last7Days
      .filter((d) => state.workouts[d]?.completed)
      .map((d) => state.workouts[d].day)
  )

  // Find which day to suggest today
  const nextDay = DAY_ORDER.find((d) => !doneDays.has(d)) ?? 'A'

  const handleStartDay = (day: DayType) => {
    const existing = state.workouts[today]
    if (!existing || (existing.completed && existing.day !== day)) {
      dispatch({ type: 'START_WORKOUT', day, date: today })
    }
    navigate(`/workout/${today}`)
  }

  const getDayStatus = (day: DayType): 'done' | 'today' | 'todo' => {
    if (doneDays.has(day)) return 'done'
    if (day === nextDay) return 'today'
    return 'todo'
  }

  return (
    <div className="min-h-screen bg-bg pb-24">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-zinc-100">Street Lifting</h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Semaine {state.currentWeek} · Phase {state.currentPhase}
            </p>
          </div>
          <button
            onClick={() => navigate('/postural')}
            className="text-xs text-zinc-500 px-3 py-2 rounded border border-border"
          >
            Posture
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 space-y-4">
        {/* Quick start */}
        {!state.workouts[today]?.completed && (() => {
          const nextDayTemplate = PROGRAM.find((d) => d.id === nextDay)
          return (
            <button
              onClick={() => handleStartDay(nextDay)}
              className="w-full py-4 rounded-lg bg-pull text-bg text-sm font-semibold active:bg-pull/80"
            >
              Commencer {nextDayTemplate?.name} — {nextDayTemplate?.label}
            </button>
          )
        })()}

        {state.workouts[today]?.completed && (
          <div className="py-4 text-center text-pull text-sm font-semibold">
            ✓ Seance du jour terminee
          </div>
        )}

        {/* Resume in-progress workout */}
        {state.workouts[today] && !state.workouts[today].completed && (
          <button
            onClick={() => navigate(`/workout/${today}`)}
            className="w-full py-4 rounded-lg bg-explosive/20 text-explosive text-sm font-semibold border border-explosive/30"
          >
            Reprendre la seance en cours
          </button>
        )}

        {/* Day cards */}
        <div className="space-y-2">
          {DAY_ORDER.map((day) => (
            <DayCard
              key={day}
              day={day}
              status={getDayStatus(day)}
              onStart={() => handleStartDay(day)}
            />
          ))}
        </div>

        {/* Week control */}
        <div className="flex items-center justify-center gap-4 py-4">
          <button
            onClick={() => dispatch({ type: 'SET_WEEK', week: -1 })}
            className="w-11 h-11 rounded bg-surface border border-border text-zinc-400 flex items-center justify-center"
          >
            ←
          </button>
          <span className="text-sm text-zinc-300">Semaine {state.currentWeek}</span>
          <button
            onClick={() => dispatch({ type: 'SET_WEEK', week: 1 })}
            className="w-11 h-11 rounded bg-surface border border-border text-zinc-400 flex items-center justify-center"
          >
            →
          </button>
        </div>

        {/* Install prompt */}
        {canInstall && !isInstalled && (
          <button
            onClick={install}
            className="w-full py-3 text-xs text-zinc-400 border border-dashed border-border rounded-lg"
          >
            Installer l'app sur l'ecran d'accueil
          </button>
        )}
        {isIOS && !isInstalled && (
          <div className="text-xs text-zinc-500 text-center py-3">
            Pour installer : Safari → Partager → Ajouter a l'ecran d'accueil
          </div>
        )}
      </div>
    </div>
  )
}
