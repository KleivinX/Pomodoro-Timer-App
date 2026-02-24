import { supabase } from '@/lib/supabase'

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  requirement: string
}

export const BADGES: Record<string, Badge> = {
  first_lock_in: {
    id: 'first_lock_in',
    name: 'Lock Master',
    description: 'Complete your first lock-in day',
    icon: '🔒',
    color: 'emerald',
    requirement: 'Lock in once',
  },
  seven_streak: {
    id: 'seven_streak',
    name: '7-Day Warrior',
    description: 'Achieve a 7-day lock-in streak',
    icon: '🔥',
    color: 'orange',
    requirement: '7-day streak',
  },
  thirty_streak: {
    id: 'thirty_streak',
    name: 'Unstoppable',
    description: 'Achieve a 30-day lock-in streak',
    icon: '⚡',
    color: 'yellow',
    requirement: '30-day streak',
  },
  hundred_xp: {
    id: 'hundred_xp',
    name: 'XP Collector',
    description: 'Earn 100 XP total',
    icon: '💎',
    color: 'blue',
    requirement: '100 XP earned',
  },
  fifty_tasks: {
    id: 'fifty_tasks',
    name: 'Task Master',
    description: 'Complete 50 tasks',
    icon: '✅',
    color: 'green',
    requirement: '50 tasks completed',
  },
  hundred_sessions: {
    id: 'hundred_sessions',
    name: 'Focus Legend',
    description: 'Complete 100 focus sessions',
    icon: '🎯',
    color: 'purple',
    requirement: '100 sessions',
  },
  perfect_week: {
    id: 'perfect_week',
    name: 'Perfect Week',
    description: 'Lock in every day for a week',
    icon: '⭐',
    color: 'indigo',
    requirement: '7 consecutive days',
  },
  early_bird: {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Complete a focus session before 9 AM',
    icon: '🌅',
    color: 'amber',
    requirement: 'Session before 9 AM',
  },
  night_owl: {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Complete a focus session after 9 PM',
    icon: '🌙',
    color: 'slate',
    requirement: 'Session after 9 PM',
  },
  reflection_master: {
    id: 'reflection_master',
    name: 'Reflective Mind',
    description: 'Complete 10 daily reflections',
    icon: '🧠',
    color: 'cyan',
    requirement: '10 reflections',
  },
  level_five: {
    id: 'level_five',
    name: 'Rising Star',
    description: 'Reach level 5',
    icon: '⬆️',
    color: 'lime',
    requirement: 'Level 5',
  },
  level_ten: {
    id: 'level_ten',
    name: 'Legendary',
    description: 'Reach level 10',
    icon: '👑',
    color: 'rose',
    requirement: 'Level 10',
  },
}

export async function unlockBadge(userId: string, badgeId: string): Promise<boolean> {
  try {
    // Check if already unlocked
    const { data: existing } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .eq('badge_id', badgeId)
      .single()

    if (existing) return false // Already unlocked

    const { error } = await supabase.from('user_badges').insert([
      {
        user_id: userId,
        badge_id: badgeId,
      },
    ])

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error unlocking badge:', error)
    return false
  }
}

export async function getUserBadges(userId: string): Promise<Badge[]> {
  try {
    const { data, error } = await supabase
      .from('user_badges')
      .select('badge_id')
      .eq('user_id', userId)

    if (error) throw error

    return (
      data?.map(item => BADGES[item.badge_id]).filter(Boolean) ||
      []
    )
  } catch (error) {
    console.error('Error fetching user badges:', error)
    return []
  }
}

export async function checkAndUnlockBadges(userId: string, userStats: any): Promise<void> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('level, total_xp, current_streak')
      .eq('id', userId)
      .single()

    if (error) throw error

    // Check level badges
    if (profile.level >= 5) {
      await unlockBadge(userId, 'level_five')
    }
    if (profile.level >= 10) {
      await unlockBadge(userId, 'level_ten')
    }

    // Check streak badges
    if (profile.current_streak === 1) {
      await unlockBadge(userId, 'first_lock_in')
    }
    if (profile.current_streak >= 7) {
      await unlockBadge(userId, 'seven_streak')
    }
    if (profile.current_streak >= 30) {
      await unlockBadge(userId, 'thirty_streak')
    }

    // Check XP badges
    if (profile.total_xp >= 100) {
      await unlockBadge(userId, 'hundred_xp')
    }
  } catch (error) {
    console.error('Error checking badges:', error)
  }
}
