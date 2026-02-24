'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Sparkles, Zap } from 'lucide-react'

interface LevelUpModalProps {
  isOpen: boolean
  newLevel: number
  onClose: () => void
}

export function LevelUpModal({ isOpen, newLevel, onClose }: LevelUpModalProps) {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number }>>([])

  useEffect(() => {
    if (isOpen) {
      // Generate particles
      const newParticles = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
      }))
      setParticles(newParticles)

      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className="relative">
        {/* Animated particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
            style={{
              left: `${particle.left}%`,
              bottom: 0,
              animation: `confetti 2s ease-out forwards`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}

        {/* Main card */}
        <Card className="bg-gradient-to-br from-yellow-400/20 to-orange-400/20 border-2 border-yellow-400 p-8 text-center scale-up">
          <div className="flex justify-center mb-4">
            <Zap className="w-16 h-16 text-yellow-400 animate-bounce" />
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-2">Level Up!</h2>
          <p className="text-2xl font-bold text-yellow-400">Level {newLevel}</p>
          <div className="flex justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4" />
            Keep up the great work!
            <Sparkles className="w-4 h-4" />
          </div>
        </Card>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .scale-up {
          animation: scaleUp 0.5s ease-out;
        }

        @keyframes scaleUp {
          0% {
            transform: scale(0);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}
