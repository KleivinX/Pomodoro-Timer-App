'use client'

import { useState, useEffect } from 'react'
import { getCardsForReview, reviewCard, type StudyCard } from '@/lib/api/study-cards'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'

export function CardReviewer() {
  const [cards, setCards] = useState<StudyCard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showAnswer, setShowAnswer] = useState(false)
  const [reviewing, setReviewing] = useState(false)

  useEffect(() => {
    async function loadCards() {
      const cardsForReview = await getCardsForReview()
      setCards(cardsForReview)
      setLoading(false)
    }

    loadCards()
  }, [])

  const currentCard = cards[currentIndex]

  const handleReview = async (quality: number) => {
    if (!currentCard) return
    setReviewing(true)

    const success = await reviewCard(currentCard.id, quality)
    if (success) {
      toast.success(`Card reviewed! +10 XP`)
      
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setShowAnswer(false)
      } else {
        toast.success('All cards reviewed for today!')
        setCards([])
      }
    } else {
      toast.error('Failed to save review')
    }

    setReviewing(false)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Loading cards...
        </CardContent>
      </Card>
    )
  }

  if (cards.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Study Cards</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          No cards to review today! Great job staying on top of your studying.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Card Review</CardTitle>
          <CardDescription>
            {currentIndex + 1} / {cards.length} - How well did you know this card?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question */}
          <div className="bg-muted rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-2">Question</p>
            <p className="text-lg font-semibold">{currentCard.question}</p>
          </div>

          {/* Answer */}
          {showAnswer ? (
            <div className="bg-primary/10 rounded-lg p-6 border-2 border-primary">
              <p className="text-sm text-muted-foreground mb-2">Answer</p>
              <p className="text-lg">{currentCard.answer}</p>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowAnswer(true)}
              disabled={reviewing}
            >
              Reveal Answer
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}

          {/* Quality Rating */}
          {showAnswer && (
            <div className="grid grid-cols-5 gap-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleReview(0)}
                disabled={reviewing}
                title="Blackout - Total fail"
              >
                0
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleReview(1)}
                disabled={reviewing}
                title="Incorrect with major difficulty"
              >
                1
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleReview(2)}
                disabled={reviewing}
                title="Correct with difficulty"
              >
                2
              </Button>
              <Button
                size="sm"
                onClick={() => handleReview(4)}
                disabled={reviewing}
                title="Correct quickly"
              >
                4
              </Button>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => handleReview(5)}
                disabled={reviewing}
                title="Perfect"
              >
                5
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
