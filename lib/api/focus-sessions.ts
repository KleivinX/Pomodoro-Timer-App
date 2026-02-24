import { supabase } from '@/lib/supabase'

export interface FocusSession {
  id: string
  user_id: string
  session_date: string
  duration_minutes: number
  mode: 'focus' | 'short_break' | 'long_break'
  quality_rating?: number
  work_description?: string
  xp_awarded: number
  created_at: string
  completed_at?: string
}

export async function createFocusSession(
  durationMinutes: number,
  mode: 'focus' | 'short_break' | 'long_break',
  workDescription?: string
): Promise<FocusSession | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const xpAwarded = mode === 'focus' ? 10 : 5

    const { data, error } = await supabase
      .from('focus_sessions')
      .insert([
        {
          user_id: user.id,
          session_date: new Date().toISOString().split('T')[0],
          duration_minutes: durationMinutes,
          mode,
          work_description: workDescription,
          xp_awarded: xpAwarded,
          completed_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating focus session:', error)
    return null
  }
}

export async function getFocusSessionsForToday(): Promise<FocusSession[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('focus_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('session_date', today)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching focus sessions:', error)
    return []
  }
}

export async function updateFocusSessionQuality(
  sessionId: string,
  qualityRating: number
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('focus_sessions')
      .update({ quality_rating: qualityRating })
      .eq('id', sessionId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error updating focus session quality:', error)
    return false
  }
}
