"use client"

import type { TimerMode } from "./pomodoro-timer"
import { Button } from "@/components/ui/button"

interface ModeSelectorProps {
  currentMode: TimerMode
  onModeChange: (mode: TimerMode) => void
  disabled?: boolean
}

const modes = [
  {
    id: "pomodoro" as TimerMode,
    label: "Pomodoro",
    emoji: "🍅", // Added emoji for pomodoro
    color: "bg-pomodoro hover:bg-pomodoro/90 text-pomodoro-foreground",
    description: "25 min focus session",
  },
  {
    id: "shortBreak" as TimerMode,
    label: "Short Break",
    emoji: "☕", // Added emoji for short break
    color: "bg-short-break hover:bg-short-break/90 text-short-break-foreground",
    description: "5 min break",
  },
  {
    id: "longBreak" as TimerMode,
    label: "Long Break",
    emoji: "🛋️", // Added emoji for long break
    color: "bg-long-break hover:bg-long-break/90 text-long-break-foreground",
    description: "15 min break",
  },
]

export function ModeSelector({ currentMode, onModeChange, disabled }: ModeSelectorProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 slide-in-up">
      {modes.map((mode) => {
        const isActive = currentMode === mode.id

        return (
          <Button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            disabled={disabled}
            variant={isActive ? "default" : "outline"}
            className={`
              flex-1 h-auto p-4 rounded-2xl transition-all duration-200 ease-out group btn-smooth relative overflow-hidden
              ${isActive ? `${mode.color} shadow-lg scale-105` : "hover:scale-102 hover:shadow-md glass-smooth"}
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <div className="flex flex-col items-center gap-2 relative z-10">
              <span className="text-2xl transition-all duration-200 group-hover:scale-110">{mode.emoji}</span>
              <div className="text-center">
                <div
                  className={`font-semibold transition-all duration-200 ${
                    isActive ? "text-current" : "text-foreground"
                  }`}
                >
                  {mode.label}
                </div>
                <div
                  className={`text-xs transition-all duration-200 ${
                    isActive ? "text-current opacity-80" : "text-muted-foreground group-hover:opacity-100"
                  }`}
                >
                  {mode.description}
                </div>
              </div>
            </div>
          </Button>
        )
      })}
    </div>
  )
}
