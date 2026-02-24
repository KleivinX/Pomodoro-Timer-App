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
    <div className="flex items-center justify-center gap-5">
      {/* Reset Button */}
      <button
        onClick={onReset}
        className="game-btn w-14 h-14 rounded-full bg-muted text-foreground flex items-center justify-center"
        aria-label="Reset timer"
      >
        <RotateCcw className="h-5 w-5" />
      </button>

      {/* Start/Pause Button — bigger, chunky */}
      <button
        onClick={state === "running" ? onPause : onStart}
        className={`game-btn w-20 h-20 rounded-full flex items-center justify-center text-white ${
          state === "running" ? "bg-secondary" : "bg-primary"
        }`}
        aria-label={state === "running" ? "Pause timer" : "Start timer"}
      >
        {state === "running" ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-1" />}
      </button>

      {/* Spacer to balance layout */}
      <div className="w-14 h-14" />
    </div>
  )
}
