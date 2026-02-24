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

  // #E74C3C red, #00BFA5 teal, #D35400 caramel, #2D3436 dark
  const modeColors: Record<TimerMode, { text: string; stroke: string }> = {
    pomodoro:   { text: "text-destructive",  stroke: "#E74C3C" },
    shortBreak: { text: "text-accent",       stroke: "#00BFA5" },
    longBreak:  { text: "text-secondary",    stroke: "#D35400" },
    custom:     { text: "text-foreground",   stroke: "#2D3436" },
  }

  const getModeLabel = () => {
    switch (mode) {
      case "shortBreak":
        return "Short Break"
      case "longBreak":
        return "Long Break"
      case "custom":
        return "Custom Timer"
      default:
        return mode.charAt(0).toUpperCase() + mode.slice(1)
    }
  }

  const { radius, circumference, strokeDashoffset } = useMemo(() => {
    const r = 120
    const c = 2 * Math.PI * r
    const offset = c - (progress / 100) * c
    return { radius: r, circumference: c, strokeDashoffset: offset }
  }, [progress])

  const { text: textColor, stroke: strokeColor } = modeColors[mode]

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Circular Progress Ring */}
      <div className="relative">
        <svg className="-rotate-90 w-64 h-64" width="256" height="256">
          {/* Background circle */}
          <circle cx="128" cy="128" r={radius} stroke="#E8D0B8" strokeWidth="10" fill="transparent" />
          {/* Progress circle */}
          <circle
            cx="128"
            cy="128"
            r={radius}
            stroke={strokeColor}
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Timer Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-6xl font-mono font-bold ${textColor}`}>
            {formatTime(minutes)}:{formatTime(seconds)}
          </div>
          <div className="text-sm text-muted-foreground mt-2 font-medium">{getModeLabel()}</div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center gap-2">
        <div
          className={`w-2.5 h-2.5 rounded-full ${
            state === "running" ? "bg-accent animate-pulse" : state === "paused" ? "bg-primary" : "bg-muted-foreground/40"
          }`}
        />
        <span className="text-sm text-muted-foreground font-medium capitalize">
          {state === "idle" ? "Ready to start" : state}
        </span>
      </div>
    </div>
  )
}
