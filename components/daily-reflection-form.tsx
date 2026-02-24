'use client'

import { useState } from 'react'
import { createDailyReflection } from '@/lib/api/reflections'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export function DailyReflectionForm() {
  const [loading, setLoading] = useState(false)
  const [oneWin, setOneWin] = useState('')
  const [oneImprovement, setOneImprovement] = useState('')
  const [tomorrowFocus, setTomorrowFocus] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await createDailyReflection(oneWin, oneImprovement, tomorrowFocus)
      if (result) {
        toast.success('Reflection saved! +5 XP')
        setOneWin('')
        setOneImprovement('')
        setTomorrowFocus('')
      } else {
        toast.error('Failed to save reflection')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Reflection</CardTitle>
        <CardDescription>
          Take 2 minutes to reflect on your day. +5 XP
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">One Win</label>
            <Textarea
              placeholder="What went well today? What are you proud of?"
              value={oneWin}
              onChange={(e) => setOneWin(e.target.value)}
              disabled={loading}
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">One Improvement</label>
            <Textarea
              placeholder="What could you do better tomorrow?"
              value={oneImprovement}
              onChange={(e) => setOneImprovement(e.target.value)}
              disabled={loading}
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tomorrow's Focus</label>
            <Textarea
              placeholder="What's your main focus for tomorrow?"
              value={tomorrowFocus}
              onChange={(e) => setTomorrowFocus(e.target.value)}
              disabled={loading}
              required
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Save Reflection'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
