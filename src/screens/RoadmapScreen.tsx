import { useWorkout } from '../context/WorkoutContext'
import { PHASES } from '../constants/program'
import { Phase } from '../types'
import Header from '../components/layout/Header'

export default function RoadmapScreen() {
  const { state, dispatch } = useWorkout()

  return (
    <div className="min-h-screen bg-bg pb-24">
      <Header title="Feuille de route" />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        <p className="text-xs text-zinc-500">
          Selectionnez votre phase actuelle. Le programme s'adapte automatiquement.
        </p>

        {PHASES.map((phase) => {
          const isActive = state.currentPhase === phase.id
          const isPast = state.currentPhase > phase.id
          return (
            <button
              key={phase.id}
              onClick={() => dispatch({ type: 'SET_PHASE', phase: phase.id as Phase })}
              className={`w-full text-left rounded-lg border p-4 transition-colors ${
                isActive
                  ? 'border-pull bg-pull/10'
                  : isPast
                  ? 'border-border bg-surface/50 opacity-60'
                  : 'border-border bg-surface'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    isActive
                      ? 'bg-pull text-bg'
                      : isPast
                      ? 'bg-pull/20 text-pull'
                      : 'bg-surface border border-border text-zinc-500'
                  }`}
                >
                  {isPast ? '✓' : phase.id}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-zinc-100">{phase.title}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">{phase.goal}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{phase.duration}</div>
                </div>
                {isActive && (
                  <span className="text-xs px-2 py-1 rounded bg-pull/20 text-pull shrink-0">
                    Active
                  </span>
                )}
              </div>
            </button>
          )
        })}

        <div className="bg-surface rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold text-zinc-100 mb-2">Note</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            En Phase 3, le bloc "Muscle-up negatifs" est debloque dans le Jour C (Tirage Explosif).
            Les phases precedentes gardent ce mouvement masque pour eviter les blessures.
          </p>
        </div>
      </div>
    </div>
  )
}
