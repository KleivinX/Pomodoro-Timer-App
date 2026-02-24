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
          w-20 h-20 rounded-full shadow-lg
          ${state === "running" ? "bg-secondary hover:bg-secondary/90 text-white" : "bg-primary hover:bg-primary/90 text-primary-foreground"}
        `}
        aria-label={state === "running" ? "Pause timer" : "Start timer"}
      >
        {state === "running" ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-1" />}
      </Button>

      {/* Reset Button */}
      <Button
        onClick={onReset}
        variant="outline"
        size="lg"
        className="w-16 h-16 rounded-full border-2 border-border hover:border-primary hover:bg-primary/10 bg-background transition-colors"
        aria-label="Reset timer"
      >
        <RotateCcw className="h-5 w-5" />
      </Button>
    </div>
  )
}
