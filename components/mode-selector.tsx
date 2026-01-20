"use client"

import { useState } from "react"
import type { TimerMode } from "./pomodoro-timer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings } from "lucide-react"

interface ModeSelectorProps {
  currentMode: TimerMode
  onModeChange: (mode: TimerMode) => void
  disabled?: boolean
  customDuration: number
  onCustomDurationChange: (duration: number) => void
}

const modes = [
  {
    id: "pomodoro" as TimerMode,
    label: "Pomodoro",
    emoji: "🍅",
    color: "bg-pomodoro hover:bg-pomodoro/90 text-pomodoro-foreground",
    description: "25 min focus session",
  },
  {
    id: "shortBreak" as TimerMode,
    label: "Short Break",
    emoji: "☕",
    color: "bg-short-break hover:bg-short-break/90 text-short-break-foreground",
    description: "5 min break",
  },
  {
    id: "longBreak" as TimerMode,
    label: "Long Break",
    emoji: "🛋️",
    color: "bg-long-break hover:bg-long-break/90 text-long-break-foreground",
    description: "15 min break",
  },
  {
    id: "custom" as TimerMode,
    label: "Custom",
    emoji: "⏱️",
    color: "bg-purple-500 hover:bg-purple-600 text-white",
    description: "Set your time",
  },
]

export function ModeSelector({
  currentMode,
  onModeChange,
  disabled,
  customDuration,
  onCustomDurationChange,
}: ModeSelectorProps) {
  const [isEditingCustom, setIsEditingCustom] = useState(false)
  const [customMinutes, setCustomMinutes] = useState(Math.floor(customDuration / 60))
  const [customSeconds, setCustomSeconds] = useState(customDuration % 60)

  const handleSaveCustomDuration = () => {
    const totalSeconds = customMinutes * 60 + customSeconds
    if (totalSeconds > 0) {
      onCustomDurationChange(totalSeconds)
    }
    setIsEditingCustom(false)
  }

  const formatCustomDuration = () => {
    const mins = Math.floor(customDuration / 60)
    const secs = customDuration % 60
    if (secs > 0) {
      return `${mins}m ${secs}s`
    }
    return `${mins} min`
  }

  return (
    <div className="space-y-3 slide-in-up">
      <div className="flex flex-col sm:flex-row gap-3">
        {modes.map((mode) => {
          const isActive = currentMode === mode.id
          const isCustom = mode.id === "custom"

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
                    {isCustom ? formatCustomDuration() : mode.description}
                  </div>
                </div>
              </div>
            </Button>
          )
        })}
      </div>

      {currentMode === "custom" && !disabled && (
        <div className="glass-smooth rounded-xl p-4 border">
          {isEditingCustom ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="180"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(Math.max(0, Math.min(180, Number.parseInt(e.target.value) || 0)))}
                  className="w-16 h-10 text-center"
                  placeholder="min"
                />
                <span className="text-sm text-muted-foreground">min</span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="59"
                  value={customSeconds}
                  onChange={(e) => setCustomSeconds(Math.max(0, Math.min(59, Number.parseInt(e.target.value) || 0)))}
                  className="w-16 h-10 text-center"
                  placeholder="sec"
                />
                <span className="text-sm text-muted-foreground">sec</span>
              </div>
              <Button onClick={handleSaveCustomDuration} size="sm" className="ml-auto">
                Save
              </Button>
            </div>
          ) : (
            <button
              onClick={() => {
                setCustomMinutes(Math.floor(customDuration / 60))
                setCustomSeconds(customDuration % 60)
                setIsEditingCustom(true)
              }}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full justify-center"
            >
              <Settings className="w-4 h-4" />
              <span>Edit custom duration: {formatCustomDuration()}</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
