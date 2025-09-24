"use client"

import type { TimerMode, TimerState } from "./pomodoro-timer"
import { useMemo } from "react"

interface TimerDisplayProps {
  timeLeft: number
  progress: number
  mode: TimerMode
  state: TimerState
}

export function TimerDisplay({ timeLeft, progress, mode, state }: TimerDisplayProps) {
  const { minutes, seconds } = useMemo(
    () => ({
      minutes: Math.floor(timeLeft / 60),
      seconds: timeLeft % 60,
    }),
    [timeLeft],
  )

  const formatTime = (time: number) => time.toString().padStart(2, "0")

  const getModeColor = () => {
    switch (mode) {
      case "pomodoro":
        return "text-pomodoro"
      case "shortBreak":
        return "text-short-break"
      case "longBreak":
        return "text-long-break"
      default:
        return "text-pomodoro"
    }
  }

  const getProgressColor = () => {
    switch (mode) {
      case "pomodoro":
        return "stroke-pomodoro"
      case "shortBreak":
        return "stroke-short-break"
      case "longBreak":
        return "stroke-long-break"
      default:
        return "stroke-pomodoro"
    }
  }

  const { radius, circumference, strokeDashoffset } = useMemo(() => {
    const r = 120
    const c = 2 * Math.PI * r
    const offset = c - (progress / 100) * c
    return { radius: r, circumference: c, strokeDashoffset: offset }
  }, [progress])

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Circular Progress Ring */}
      <div className="relative float">
        <svg className="transform -rotate-90 w-64 h-64 transition-all duration-300" width="256" height="256">
          {/* Background circle */}
          <circle
            cx="128"
            cy="128"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-muted/30 transition-all duration-200"
          />
          {/* Progress circle */}
          <circle
            cx="128"
            cy="128"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${getProgressColor()} transition-all duration-300 ease-out`}
            style={{
              transitionProperty: "stroke-dashoffset",
            }}
          />
        </svg>

        {/* Timer Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-6xl font-mono font-bold ${getModeColor()} transition-all duration-200 ease-out`}>
            {formatTime(minutes)}:{formatTime(seconds)}
          </div>
          <div className="text-sm text-muted-foreground mt-2 capitalize transition-all duration-200 opacity-80">
            {mode === "shortBreak" ? "Short Break" : mode === "longBreak" ? "Long Break" : mode}
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center gap-3">
        <div
          className={`w-3 h-3 rounded-full transition-all duration-300 ease-out ${
            state === "running"
              ? "bg-green-500 animate-pulse shadow-lg shadow-green-500/50"
              : state === "paused"
                ? "bg-yellow-500 shadow-lg shadow-yellow-500/50"
                : "bg-muted shadow-sm"
          }`}
        />
        <span className="text-sm text-muted-foreground capitalize transition-all duration-200 font-medium">
          {state === "idle" ? "Ready to start" : state}
        </span>
      </div>
    </div>
  )
}
