'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { XpProgressBar } from '@/components/xp-progress-bar'
import { BadgesDisplay } from '@/components/badges-display'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Flame, Zap, Target, Award } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalTasks: 0,
    totalCards: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      if (!user) return

      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(profileData)

      // Load session count
      const { count: sessionCount } = await supabase
        .from('focus_sessions')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)

      // Load task count
      const { count: taskCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)

      // Load card count
      const { count: cardCount } = await supabase
        .from('study_cards')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)

      setStats({
        totalSessions: sessionCount || 0,
        totalTasks: taskCount || 0,
        totalCards: cardCount || 0,
      })

      setLoading(false)
    }

    loadProfile()
  }, [user])

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground">
          {profile?.full_name || 'User Profile'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {user?.email}
        </p>
      </div>

      <XpProgressBar />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Flame className="w-4 h-4" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{profile?.current_streak || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Longest Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{profile?.longest_streak || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="w-4 h-4" />
              Focus Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalSessions}</div>
            <p className="text-xs text-muted-foreground mt-1">total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Award className="w-4 h-4" />
              Tasks Done
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">completed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <BadgesDisplay />

        <Card>
          <CardHeader>
            <CardTitle>Study Statistics</CardTitle>
            <CardDescription>Your learning progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-foreground">Study Cards Created</span>
              <span className="text-2xl font-bold text-primary">{stats.totalCards}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground">Total XP Earned</span>
              <span className="text-2xl font-bold text-primary">{profile?.total_xp || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground">Lock-In Rule</span>
              <span className="text-foreground font-medium capitalize">
                {profile?.lock_in_rule?.replace(/_/g, ' ') || 'Focus Task'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
