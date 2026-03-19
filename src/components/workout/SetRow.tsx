import { memo } from 'react'
import NumberInput from '../common/NumberInput'
import { WorkoutSet } from '../../types'

interface Props {
  index: number
  set: WorkoutSet
  previousSet?: WorkoutSet
  onUpdate: (field: 'reps' | 'weight' | 'done', value: number | boolean) => void
  onChecked: () => void
}

export default memo(function SetRow({ index, set, previousSet, onUpdate, onChecked }: Props) {
  const handleDone = () => {
    const newDone = !set.done
    onUpdate('done', newDone)
    if (newDone) onChecked()
  }

  return (
    <div className={`flex items-center gap-1.5 py-1.5 ${set.done ? 'opacity-60' : ''}`}>
      <span className="w-6 text-center text-[10px] text-zinc-500 shrink-0">{index + 1}</span>

      <div className="flex-1 flex items-center gap-1.5 min-w-0">
        <div className="flex flex-col items-center gap-0.5 flex-1">
          {previousSet && (
            <span className="text-[10px] text-zinc-600">{previousSet.reps}r</span>
          )}
          <NumberInput value={set.reps} onChange={(v) => onUpdate('reps', v)} step={1} min={0} />
        </div>

        <div className="flex flex-col items-center gap-0.5 flex-1">
          {previousSet && (
            <span className="text-[10px] text-zinc-600">{previousSet.weight}kg</span>
          )}
          <NumberInput value={set.weight} onChange={(v) => onUpdate('weight', v)} step={2.5} min={0} />
        </div>
      </div>

      <button
        type="button"
        onClick={handleDone}
        className="w-10 h-10 flex items-center justify-center shrink-0"
      >
        {set.done ? (
          <span className="w-7 h-7 rounded-md bg-pull flex items-center justify-center shadow-[0_0_8px_rgba(45,212,191,0.25)]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7.5L5.5 10L11 4" stroke="#0a0a0f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        ) : (
          <span className="w-7 h-7 rounded-md border border-zinc-700 flex items-center justify-center active:border-zinc-500 transition-colors" />
        )}
      </button>
    </div>
  )
})
