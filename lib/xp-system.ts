import { supabase } from '@/lib/supabase'

const XP_PER_LEVEL = 100

export interface UserStats {
  level: number
  totalXp: number
  currentLevelXp: number
  xpToNextLevel: number
}

export function calculateStats(totalXp: number): UserStats {
  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1
  const currentLevelXp = totalXp % XP_PER_LEVEL
  const xpToNextLevel = XP_PER_LEVEL - currentLevelXp

  return {
    level,
    totalXp,
    currentLevelXp,
    xpToNextLevel,
  }
}

export async function addXp(userId: string, xpAmount: number): Promise<UserStats | null> {
  try {
    // Get current profile
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('total_xp, level')
      .eq('id', userId)
      .single()

    if (fetchError) throw fetchError

    const newTotalXp = (profile.total_xp || 0) + xpAmount
    const newLevel = Math.floor(newTotalXp / XP_PER_LEVEL) + 1
    const leveledUp = newLevel > profile.level

    // Update profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        total_xp: newTotalXp,
        level: newLevel,
      })
      .eq('id', userId)

    if (updateError) throw updateError

    return calculateStats(newTotalXp)
  } catch (error) {
    console.error('Error adding XP:', error)
    return null
  }
}

export async function getUserXp(userId: string): Promise<UserStats | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('total_xp')
      .eq('id', userId)
      .single()

    if (error) throw error
    return calculateStats(data.total_xp || 0)
  } catch (error) {
    console.error('Error fetching user XP:', error)
    return null
  }
}
