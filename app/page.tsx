'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function Home() {
  const router = useRouter()
  const { user, loading, isGuest } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (user || isGuest) {
        router.push('/dashboard')
      } else {
        router.push('/signup')
      }
    }
  }, [user, loading, isGuest, router])

  return null
}
