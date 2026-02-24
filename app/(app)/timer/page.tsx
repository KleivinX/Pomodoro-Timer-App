'use client'

import { PomodoroTimer } from '@/components/pomodoro-timer'

export default function TimerPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Focus Timer</h1>
        <p className="text-muted-foreground mt-1">Lock in and crush your session</p>
      </div>
      <PomodoroTimer />
    </div>
  )
}
