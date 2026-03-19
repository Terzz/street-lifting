import { useState, useRef, useEffect } from 'react'

interface Props {
  value: number
  onChange: (val: number) => void
  step?: number
  min?: number
  max?: number
  label?: string
}

export default function NumberInput({ value, onChange, step = 1, min = 0, max = 999, label }: Props) {
  const [editing, setEditing] = useState(false)
  const [tempVal, setTempVal] = useState('')
  const latestValue = useRef(value)

  useEffect(() => { latestValue.current = value }, [value])

  const decrement = () => {
    const newVal = Math.max(min, latestValue.current - step)
    latestValue.current = newVal
    onChange(newVal)
  }
  const increment = () => {
    const newVal = Math.min(max, latestValue.current + step)
    latestValue.current = newVal
    onChange(newVal)
  }

  if (editing) {
    return (
      <input
        type="number"
        className="w-full h-10 bg-surface border border-border rounded text-center text-zinc-100 font-mono text-sm"
        value={tempVal}
        autoFocus
        inputMode="decimal"
        onFocus={(e) => e.target.select()}
        onChange={(e) => setTempVal(e.target.value)}
        onBlur={() => {
          const n = parseFloat(tempVal)
          if (!isNaN(n)) onChange(Math.max(min, Math.min(max, n)))
          setEditing(false)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
        }}
      />
    )
  }

  return (
    <div className="flex items-center gap-0.5">
      {label && <span className="text-xs text-zinc-500 mr-1">{label}</span>}
      <button
        type="button"
        onClick={decrement}
        aria-label="Diminuer"
        className="min-w-[36px] h-10 flex items-center justify-center rounded bg-surface border border-border text-zinc-400 active:bg-border text-base font-bold"
      >
        -
      </button>
      <button
        type="button"
        onClick={() => {
          setTempVal(String(value))
          setEditing(true)
        }}
        aria-label={`Valeur: ${value}`}
        className="min-w-[40px] h-10 flex items-center justify-center rounded bg-surface border border-border text-zinc-100 font-mono text-xs px-1"
      >
        {value % 1 === 0 ? value : value.toFixed(1)}
      </button>
      <button
        type="button"
        onClick={increment}
        aria-label="Augmenter"
        className="min-w-[36px] h-10 flex items-center justify-center rounded bg-surface border border-border text-zinc-400 active:bg-border text-base font-bold"
      >
        +
      </button>
    </div>
  )
}
