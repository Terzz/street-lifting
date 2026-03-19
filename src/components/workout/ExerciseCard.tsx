import { useState } from 'react'
import SetRow from './SetRow'
import { ExerciseEntry, WorkoutSet } from '../../types'
import { PROGRAM } from '../../constants/program'

interface Props {
  exercise: ExerciseEntry
  previousSets: WorkoutSet[] | null
  onSetUpdate: (setIndex: number, field: 'reps' | 'weight' | 'done', value: number | boolean) => void
  onSetChecked: (setIndex: number) => void
  color: string
}

export default function ExerciseCard({
  exercise,
  previousSets,
  onSetUpdate,
  onSetChecked,
  color,
}: Props) {
  const [expanded, setExpanded] = useState(true)
  const doneSets = exercise.sets.filter((s) => s.done).length
  const totalSets = exercise.sets.length

  const template = PROGRAM.flatMap((d) => d.exercises).find((e) => e.name === exercise.name)

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center gap-3 text-left"
        aria-label={`${exercise.name} — ${doneSets}/${totalSets} series`}
      >
        <div
          className="w-1 h-8 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-zinc-100 truncate">{exercise.name}</div>
          {template && (
            <div className="text-xs text-zinc-500 mt-0.5">
              {template.sets}x{template.reps} · {template.load} · repos {exercise.restSeconds}s
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-zinc-500">
            {doneSets}/{totalSets}
          </span>
          <span className={`text-zinc-500 transition-transform ${expanded ? 'rotate-180' : ''}`}>
            ▾
          </span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-3">
          {template?.tip && (
            <p className="text-xs text-zinc-500 italic mb-3 px-2">{template.tip}</p>
          )}

          {/* Header — même structure flex que SetRow pour alignement parfait */}
          <div className="flex items-center gap-1.5 pb-1">
            <span className="w-6 shrink-0" />
            <div className="flex-1 flex items-center gap-1.5 min-w-0">
              <span className="flex-1 text-[10px] text-zinc-600 text-center">Reps</span>
              <span className="flex-1 text-[10px] text-zinc-600 text-center">Charge (kg)</span>
            </div>
            <span className="w-10 shrink-0 text-[10px] text-zinc-600 text-center">Fait</span>
          </div>

          {exercise.sets.map((set, i) => (
            <SetRow
              key={i}
              index={i}
              set={set}
              previousSet={previousSets?.[i]}
              onUpdate={(field, value) => onSetUpdate(i, field, value)}
              onChecked={() => onSetChecked(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
