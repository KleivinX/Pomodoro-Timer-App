'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getUserXp, calculateStats } from '@/lib/xp-system'
import { Card, CardContent } from '@/components/ui/card'
import { Zap } from 'lucide-react'

export function XpProgressBar() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ level: 1, totalXp: 0, currentLevelXp: 0, xpToNextLevel: 100 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadXp() {
      if (!user) return
      const userStats = await getUserXp(user.id)
      if (userStats) {
        setStats(userStats)
      }
      setLoading(false)
    }

    loadXp()
  }, [user])

  if (loading) return null

  const progressPercent = (stats.currentLevelXp / 100) * 100

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <span className="font-semibold">Level {stats.level}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {stats.currentLevelXp} / 100 XP
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {stats.xpToNextLevel} XP to next level
        </p>
      </CardContent>
    </Card>
  )
}
