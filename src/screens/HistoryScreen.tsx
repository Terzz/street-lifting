import { useState } from 'react'
import { useWorkout } from '../context/WorkoutContext'
import { PROGRAM } from '../constants/program'
import { totalVolume, totalSets } from '../lib/programLogic'
import Badge from '../components/common/Badge'
import Header from '../components/layout/Header'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

const allExercises = PROGRAM.flatMap((d) => d.exercises.map((e) => e.name))
const uniqueExercises = [...new Set(allExercises)]

export default function HistoryScreen() {
  const { state } = useWorkout()
  const [selectedExercise, setSelectedExercise] = useState(uniqueExercises[0])
  const [view, setView] = useState<'exercises' | 'weeks'>('exercises')

  // Build chart data for selected exercise
  const chartData = Object.entries(state.workouts)
    .filter(([, w]) => w.completed)
    .sort(([a], [b]) => a.localeCompare(b))
    .flatMap(([date, workout]) => {
      const exercise = workout.exercises.find((e) => e.name === selectedExercise)
      if (!exercise) return []
      const doneSets = exercise.sets.filter((s) => s.done)
      if (doneSets.length === 0) return []
      const maxWeight = Math.max(...doneSets.map((s) => s.weight))
      const maxReps = Math.max(...doneSets.map((s) => s.reps))
      return [{ date: date.slice(5), maxWeight, maxReps }]
    })

  // Build weekly data
  const weeklyData = Object.entries(state.workouts)
    .filter(([, w]) => w.completed)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, w]) => ({
      date,
      day: w.day,
      volume: totalVolume(w),
      sets: totalSets(w),
    }))

  return (
    <div className="min-h-screen bg-bg pb-24">
      <Header title="Historique" />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* View toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setView('exercises')}
            className={`flex-1 py-2 rounded text-xs font-medium transition-colors ${
              view === 'exercises' ? 'bg-pull/20 text-pull' : 'bg-surface text-zinc-500'
            }`}
          >
            Par exercice
          </button>
          <button
            onClick={() => setView('weeks')}
            className={`flex-1 py-2 rounded text-xs font-medium transition-colors ${
              view === 'weeks' ? 'bg-pull/20 text-pull' : 'bg-surface text-zinc-500'
            }`}
          >
            Par seance
          </button>
        </div>

        {view === 'exercises' && (
          <>
            {/* Exercise selector */}
            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-3 text-xs text-zinc-100 font-mono"
            >
              {uniqueExercises.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>

            {/* Chart */}
            {chartData.length > 0 ? (
              <div className="bg-surface rounded-lg border border-border p-4">
                <div className="text-xs text-zinc-500 mb-3">Charge max (kg)</div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#71717a' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#71717a' }} width={35} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#141418',
                        border: '1px solid #1e1e24',
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Line type="monotone" dataKey="maxWeight" stroke="#2dd4bf" strokeWidth={2} dot={{ fill: '#2dd4bf', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>

                <div className="text-xs text-zinc-500 mb-3 mt-6">Reps max</div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#71717a' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#71717a' }} width={35} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#141418',
                        border: '1px solid #1e1e24',
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Line type="monotone" dataKey="maxReps" stroke="#fbbf24" strokeWidth={2} dot={{ fill: '#fbbf24', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="py-12 text-center text-zinc-500 text-sm">
                Pas encore de donnees pour cet exercice.
              </div>
            )}

            {/* PRs */}
            {Object.keys(state.personalRecords).length > 0 && (
              <div className="bg-surface rounded-lg border border-border p-4">
                <h3 className="text-sm font-semibold text-zinc-100 mb-3">Records personnels</h3>
                <div className="space-y-2">
                  {Object.entries(state.personalRecords).map(([name, pr]) => (
                    <div key={name} className="flex items-center justify-between py-1">
                      <span className="text-xs text-zinc-400 truncate flex-1">{name}</span>
                      <div className="flex gap-2">
                        <Badge color="#fbbf24">{pr.maxReps}r</Badge>
                        {pr.maxWeight > 0 && <Badge color="#2dd4bf">{pr.maxWeight}kg</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {view === 'weeks' && (
          <div className="space-y-2">
            {weeklyData.length > 0 ? (
              weeklyData.reverse().map((w, i) => (
                <div key={i} className="bg-surface rounded-lg border border-border p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-zinc-100">Jour {w.day}</div>
                    <div className="text-xs text-zinc-500">{w.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-zinc-100">{w.volume.toLocaleString()} kg</div>
                    <div className="text-xs text-zinc-500">{w.sets} series</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-zinc-500 text-sm">
                Aucune seance completee.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
