import { supabase } from '@/lib/supabase'
import { calculateNextReview, getNextReviewDate } from '@/lib/spaced-repetition'

export interface StudyCard {
  id: string
  user_id: string
  question: string
  answer: string
  created_at: string
  next_review_date: string
  interval: number
  easiness_factor: number
  review_count: number
}

export async function createStudyCard(question: string, answer: string): Promise<StudyCard | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('study_cards')
      .insert([
        {
          user_id: user.id,
          question,
          answer,
          next_review_date: new Date().toISOString().split('T')[0],
          interval: 1,
          easiness_factor: 2.5,
          review_count: 0,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating study card:', error)
    return null
  }
}

export async function getStudyCards(): Promise<StudyCard[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('study_cards')
      .select('*')
      .eq('user_id', user.id)
      .order('next_review_date', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching study cards:', error)
    return []
  }
}

export async function getCardsForReview(): Promise<StudyCard[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('study_cards')
      .select('*')
      .eq('user_id', user.id)
      .lte('next_review_date', today)
      .order('next_review_date', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching cards for review:', error)
    return []
  }
}

export async function reviewCard(cardId: string, quality: number): Promise<boolean> {
  try {
    // Get current card data
    const { data: card, error: fetchError } = await supabase
      .from('study_cards')
      .select('interval, easiness_factor, review_count')
      .eq('id', cardId)
      .single()

    if (fetchError) throw fetchError

    // Calculate next review using SM-2
    const newData = calculateNextReview(
      {
        interval: card.interval,
        easinessFactor: card.easiness_factor,
        reviewCount: card.review_count,
      },
      quality
    )

    const nextReviewDate = getNextReviewDate(newData.interval)

    // Update card
    const { error: updateError } = await supabase
      .from('study_cards')
      .update({
        interval: newData.interval,
        easiness_factor: newData.easinessFactor,
        review_count: newData.reviewCount,
        next_review_date: nextReviewDate.toISOString().split('T')[0],
      })
      .eq('id', cardId)

    if (updateError) throw updateError

    // Log review
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('card_reviews').insert([
        {
          user_id: user.id,
          card_id: cardId,
          review_date: new Date().toISOString().split('T')[0],
          quality,
          xp_awarded: 10,
        },
      ])
    }

    return true
  } catch (error) {
    console.error('Error reviewing card:', error)
    return false
  }
}

export async function deleteStudyCard(cardId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('study_cards').delete().eq('id', cardId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting study card:', error)
    return false
  }
}
