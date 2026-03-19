import { useParams, useNavigate } from 'react-router-dom'
import { useWorkout } from '../context/WorkoutContext'
import { PROGRAM } from '../constants/program'
import { totalVolume, totalSets } from '../lib/programLogic'
import Badge from '../components/common/Badge'
import Header from '../components/layout/Header'

export default function WorkoutSummary() {
  const { date } = useParams<{ date: string }>()
  const navigate = useNavigate()
  const { state } = useWorkout()

  const workout = date ? state.workouts[date] : null
  const dayTemplate = workout ? PROGRAM.find((d) => d.id === workout.day) : null

  if (!date || !workout || !dayTemplate) {
    return (
      <div className="min-h-screen bg-bg">
        <Header title="Resume" showBack />
        <div className="p-4 text-center text-zinc-500">Seance introuvable.</div>
      </div>
    )
  }

  const volume = totalVolume(workout)
  const sets = totalSets(workout)
  const duration = workout.startedAt && workout.completedAt
    ? Math.round((new Date(workout.completedAt).getTime() - new Date(workout.startedAt).getTime()) / 60000)
    : null

  // Check for new PRs
  const newPRs = Object.entries(state.personalRecords).filter(
    ([, pr]) => pr.date === date
  )

  return (
    <div className="min-h-screen bg-bg pb-24">
      <Header title="Seance terminee" />

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Big check */}
        <div className="text-center">
          <div className="text-6xl mb-4">✓</div>
          <h2 className="text-xl font-bold text-zinc-100">
            {dayTemplate.name} — {dayTemplate.label}
          </h2>
          <p className="text-sm text-zinc-500 mt-1">{date}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-surface rounded-lg border border-border p-4 text-center">
            <div className="text-2xl font-bold text-zinc-100">{sets}</div>
            <div className="text-xs text-zinc-500 mt-1">Series</div>
          </div>
          <div className="bg-surface rounded-lg border border-border p-4 text-center">
            <div className="text-2xl font-bold text-zinc-100">{volume.toLocaleString()}</div>
            <div className="text-xs text-zinc-500 mt-1">Volume (kg)</div>
          </div>
          {duration !== null && (
            <div className="bg-surface rounded-lg border border-border p-4 text-center">
              <div className="text-2xl font-bold text-zinc-100">{duration}</div>
              <div className="text-xs text-zinc-500 mt-1">Minutes</div>
            </div>
          )}
        </div>

        {/* PRs */}
        {newPRs.length > 0 && (
          <div className="bg-surface rounded-lg border border-border p-4">
            <h3 className="text-sm font-semibold text-zinc-100 mb-3">Nouveaux records</h3>
            <div className="space-y-2">
              {newPRs.map(([name, pr]) => (
                <div key={name} className="flex items-center justify-between">
                  <span className="text-xs text-zinc-300 truncate flex-1">{name}</span>
                  <div className="flex gap-2">
                    <Badge color="#fbbf24">{pr.maxReps} reps</Badge>
                    {pr.maxWeight > 0 && <Badge color="#2dd4bf">{pr.maxWeight} kg</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exercise breakdown */}
        <div className="bg-surface rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold text-zinc-100 mb-3">Detail</h3>
          <div className="space-y-2">
            {workout.exercises.map((ex, i) => {
              const doneSets = ex.sets.filter((s) => s.done)
              const bestWeight = doneSets.length > 0 ? Math.max(...doneSets.map((s) => s.weight)) : 0
              const bestReps = doneSets.length > 0 ? Math.max(...doneSets.map((s) => s.reps)) : 0
              return (
                <div key={i} className="flex items-center justify-between py-1">
                  <span className="text-xs text-zinc-400 truncate flex-1">{ex.name}</span>
                  <span className="text-xs text-zinc-500 ml-2">
                    {doneSets.length}s · {bestReps}r · {bestWeight}kg
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="w-full py-4 rounded-lg bg-pull text-bg text-sm font-semibold active:bg-pull/80"
        >
          Retour a l'accueil
        </button>
      </div>
    </div>
  )
}
