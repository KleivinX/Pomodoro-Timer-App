'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getLockInHistory, getLockInStreak } from '@/lib/lock-in-engine'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Flame, Zap } from 'lucide-react'

interface LockInScore {
  date: string
  focusSessions: number
  tasksCompleted: number
  reflectionDone: boolean
  lockInLevel: 'none' | 'partial' | 'locked'
  xpEarned: number
}

export function LockInCalendarView() {
  const { user } = useAuth()
  const [lockInHistory, setLockInHistory] = useState<LockInScore[]>([])
  const [streak, setStreak] = useState({ current: 0, longest: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      if (!user) return

      const [history, streakData] = await Promise.all([
        getLockInHistory(user.id, 30),
        getLockInStreak(user.id),
      ])

      setLockInHistory(history)
      setStreak(streakData)
      setLoading(false)
    }

    loadData()
  }, [user])

  if (loading) {
    return <div className="text-center text-muted-foreground">Loading calendar...</div>
  }

  // Create a 7-column calendar grid for 30 days
  const weeks = Array.from({ length: Math.ceil(30 / 7) }, (_, i) => lockInHistory.slice(i * 7, (i + 1) * 7))

  const levelColors = {
    locked: 'bg-accent border-accent',
    partial: 'bg-primary border-primary',
    none: 'bg-muted border-border'
  }

  const levelIcons = {
    locked: <Flame className="w-4 h-4 text-accent" />,
    partial: <Zap className="w-4 h-4 text-primary" />,
    none: null
  }

  return (
    <div className="space-y-4">
      {/* Streak row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="game-card p-4 flex flex-col gap-1">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Current Streak</span>
          <div className="flex items-center gap-2 mt-1">
            <Flame className="w-5 h-5 text-destructive" />
            <span className="text-3xl font-black">{streak.current}</span>
          </div>
          <p className="text-xs font-semibold text-muted-foreground">days locked in</p>
        </div>
        <div className="game-card p-4 flex flex-col gap-1">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Best Streak</span>
          <div className="flex items-center gap-2 mt-1">
            <Flame className="w-5 h-5 text-primary" />
            <span className="text-3xl font-black">{streak.longest}</span>
          </div>
          <p className="text-xs font-semibold text-muted-foreground">personal best</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="game-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-base">30-Day Lock-In</h3>
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-muted border border-border inline-block" /> Missed</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary border border-border inline-block" /> Partial</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-accent border border-border inline-block" /> Locked</span>
          </div>
        </div>
        <div className="space-y-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1.5">
              {week.map((score, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`aspect-square rounded-lg border-2 flex items-center justify-center cursor-pointer transition-transform hover:scale-110 ${levelColors[score.lockInLevel]}`}
                  title={`${score.date}: ${score.focusSessions} sessions, ${score.tasksCompleted} tasks, ${score.xpEarned} XP`}
                >
                  {levelIcons[score.lockInLevel]}
                </div>
              ))}
              {week.length < 7 && Array.from({ length: 7 - week.length }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
