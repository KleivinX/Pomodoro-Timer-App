// SM-2 Algorithm (SuperMemo 2)

export interface CardData {
  interval: number
  easinessFactor: number
  reviewCount: number
}

export interface ReviewResult {
  quality: number // 0-5: 0=total blackout, 1=incorrect, 2=correct with difficulty, 3=correct after hesitation, 4=correct quickly, 5=perfect
}

export function calculateNextReview(data: CardData, quality: number): CardData {
  let newInterval: number
  let newEasiness = data.easinessFactor

  // EF' := EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  newEasiness = Math.max(
    1.3,
    data.easinessFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
  )

  if (quality < 3) {
    newInterval = 1
  } else if (data.reviewCount === 0) {
    newInterval = 1
  } else if (data.reviewCount === 1) {
    newInterval = 3
  } else {
    newInterval = Math.round(data.interval * newEasiness)
  }

  return {
    interval: newInterval,
    easinessFactor: newEasiness,
    reviewCount: data.reviewCount + 1,
  }
}

export function getNextReviewDate(days: number): Date {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}

export function isCardDueForReview(nextReviewDate: string): boolean {
  const reviewDate = new Date(nextReviewDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  reviewDate.setHours(0, 0, 0, 0)
  return reviewDate <= today
}

export interface CardStats {
  total: number
  dueTodayCount: number
  masteredCount: number
  learningCount: number
}

export function calculateCardStats(cards: any[]): CardStats {
  const today = new Date().toISOString().split('T')[0]
  
  return {
    total: cards.length,
    dueTodayCount: cards.filter(card => isCardDueForReview(card.next_review_date)).length,
    masteredCount: cards.filter(card => card.easiness_factor >= 2.5).length,
    learningCount: cards.filter(card => card.easiness_factor < 2.5).length,
  }
}
