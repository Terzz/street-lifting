import { useState, useRef, useCallback, useEffect } from 'react'

let audioCtx: AudioContext | null = null

function playBeep() {
  // Vibration API (Android)
  navigator.vibrate?.([200, 100, 200, 100, 400])

  // Audio beep fallback (iOS)
  try {
    if (!audioCtx) audioCtx = new AudioContext()
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.frequency.value = 880
    gain.gain.value = 0.3
    osc.start()
    osc.stop(audioCtx.currentTime + 0.5)
  } catch {
    // no audio support
  }
}

export function unlockAudio() {
  if (!audioCtx) audioCtx = new AudioContext()
  if (audioCtx.state === 'suspended') void audioCtx.resume()
}

export function useTimer() {
  const [remaining, setRemaining] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const startTimeRef = useRef(0)
  const durationRef = useRef(0)

  const start = useCallback((seconds: number) => {
    startTimeRef.current = Date.now()
    durationRef.current = seconds
    setRemaining(seconds)
    setIsRunning(true)
  }, [])

  const stop = useCallback(() => {
    setIsRunning(false)
    setRemaining(0)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    if (!isRunning) return
    intervalRef.current = window.setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000
      const left = Math.max(0, durationRef.current - elapsed)
      setRemaining(Math.ceil(left))
      if (left <= 0) {
        setIsRunning(false)
        playBeep()
      }
    }, 250)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  const progress = durationRef.current > 0 ? (durationRef.current - remaining) / durationRef.current : 0

  return { remaining, isRunning, progress, start, stop }
}
