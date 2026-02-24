'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { DailyReflectionForm } from '@/components/daily-reflection-form'
import { getReflectionHistory } from '@/lib/api/reflections'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lightbulb } from 'lucide-react'

export default function ReflectionsPage() {
  const { user } = useAuth()
  const [reflections, setReflections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadReflections() {
      if (!user) return
      const data = await getReflectionHistory(30)
      setReflections(data)
      setLoading(false)
    }

    loadReflections()
  }, [user])

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Daily Reflections</h1>
        <p className="text-muted-foreground mt-2">
          Take time to reflect on your progress and growth
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <DailyReflectionForm />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Past Reflections</CardTitle>
              <CardDescription>{reflections.length} reflections this month</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : reflections.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No reflections yet. Start with today's reflection!
                </p>
              ) : (
                <div className="space-y-4">
                  {reflections.map(reflection => (
                    <div
                      key={reflection.id}
                      className="border border-border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-foreground">{reflection.reflection_date}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Lightbulb className="w-3 h-3" />
                          +{reflection.xp_awarded} XP
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">One Win</p>
                          <p className="text-sm text-foreground">{reflection.one_win}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">One Improvement</p>
                          <p className="text-sm text-foreground">{reflection.one_improvement}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium">Tomorrow's Focus</p>
                          <p className="text-sm text-foreground">{reflection.tomorrow_focus}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
