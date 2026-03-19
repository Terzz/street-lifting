import { DayType } from '../types'

export const DAY_COLORS: Record<DayType, string> = {
  A: '#2dd4bf', // pull
  B: '#f472b6', // push+legs
  C: '#fbbf24', // explosive
  D: '#f472b6', // push+legs v2
}

export const DAY_COLOR_CLASSES: Record<DayType, { bg: string; text: string; border: string }> = {
  A: { bg: 'bg-pull/10', text: 'text-pull', border: 'border-pull/30' },
  B: { bg: 'bg-push/10', text: 'text-push', border: 'border-push/30' },
  C: { bg: 'bg-explosive/10', text: 'text-explosive', border: 'border-explosive/30' },
  D: { bg: 'bg-push/10', text: 'text-push', border: 'border-push/30' },
}
