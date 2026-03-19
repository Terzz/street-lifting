/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0f',
        surface: '#141418',
        border: '#1e1e24',
        pull: '#2dd4bf',
        push: '#f472b6',
        explosive: '#fbbf24',
        rest: '#a78bfa',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"SF Mono"', '"Fira Code"', 'monospace'],
      },
    },
  },
  plugins: [],
}
