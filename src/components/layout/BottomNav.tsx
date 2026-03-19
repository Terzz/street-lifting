import { useLocation, useNavigate } from 'react-router-dom'

const tabs = [
  { path: '/', label: 'Accueil', icon: '⌂' },
  { path: '/history', label: 'Historique', icon: '◷' },
  { path: '/roadmap', label: 'Phases', icon: '⬆' },
  { path: '/data', label: 'Donnees', icon: '⚙' },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  // Hide nav during active workout
  if (location.pathname.startsWith('/workout')) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border safe-area-bottom z-50">
      <div className="flex justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center py-3 px-4 min-h-[56px] min-w-[56px] transition-colors ${
                active ? 'text-pull' : 'text-zinc-500'
              }`}
            >
              <span className="text-xl leading-none">{tab.icon}</span>
              <span className="text-[10px] mt-1">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
