'use client'

import { useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Trophy } from 'lucide-react'
import type { Badge } from '@/lib/badges'

interface BadgeUnlockModalProps {
  isOpen: boolean
  badge: Badge | null
  onClose: () => void
}

export function BadgeUnlockModal({ isOpen, badge, onClose }: BadgeUnlockModalProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 3500)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen || !badge) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <Card className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 border-2 border-purple-400 p-8 text-center badge-unlock">
        <div className="flex justify-center mb-4">
          <div className="text-6xl animate-bounce">{badge.icon}</div>
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Achievement Unlocked!</h2>
        <p className="text-xl font-semibold text-purple-400 mb-2">{badge.name}</p>
        <p className="text-sm text-muted-foreground">{badge.description}</p>
      </Card>

      <style jsx>{`
        .badge-unlock {
          animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
          0% {
            transform: translateY(100px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
