'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'

export default function CardsPage() {
  const { user } = useAuth()
  const [cards, setCards] = useState<Array<{ id: string; question: string; answer: string }>>([])
  const [mode, setMode] = useState<'list' | 'create'>('list')
  const [newQuestion, setNewQuestion] = useState('')
  const [newAnswer, setNewAnswer] = useState('')

  const handleCreateCard = () => {
    if (newQuestion.trim() && newAnswer.trim()) {
      setCards([...cards, { id: Date.now().toString(), question: newQuestion, answer: newAnswer }])
      setNewQuestion('')
      setNewAnswer('')
      setMode('list')
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Study Cards</h1>
        <p className="text-muted-foreground mt-2">
          Create and review flashcards with spaced repetition
        </p>
      </div>

      {mode === 'list' ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Cards</CardTitle>
              <CardDescription>{cards.length} cards total</CardDescription>
            </div>
            <Button onClick={() => setMode('create')}>
              <Plus className="w-4 h-4 mr-2" />
              New Card
            </Button>
          </CardHeader>
          <CardContent>
            {cards.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No cards yet. Create one to get started!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {cards.map(card => (
                  <div key={card.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <p className="font-semibold text-foreground">{card.question}</p>
                    <p className="text-sm text-muted-foreground mt-2">{card.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Create New Card</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Question</label>
              <Input
                placeholder="Enter your question..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Answer</label>
              <Input
                placeholder="Enter your answer..."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateCard}>Create Card</Button>
              <Button variant="outline" onClick={() => setMode('list')}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
