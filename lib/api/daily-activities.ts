import { supabase } from '@/lib/supabase'

export interface DailyActivity {
  id: string
  user_id: string
  activity_date: string
  focus_sessions_count: number
  tasks_completed: number
  reflection_done: boolean
  lock_in_level: 'none' | 'partial' | 'locked'
  xp_earned: number
  created_at: string
  updated_at: string
}

export async function getOrCreateDailyActivity(date: string): Promise<DailyActivity | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Try to fetch existing activity
    const { data: existing, error: fetchError } = await supabase
      .from('daily_activities')
      .select('*')
      .eq('user_id', user.id)
      .eq('activity_date', date)
      .single()

    if (existing) return existing

    // If not found, create new one
    if (fetchError?.code === 'PGRST116') {
      const { data, error: insertError } = await supabase
        .from('daily_activities')
        .insert([
          {
            user_id: user.id,
            activity_date: date,
            focus_sessions_count: 0,
            tasks_completed: 0,
            reflection_done: false,
            lock_in_level: 'none',
            xp_earned: 0,
          },
        ])
        .select()
        .single()

      if (insertError) throw insertError
      return data
    }

    if (fetchError) throw fetchError
    return null
  } catch (error) {
    console.error('Error getting or creating daily activity:', error)
    return null
  }
}

export async function updateDailyActivity(
  date: string,
  updates: Partial<Omit<DailyActivity, 'id' | 'user_id' | 'created_at'>>
): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('daily_activities')
      .update(updates)
      .eq('user_id', user.id)
      .eq('activity_date', date)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error updating daily activity:', error)
    return false
  }
}

export async function getDailyActivitiesForRange(startDate: string, endDate: string): Promise<DailyActivity[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('daily_activities')
      .select('*')
      .eq('user_id', user.id)
      .gte('activity_date', startDate)
      .lte('activity_date', endDate)
      .order('activity_date', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching daily activities:', error)
    return []
  }
}
