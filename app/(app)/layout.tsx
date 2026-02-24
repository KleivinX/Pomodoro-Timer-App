'use client'

import { useAuth } from '@/lib/auth-context'
import { Navigation } from '@/components/navigation'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="game-card p-8 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary border-2 border-border flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="font-black text-foreground">Loading CRUMBO...</p>
          <p className="text-sm text-muted-foreground font-semibold">Stack your crumbs. Lock in daily.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      {/* pb-20 on mobile to clear bottom nav */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        {children}
      </main>
    </div>
  )
}
