"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Header } from "./header"
import { ModeSelector } from "./mode-selector"
import { TimerDisplay } from "./timer-display"
import { Controls } from "./controls"
import { SessionTracker } from "./session-tracker"
import { ConfettiEffect } from "./confetti-effect"
import { TaskManager } from "./task-manager"
import { Notes } from "./notes"
import { YouTubeWidget } from "./youtube-widget"

export type TimerMode = "pomodoro" | "shortBreak" | "longBreak"
export type TimerState = "idle" | "running" | "paused"

const TIMER_DURATIONS = {
  pomodoro: 25 * 60, // 25 minutes
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
}

export function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>("pomodoro")
  const [state, setState] = useState<TimerState>("idle")
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS.pomodoro)
  const [completedSessions, setCompletedSessions] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [pausedTime, setPausedTime] = useState<number | null>(null)

  const progress = useMemo(() => ((TIMER_DURATIONS[mode] - timeLeft) / TIMER_DURATIONS[mode]) * 100, [mode, timeLeft])

  const playNotificationSound = useCallback(() => {
    try {
      // Create a simple notification beep using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime) // 800Hz tone
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch (error) {
      console.log("[v0] Audio notification not supported")
    }
  }, [])

  // Handle mode change
  const handleModeChange = useCallback((newMode: TimerMode) => {
    setMode(newMode)
    setTimeLeft(TIMER_DURATIONS[newMode])
    setState("idle")
    setStartTime(null)
    setPausedTime(null)
  }, [])

  // Start timer
  const handleStart = useCallback(() => {
    if (state === "paused" && pausedTime) {
      // Resume from pause
      const pauseDuration = Date.now() - pausedTime
      setStartTime((prev) => (prev ? prev + pauseDuration : Date.now()))
    } else {
      // Fresh start
      setStartTime(Date.now())
    }
    setState("running")
    setPausedTime(null)
  }, [state, pausedTime])

  // Pause timer
  const handlePause = useCallback(() => {
    setState("paused")
    setPausedTime(Date.now())
  }, [])

  // Reset timer
  const handleReset = useCallback(() => {
    setState("idle")
    setTimeLeft(TIMER_DURATIONS[mode])
    setStartTime(null)
    setPausedTime(null)
  }, [mode])

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (state === "running" && startTime) {
      intervalId = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        const remaining = TIMER_DURATIONS[mode] - elapsed

        if (remaining <= 0) {
          // Timer completed
          setTimeLeft(0)
          setState("idle")
          setStartTime(null)

          playNotificationSound()

          // Handle session completion
          if (mode === "pomodoro") {
            setCompletedSessions((prev) => prev + 1)
            setShowConfetti(true)
            setTimeout(() => setShowConfetti(false), 3000)

            // Auto-switch to break after 4 pomodoros
            const nextSession = completedSessions + 1
            if (nextSession % 4 === 0) {
              handleModeChange("longBreak")
            } else {
              handleModeChange("shortBreak")
            }
          } else {
            // Break completed, switch back to pomodoro
            handleModeChange("pomodoro")
          }
        } else {
          setTimeLeft(remaining)
        }
      }, 200) // Reduced frequency from 100ms to 200ms for better performance
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [state, startTime, mode, completedSessions, handleModeChange, playNotificationSound])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && state === "running" && startTime) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        const remaining = TIMER_DURATIONS[mode] - elapsed
        setTimeLeft(Math.max(0, remaining))
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [state, startTime, mode])

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-8">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 transition-all duration-300">
          <div className="lg:col-span-1 order-3 lg:order-1">
            <YouTubeWidget />
          </div>

          <div className="lg:col-span-2 order-1 lg:order-2 slide-in-up">
            <div className="glass-smooth rounded-3xl p-8 shadow-2xl border backdrop-blur-xl">
              <div className="space-y-8">
                <ModeSelector currentMode={mode} onModeChange={handleModeChange} disabled={state === "running"} />

                <TimerDisplay timeLeft={timeLeft} progress={progress} mode={mode} state={state} />

                <Controls state={state} onStart={handleStart} onPause={handlePause} onReset={handleReset} />
              </div>
            </div>

            <div className="mt-8 slide-in-up">
              <SessionTracker completedSessions={completedSessions} />
            </div>
          </div>

          <div className="lg:col-span-1 order-2 lg:order-3 space-y-6">
            <TaskManager />
            <Notes />
          </div>
        </div>
      </div>

      {showConfetti && <ConfettiEffect />}
    </div>
  )
}
