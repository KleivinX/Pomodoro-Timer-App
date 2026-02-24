import { supabase } from '@/lib/supabase'

export interface DailyReflection {
  id: string
  user_id: string
  reflection_date: string
  one_win: string
  one_improvement: string
  tomorrow_focus: string
  xp_awarded: number
  created_at: string
}

export interface WeeklyReview {
  id: string
  user_id: string
  week_start_date: string
  what_worked: string
  what_blocked: string
  next_week_rule: string
  total_focus_hours: number
  lockin_days: number
  xp_awarded: number
  created_at: string
}

export async function createDailyReflection(
  oneWin: string,
  oneImprovement: string,
  tomorrowFocus: string
): Promise<DailyReflection | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('daily_reflections')
      .insert([
        {
          user_id: user.id,
          reflection_date: today,
          one_win: oneWin,
          one_improvement: oneImprovement,
          tomorrow_focus: tomorrowFocus,
          xp_awarded: 5,
        },
      ])
      .select()
      .single()

    if (error) throw error

    // Update daily activity to mark reflection as done
    await supabase
      .from('daily_activities')
      .update({ reflection_done: true })
      .eq('user_id', user.id)
      .eq('activity_date', today)

    return data
  } catch (error) {
    console.error('Error creating daily reflection:', error)
    return null
  }
}

export async function getDailyReflection(date: string): Promise<DailyReflection | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('daily_reflections')
      .select('*')
      .eq('user_id', user.id)
      .eq('reflection_date', date)
      .single()

    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching daily reflection:', error)
    return null
  }
}

export async function createWeeklyReview(
  weekStartDate: string,
  whatWorked: string,
  whatBlocked: string,
  nextWeekRule: string,
  totalFocusHours: number,
  lockinDays: number
): Promise<WeeklyReview | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('weekly_reviews')
      .insert([
        {
          user_id: user.id,
          week_start_date: weekStartDate,
          what_worked: whatWorked,
          what_blocked: whatBlocked,
          next_week_rule: nextWeekRule,
          total_focus_hours: totalFocusHours,
          lockin_days: lockinDays,
          xp_awarded: 25,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating weekly review:', error)
    return null
  }
}

export async function getWeeklyReview(weekStartDate: string): Promise<WeeklyReview | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('weekly_reviews')
      .select('*')
      .eq('user_id', user.id)
      .eq('week_start_date', weekStartDate)
      .single()

    if (error?.code === 'PGRST116') return null
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching weekly review:', error)
    return null
  }
}

export async function getReflectionHistory(days: number = 30): Promise<DailyReflection[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000)

    const { data, error } = await supabase
      .from('daily_reflections')
      .select('*')
      .eq('user_id', user.id)
      .gte('reflection_date', startDate.toISOString().split('T')[0])
      .lte('reflection_date', endDate.toISOString().split('T')[0])
      .order('reflection_date', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching reflection history:', error)
    return []
  }
}
