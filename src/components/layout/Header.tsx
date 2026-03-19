import { useNavigate, useLocation } from 'react-router-dom'

interface Props {
  title?: string
  showBack?: boolean
}

export default function Header({ title, showBack }: Props) {
  const navigate = useNavigate()
  const location = useLocation()

  const isWorkout = location.pathname.startsWith('/workout')

  return (
    <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center gap-3">
      {(showBack || isWorkout) && (
        <button
          onClick={() => navigate(-1)}
          aria-label="Retour"
          className="w-11 h-11 flex items-center justify-center rounded text-zinc-400"
        >
          ←
        </button>
      )}
      <h1 className="text-sm font-semibold text-zinc-100 truncate">
        {title || 'Street Lifting'}
      </h1>
    </header>
  )
}
