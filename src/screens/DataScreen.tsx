import { useRef, useState } from 'react'
import { useWorkout } from '../context/WorkoutContext'
import { exportJSON, exportCSV, parseImportedJSON } from '../lib/export'
import { STORAGE_KEY } from '../lib/storage'
import Header from '../components/layout/Header'

export default function DataScreen() {
  const { state, dispatch } = useWorkout()
  const fileRef = useRef<HTMLInputElement>(null)
  const [importStatus, setImportStatus] = useState<{ ok: boolean; message: string } | null>(null)

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const data = parseImportedJSON(text)
      if (data) {
        dispatch({ type: 'IMPORT_DATA', data })
        setImportStatus({ ok: true, message: 'Donnees importees avec succes' })
      } else {
        setImportStatus({ ok: false, message: 'Erreur : fichier invalide' })
      }
    }
    reader.onerror = () => {
      setImportStatus({ ok: false, message: 'Erreur : impossible de lire le fichier' })
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const workoutCount = Object.values(state.workouts).filter((w) => w.completed).length
  const prCount = Object.keys(state.personalRecords).length

  return (
    <div className="min-h-screen bg-bg pb-24">
      <Header title="Donnees" />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Stats */}
        <div className="bg-surface rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold text-zinc-100 mb-3">Statistiques</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-xl font-bold text-zinc-100">{workoutCount}</div>
              <div className="text-xs text-zinc-500">Seances</div>
            </div>
            <div>
              <div className="text-xl font-bold text-zinc-100">{state.currentWeek}</div>
              <div className="text-xs text-zinc-500">Semaine</div>
            </div>
            <div>
              <div className="text-xl font-bold text-zinc-100">{prCount}</div>
              <div className="text-xs text-zinc-500">PRs</div>
            </div>
          </div>
        </div>

        {/* Export */}
        <div className="bg-surface rounded-lg border border-border p-4 space-y-3">
          <h3 className="text-sm font-semibold text-zinc-100">Exporter</h3>
          <button
            onClick={() => exportJSON(state)}
            className="w-full py-3 rounded-lg bg-pull/20 text-pull text-sm font-medium active:bg-pull/30"
          >
            Exporter en JSON (backup complet)
          </button>
          <button
            onClick={() => exportCSV(state)}
            className="w-full py-3 rounded-lg bg-surface border border-border text-zinc-400 text-sm font-medium active:bg-border"
          >
            Exporter en CSV
          </button>
        </div>

        {/* Import */}
        <div className="bg-surface rounded-lg border border-border p-4 space-y-3">
          <h3 className="text-sm font-semibold text-zinc-100">Importer</h3>
          <p className="text-xs text-zinc-500">
            Restaurez vos donnees depuis un fichier JSON exporte precedemment.
            Attention : cela ecrasera toutes les donnees actuelles.
          </p>
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full py-3 rounded-lg bg-surface border border-border text-zinc-400 text-sm font-medium active:bg-border"
          >
            Importer un fichier JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          {importStatus && (
            <p className={`text-xs ${importStatus.ok ? 'text-pull' : 'text-red-400'}`}>
              {importStatus.message}
            </p>
          )}
        </div>

        {/* Reset */}
        <div className="bg-surface rounded-lg border border-red-900/30 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-red-400">Zone dangereuse</h3>
          <p className="text-xs text-zinc-500">
            Exportez vos donnees avant de reinitialiser.
          </p>
          <button
            onClick={() => {
              if (confirm('Etes-vous sur ? Toutes les donnees seront perdues.')) {
                localStorage.removeItem(STORAGE_KEY)
                window.location.reload()
              }
            }}
            className="w-full py-3 rounded-lg bg-red-900/20 border border-red-900/30 text-red-400 text-sm font-medium"
          >
            Reinitialiser toutes les donnees
          </button>
        </div>
      </div>
    </div>
  )
}
