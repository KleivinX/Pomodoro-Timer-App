"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { ModeSelector } from "./mode-selector"
import { TimerDisplay } from "./timer-display"
import { Controls } from "./controls"
import { SessionTracker } from "./session-tracker"
import { ConfettiEffect } from "./confetti-effect"
import { TaskManager } from "./task-manager"
import { Notes } from "./notes"
import { YouTubeWidget } from "./youtube-widget"
import { recordFocusSession } from "@/lib/activity-tracker"

export type TimerMode = "pomodoro" | "shortBreak" | "longBreak" | "custom"
export type TimerState = "idle" | "running" | "paused"

const TIMER_DURATIONS = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
  custom: 10 * 60, // Default 10 minutes for custom
}

export function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>("pomodoro")
  const [state, setState] = useState<TimerState>("idle")
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS.pomodoro)
  const [completedSessions, setCompletedSessions] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [pausedTime, setPausedTime] = useState<number | null>(null)
  const [customDuration, setCustomDuration] = useState(10 * 60) // Default 10 minutes

  const currentDuration = mode === "custom" ? customDuration : TIMER_DURATIONS[mode]
  const progress = useMemo(() => ((currentDuration - timeLeft) / currentDuration) * 100, [currentDuration, timeLeft])

  const playStartTickSound = useCallback(() => {
    if (typeof window === 'undefined') return
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = context.createOscillator()
      const gain = context.createGain()
      osc.connect(gain)
      gain.connect(context.destination)
      osc.frequency.value = 600
      osc.type = "sine"
      gain.gain.setValueAtTime(0.2, context.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.15)
      osc.start(context.currentTime)
      osc.stop(context.currentTime + 0.15)
    } catch (e) {
      // Silent fail
    }
  }, [])

  const playCompletionTickingSound = useCallback(() => {
    if (typeof window === 'undefined') return
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)()
      for (let i = 0; i < 10; i++) {
        const t = context.currentTime + i * 0.1
        const osc = context.createOscillator()
        const gain = context.createGain()
        osc.connect(gain)
        gain.connect(context.destination)
        osc.frequency.value = i % 2 === 0 ? 440 : 350
        gain.gain.setValueAtTime(0.1, t)
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08)
        osc.start(t)
        osc.stop(t + 0.08)
      }
    } catch (e) {
      // Silent fail
    }
  }, [])

  const handleModeChange = useCallback(
    (newMode: TimerMode) => {
      setMode(newMode)
      setTimeLeft(newMode === "custom" ? customDuration : TIMER_DURATIONS[newMode])
      setState("idle")
      setStartTime(null)
      setPausedTime(null)
    },
    [customDuration],
  )

  const handleCustomDurationChange = useCallback(
    (newDuration: number) => {
      setCustomDuration(newDuration)
      if (mode === "custom" && state === "idle") {
        setTimeLeft(newDuration)
      }
    },
    [mode, state],
  )

  const handleStart = useCallback(() => {
    playStartTickSound()

    if (state === "paused" && pausedTime) {
      const pauseDuration = Date.now() - pausedTime
      setStartTime((prev) => (prev ? prev + pauseDuration : Date.now()))
    } else {
      setStartTime(Date.now())
    }
    setState("running")
    setPausedTime(null)
  }, [state, pausedTime, playStartTickSound])

  const handlePause = useCallback(() => {
    setState("paused")
    setPausedTime(Date.now())
  }, [])

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
        const remaining = currentDuration - elapsed

        if (remaining <= 0) {
          setTimeLeft(0)
          setState("idle")
          setStartTime(null)
          playCompletionTickingSound()

          if (mode === "pomodoro") {
            setCompletedSessions((prev) => prev + 1)
            recordFocusSession()
            setShowConfetti(true)
            setTimeout(() => setShowConfetti(false), 2000)
            const nextSession = completedSessions + 1
            if (nextSession % 4 === 0) {
              handleModeChange("longBreak")
            } else {
              handleModeChange("shortBreak")
            }
          } else if (mode !== "custom") {
            handleModeChange("pomodoro")
          } else {
            setTimeLeft(customDuration)
          }
        } else {
          setTimeLeft(remaining)
        }
      }, 500)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [
    state,
    startTime,
    mode,
    currentDuration,
    completedSessions,
    customDuration,
    handleModeChange,
    playCompletionTickingSound,
  ])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && state === "running" && startTime) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        const remaining = currentDuration - elapsed
        setTimeLeft(Math.max(0, remaining))
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [state, startTime, currentDuration])

  return (
    <div className="max-w-5xl mx-auto">
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-300">
          {/* Main Timer Section */}
          <div className="lg:col-span-2 order-1">
            <div className="rounded-2xl p-8 border-2 border-border bg-card shadow-md">
              <div className="space-y-8">
                <ModeSelector
                  currentMode={mode}
                  onModeChange={handleModeChange}
                  disabled={state === "running"}
                  customDuration={customDuration}
                  onCustomDurationChange={handleCustomDurationChange}
                />

                <TimerDisplay timeLeft={timeLeft} progress={progress} mode={mode} state={state} />

                <Controls state={state} onStart={handleStart} onPause={handlePause} onReset={handleReset} />
              </div>
            </div>

            <div className="mt-8 slide-in-up">
              <SessionTracker completedSessions={completedSessions} />
            </div>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-1 order-2 space-y-6">
            <TaskManager />
            <Notes />
          </div>
        </div>
      </div>

      {/* Floating YouTube Widget */}
      <YouTubeWidget />

      {showConfetti && <ConfettiEffect />}
    </div>
  )
}
