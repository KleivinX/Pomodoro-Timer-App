import { supabase } from '@/lib/supabase'

export type LockInLevel = 'none' | 'partial' | 'locked'
export type LockInRule = 'focus_task' | 'double_focus' | 'focus_reflection'

export interface LockInScore {
  date: string
  focusSessions: number
  tasksCompleted: number
  reflectionDone: boolean
  lockInLevel: LockInLevel
  xpEarned: number
}

interface LockInRuleRequirements {
  rule: LockInRule
  minFocusSessions: number
  minTasksCompleted: number
  reflectionRequired: boolean
}

const LOCK_IN_RULES: Record<LockInRule, LockInRuleRequirements> = {
  focus_task: {
    rule: 'focus_task',
    minFocusSessions: 1,
    minTasksCompleted: 1,
    reflectionRequired: false,
  },
  double_focus: {
    rule: 'double_focus',
    minFocusSessions: 2,
    minTasksCompleted: 2,
    reflectionRequired: false,
  },
  focus_reflection: {
    rule: 'focus_reflection',
    minFocusSessions: 1,
    minTasksCompleted: 1,
    reflectionRequired: true,
  },
}

export async function calculateLockInLevel(
  userId: string,
  date: string,
  rule: LockInRule
): Promise<LockInLevel> {
  try {
    const requirements = LOCK_IN_RULES[rule]

    // Get daily activity
    const { data: activity, error: activityError } = await supabase
      .from('daily_activities')
      .select('*')
      .eq('user_id', userId)
      .eq('activity_date', date)
      .single()

    if (activityError && activityError.code !== 'PGRST116') throw activityError

    if (!activity) return 'none'

    const meetsMinimum =
      activity.focus_sessions_count >= requirements.minFocusSessions &&
      activity.tasks_completed >= requirements.minTasksCompleted

    if (!meetsMinimum) return 'none'

    if (requirements.reflectionRequired && !activity.reflection_done) {
      return 'partial'
    }

    return 'locked'
  } catch (error) {
    console.error('Error calculating lock-in level:', error)
    return 'none'
  }
}

export async function updateLockInStatus(
  userId: string,
  date: string,
  rule: LockInRule
): Promise<boolean> {
  try {
    const lockInLevel = await calculateLockInLevel(userId, date, rule)

    // Calculate XP based on lock-in level
    let xpEarned = 0
    if (lockInLevel === 'locked') {
      xpEarned = 50
    } else if (lockInLevel === 'partial') {
      xpEarned = 25
    }

    // Update daily activity
    const { error } = await supabase
      .from('daily_activities')
      .update({
        lock_in_level: lockInLevel,
        xp_earned: xpEarned,
      })
      .eq('user_id', userId)
      .eq('activity_date', date)

    if (error) throw error

    // Update profile streak
    await updateStreak(userId, date, lockInLevel)

    return true
  } catch (error) {
    console.error('Error updating lock-in status:', error)
    return false
  }
}

export async function updateStreak(
  userId: string,
  date: string,
  lockInLevel: LockInLevel
): Promise<void> {
  try {
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('current_streak, longest_streak, last_locked_date')
      .eq('id', userId)
      .single()

    if (fetchError) throw fetchError

    let newStreak = profile.current_streak || 0
    let newLongestStreak = profile.longest_streak || 0

    if (lockInLevel === 'locked') {
      const lastDate = profile.last_locked_date ? new Date(profile.last_locked_date) : null
      const today = new Date(date)

      if (!lastDate) {
        // First lock-in day
        newStreak = 1
      } else {
        const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
        if (daysDiff === 1) {
          // Consecutive day
          newStreak = (profile.current_streak || 0) + 1
        } else if (daysDiff === 0) {
          // Same day, no change
          newStreak = profile.current_streak || 1
        } else {
          // Streak broken, restart
          newStreak = 1
        }
      }

      // Update longest streak if current is higher
      newLongestStreak = Math.max(newStreak, profile.longest_streak || 0)

      // Update profile
      await supabase
        .from('profiles')
        .update({
          current_streak: newStreak,
          longest_streak: newLongestStreak,
          last_locked_date: date,
        })
        .eq('id', userId)
    } else if (lockInLevel === 'none') {
      // Reset streak if didn't lock in
      const lastDate = profile.last_locked_date ? new Date(profile.last_locked_date) : null
      const today = new Date(date)

      if (lastDate) {
        const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
        if (daysDiff > 0) {
          // Streak is broken
          await supabase
            .from('profiles')
            .update({ current_streak: 0 })
            .eq('id', userId)
        }
      }
    }
  } catch (error) {
    console.error('Error updating streak:', error)
  }
}

export async function getLockInHistory(
  userId: string,
  days: number = 30
): Promise<LockInScore[]> {
  try {
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000)

    const { data, error } = await supabase
      .from('daily_activities')
      .select('*')
      .eq('user_id', userId)
      .gte('activity_date', startDate.toISOString().split('T')[0])
      .lte('activity_date', endDate.toISOString().split('T')[0])
      .order('activity_date', { ascending: false })

    if (error) throw error

    return (
      data?.map(activity => ({
        date: activity.activity_date,
        focusSessions: activity.focus_sessions_count,
        tasksCompleted: activity.tasks_completed,
        reflectionDone: activity.reflection_done,
        lockInLevel: activity.lock_in_level,
        xpEarned: activity.xp_earned,
      })) || []
    )
  } catch (error) {
    console.error('Error fetching lock-in history:', error)
    return []
  }
}

export function getLockInStreak(userId: string): Promise<{ current: number; longest: number }> {
  return supabase
    .from('profiles')
    .select('current_streak, longest_streak')
    .eq('id', userId)
    .single()
    .then(({ data, error }) => {
      if (error) throw error
      return {
        current: data.current_streak || 0,
        longest: data.longest_streak || 0,
      }
    })
    .catch(error => {
      console.error('Error fetching streak:', error)
      return { current: 0, longest: 0 }
    })
}
