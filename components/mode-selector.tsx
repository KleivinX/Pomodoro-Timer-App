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
    description: "25 min focus",
    activeClass: "bg-destructive text-white border-destructive",
  },
  {
    id: "shortBreak" as TimerMode,
    label: "Short Break",
    description: "5 min break",
    activeClass: "bg-accent text-white border-accent",
  },
  {
    id: "longBreak" as TimerMode,
    label: "Long Break",
    description: "15 min break",
    activeClass: "bg-secondary text-white border-secondary",
  },
  {
    id: "custom" as TimerMode,
    label: "Custom",
    description: "Set your time",
    activeClass: "bg-foreground text-background border-foreground",
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
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              disabled={disabled}
              className={`
                flex-1 px-3 py-3 rounded-xl border-2 font-semibold text-sm transition-colors
                ${isActive ? mode.activeClass : "border-border bg-background text-foreground hover:border-primary hover:bg-primary/10"}
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              <div className="font-semibold">{mode.label}</div>
              <div className={`text-xs mt-0.5 ${isActive ? "opacity-80" : "text-muted-foreground"}`}>
                {isCustom ? formatCustomDuration() : mode.description}
              </div>
            </button>
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
