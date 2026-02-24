'use client'

import { PomodoroTimer } from '@/components/pomodoro-timer'

export default function TimerPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground">Focus Timer</h1>
          <p className="text-muted-foreground font-semibold mt-1 text-sm">Lock in and crush your session</p>
        </div>
        <div className="game-card px-4 py-2 flex items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground">+10 XP</span>
          <span className="text-xs text-muted-foreground font-semibold">per session</span>
        </div>
      </div>
      <PomodoroTimer />
    </div>
  )
}
