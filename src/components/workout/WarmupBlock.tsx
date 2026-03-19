import { useState } from 'react'
import { WarmupItem } from '../../types'

interface Props {
  items: WarmupItem[]
  onToggle: (index: number) => void
}

export default function WarmupBlock({ items, onToggle }: Props) {
  const [expanded, setExpanded] = useState(true)
  const doneCount = items.filter((i) => i.done).length
  const allDone = doneCount === items.length

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center gap-3 text-left"
      >
        <div className="w-1 h-8 rounded-full shrink-0 bg-rest" />
        <div className="flex-1">
          <div className="text-sm font-medium text-zinc-100">Echauffement</div>
          <div className="text-xs text-zinc-500 mt-0.5">
            {doneCount}/{items.length} exercices
          </div>
        </div>
        {allDone && <span className="text-pull text-sm">✓</span>}
        <span className={`text-zinc-500 transition-transform ${expanded ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-3 space-y-2">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => onToggle(i)}
              className="w-full flex items-center gap-3 py-2 px-2 rounded transition-colors"
            >
              <div
                className={`w-6 h-6 rounded flex items-center justify-center border text-xs shrink-0 ${
                  item.done
                    ? 'bg-pull/20 border-pull/40 text-pull'
                    : 'bg-surface border-border text-zinc-600'
                }`}
              >
                {item.done ? '✓' : ''}
              </div>
              <span
                className={`text-xs text-left ${
                  item.done ? 'text-zinc-500 line-through' : 'text-zinc-300'
                }`}
              >
                {item.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
