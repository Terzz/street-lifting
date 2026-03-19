import { DayType } from '../../types'
import { DAY_COLORS } from '../../constants/theme'
import { PROGRAM } from '../../constants/program'

interface Props {
  day: DayType
  status: 'done' | 'today' | 'todo'
  onStart: () => void
}

export default function DayCard({ day, status, onStart }: Props) {
  const template = PROGRAM.find((d) => d.id === day)!
  const color = DAY_COLORS[day]

  return (
    <button
      onClick={onStart}
      className={`w-full text-left rounded-lg border p-4 transition-colors ${
        status === 'today'
          ? 'border-zinc-500 bg-surface'
          : status === 'done'
          ? 'border-border bg-surface/50 opacity-60'
          : 'border-border bg-surface'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-10 rounded-full shrink-0" style={{ backgroundColor: color }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-100">{template.name}</span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded font-medium"
              style={{ backgroundColor: color + '20', color }}
            >
              {template.label}
            </span>
          </div>
          <div className="text-xs text-zinc-500 mt-0.5">
            {template.exercises.length} exercices · {template.duration}
          </div>
        </div>
        <div className="shrink-0">
          {status === 'done' && <span className="text-pull text-lg">✓</span>}
          {status === 'today' && (
            <span className="text-xs px-2 py-1 rounded bg-pull/20 text-pull">Aujourd'hui</span>
          )}
        </div>
      </div>
    </button>
  )
}
