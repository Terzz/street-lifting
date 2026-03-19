import { useState } from 'react'
import Header from '../components/layout/Header'

const sections = [
  {
    title: 'Bracing 360°',
    content: `Le bracing 360° consiste a creer une pression intra-abdominale uniforme tout autour du tronc.

1. Inspirez profondement dans le ventre (pas dans la poitrine)
2. Poussez l'air vers le bas et sur les cotes — imaginez gonfler une ceinture
3. Contractez les abdos comme si vous alliez recevoir un coup au ventre
4. Maintenez cette pression pendant tout le mouvement

Utilisez-le sur CHAQUE mouvement lourd : squats, dips lestes, tractions lestees.`,
  },
  {
    title: 'Bassin neutre',
    content: `Le bassin neutre est la position ou le bas du dos garde sa courbure naturelle — ni cambre excessivement (antéversion), ni arrondi (retroversion).

Pour trouver votre position neutre :
1. Debout, cambrez le dos au maximum (antéversion)
2. Puis arrondissez au maximum (retroversion)
3. La position neutre est entre les deux, la ou vous sentez le moins de tension

Maintenez cette position pendant les squats, hip thrusts, et tout mouvement debout.`,
  },
  {
    title: 'McGill Big 3',
    content: `Les 3 exercices du Dr. Stuart McGill pour la sante du dos :

Curl-up : Allonge, un genou plie. Mains sous le bas du dos. Soulevez la tete et les epaules de 2-3 cm seulement. Maintenez 8 sec.

Planche laterale : Sur le coude, corps droit. Maintenez 8 sec. Les deux cotes.

Bird Dog : A 4 pattes, tendez le bras droit et la jambe gauche simultanement. Maintenez 8 sec. Alternez.

Pyramide : 5 repetitions de 8 sec, puis 3, puis 1. Chaque cote.`,
  },
]

export default function PosturalScreen() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-bg pb-24">
      <Header title="Rappels posturaux" showBack />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-3">
        {sections.map((section, i) => (
          <div key={i} className="bg-surface rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full px-4 py-3 flex items-center justify-between text-left"
            >
              <span className="text-sm font-semibold text-zinc-100">{section.title}</span>
              <span className={`text-zinc-500 transition-transform ${openIndex === i ? 'rotate-180' : ''}`}>
                ▾
              </span>
            </button>
            {openIndex === i && (
              <div className="px-4 pb-4">
                <p className="text-xs text-zinc-400 leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
