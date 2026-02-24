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
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" />
              <div className="text-3xl font-bold">{streak.current}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">days locked in</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Longest Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-red-500" />
              <div className="text-3xl font-bold">{streak.longest}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">personal best</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>30-Day Lock-In Calendar</CardTitle>
          <CardDescription>Green = Locked In | Yellow = Partial | Gray = Missed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-2">
                {week.map((score, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`aspect-square rounded-lg border-2 flex items-center justify-center cursor-pointer ${levelColors[score.lockInLevel]}`}
                    title={`${score.date}: ${score.focusSessions} sessions, ${score.tasksCompleted} tasks, ${score.xpEarned} XP`}
                  >
                    {levelIcons[score.lockInLevel]}
                  </div>
                ))}
                {week.length < 7 &&
                  Array.from({ length: 7 - week.length }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
