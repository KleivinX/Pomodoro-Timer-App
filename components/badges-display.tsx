'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getUserBadges, BADGES, Badge } from '@/lib/badges'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function BadgesDisplay() {
  const { user } = useAuth()
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadBadges() {
      if (!user) return
      const userBadges = await getUserBadges(user.id)
      setBadges(userBadges)
      setLoading(false)
    }

    loadBadges()
  }, [user])

  if (loading) {
    return <div className="text-center text-muted-foreground">Loading badges...</div>
  }

  const allBadges = Object.values(BADGES)
  const unlockedIds = new Set(badges.map(b => b.id))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
        <CardDescription>
          {badges.length} / {allBadges.length} badges unlocked
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {allBadges.map(badge => (
            <div
              key={badge.id}
              className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center text-center transition-all ${
                unlockedIds.has(badge.id)
                  ? 'border-primary bg-primary/10 opacity-100'
                  : 'border-muted bg-muted/30 opacity-50 grayscale'
              }`}
              title={`${badge.name}: ${badge.requirement}`}
            >
              <div className="text-2xl mb-1">{badge.icon}</div>
              <div className="text-xs font-semibold line-clamp-2">{badge.name}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
