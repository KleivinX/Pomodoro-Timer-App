"use client"

import type { TimerState } from "./pomodoro-timer"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw } from "lucide-react"

interface ControlsProps {
  state: TimerState
  onStart: () => void
  onPause: () => void
  onReset: () => void
}

export function Controls({ state, onStart, onPause, onReset }: ControlsProps) {
  return (
    <div className="flex items-center justify-center gap-6 slide-in-up">
      {/* Start/Pause Button */}
      <Button
        onClick={state === "running" ? onPause : onStart}
        size="lg"
        className={`
          w-20 h-20 rounded-full transition-all duration-300 shadow-lg hover:shadow-2xl btn-smooth
          ${
            state === "running"
              ? "bg-yellow-500 hover:bg-yellow-600 text-white glow"
              : "bg-primary hover:bg-primary/90 text-primary-foreground"
          }
          hover:scale-110 active:scale-95 relative overflow-hidden
        `}
        style={{
          boxShadow:
            state === "running"
              ? "0 0 30px rgba(234, 179, 8, 0.4), 0 10px 25px rgba(0, 0, 0, 0.15)"
              : "0 10px 25px rgba(0, 0, 0, 0.15)",
        }}
        aria-label={state === "running" ? "Pause timer" : "Start timer"}
      >
        <div className="transition-all duration-200 ease-out">
          {state === "running" ? (
            <Pause className="h-7 w-7 transition-transform duration-200" />
          ) : (
            <Play className="h-7 w-7 ml-1 transition-transform duration-200" />
          )}
        </div>

        <div className="absolute inset-0 rounded-full bg-white/20 scale-0 transition-transform duration-300 group-active:scale-100" />
      </Button>

      {/* Reset Button */}
      <Button
        onClick={onReset}
        variant="outline"
        size="lg"
        className="w-16 h-16 rounded-full glass-smooth hover:bg-muted/50 transition-all duration-300 hover:scale-110 active:scale-95 bg-transparent btn-smooth relative overflow-hidden group"
        aria-label="Reset timer"
      >
        <RotateCcw className="h-5 w-5 transition-all duration-300 group-hover:rotate-180" />

        <div className="absolute inset-0 rounded-full bg-muted/10 scale-0 transition-transform duration-300 group-hover:scale-100" />
      </Button>
    </div>
  )
}
