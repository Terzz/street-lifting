interface Props {
  remaining: number
  isRunning: boolean
  progress: number
  onStop: () => void
}

export default function RestTimer({ remaining, isRunning, progress, onStop }: Props) {
  if (!isRunning) return null

  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60
  const display = `${minutes}:${seconds.toString().padStart(2, '0')}`

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 safe-area-bottom">
      <div className="max-w-lg mx-auto px-4 pb-4">
        <button
          onClick={onStop}
          className="w-full bg-surface border border-border rounded-xl p-4 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-500 uppercase tracking-wider">Repos</span>
            <span className="text-xs text-zinc-500">Tap pour annuler</span>
          </div>
          <div className="text-5xl font-bold text-zinc-100 text-center font-mono tabular-nums">
            {display}
          </div>
          <div className="mt-3 h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-rest rounded-full transition-all duration-300"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </button>
      </div>
    </div>
  )
}
