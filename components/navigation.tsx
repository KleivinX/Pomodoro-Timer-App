'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Home, Clock, BookOpen, User, Settings, LogOut, Flame, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Home',        icon: Home },
  { href: '/timer',     label: 'Focus',       icon: Clock },
  { href: '/tasks',     label: 'Tasks',       icon: Star },
  { href: '/cards',     label: 'Study Cards', icon: BookOpen },
  { href: '/profile',   label: 'Profile',     icon: User },
  { href: '/settings',  label: 'Settings',    icon: Settings },
]

// Static guest display values
const GUEST_LEVEL = 1
const GUEST_XP    = 0
const GUEST_XP_MAX = 100
const GUEST_STREAK = 0

export function Navigation() {
  const pathname = usePathname()
  const router   = useRouter()
  const { user, isGuest, signOut } = useAuth()

  const displayName = user?.user_metadata?.full_name
    || user?.email?.split('@')[0]
    || (isGuest ? 'Guest' : 'Student')

  const level  = GUEST_LEVEL
  const xp     = GUEST_XP
  const xpMax  = GUEST_XP_MAX
  const streak = GUEST_STREAK
  const xpPct  = Math.min(100, Math.round((xp / xpMax) * 100))

  const levelTitles: Record<number, string> = {
    1: 'Crumb', 2: 'Crumb', 3: 'Slice', 4: 'Slice', 5: 'Slice',
    6: 'Loaf', 7: 'Loaf', 8: 'Loaf', 9: 'Loaf', 10: 'Loaf',
  }
  const levelTitle = levelTitles[level] ?? 'Baker'

  const handleLogout = async () => {
    await signOut()
    router.push('/signup')
  }

  return (
    <>
      {/* ── DESKTOP SIDEBAR ───────────────────────────────── */}
      <nav className="hidden md:flex w-64 flex-col h-screen sticky top-0 bg-sidebar border-r-2 border-sidebar-border overflow-y-auto">

        {/* Logo */}
        <div className="px-5 pt-6 pb-4 border-b-2 border-sidebar-border">
          <span className="text-2xl font-black text-sidebar-primary tracking-tight">CRUMBO</span>
          <p className="text-xs text-sidebar-foreground/50 mt-0.5 font-medium">Stack your crumbs. Lock in daily.</p>
        </div>

        {/* Player card */}
        <div className="mx-4 mt-4 p-3 rounded-xl bg-sidebar-foreground/5 border-2 border-sidebar-border">
          {/* Avatar + name row */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-sidebar-primary border-2 border-sidebar-border flex items-center justify-center font-black text-sidebar-primary-foreground text-sm flex-shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sidebar-foreground text-sm truncate">{displayName}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs font-bold text-sidebar-primary">Lv.{level}</span>
                <span className="text-xs text-sidebar-foreground/40 font-medium">{levelTitle}</span>
              </div>
            </div>
            {/* Streak chip */}
            {streak > 0 && (
              <div className="ml-auto flex items-center gap-1 bg-destructive text-destructive-foreground rounded-full px-2 py-0.5 text-xs font-bold border border-sidebar-border flex-shrink-0">
                <Flame className="w-3 h-3" />
                {streak}
              </div>
            )}
          </div>
          {/* XP bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-sidebar-foreground/60">
              <span>XP</span>
              <span>{xp} / {xpMax}</span>
            </div>
            <div className="xp-bar-track" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
              <div className="xp-bar-fill" style={{ width: `${xpPct}%`, background: '#F5B041' }} />
            </div>
          </div>
        </div>

        {/* Nav items */}
        <div className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link key={href} href={href}>
                <div className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm cursor-pointer transition-colors',
                  active
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground border-2 border-sidebar-border'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground border-2 border-transparent'
                )}>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </div>
              </Link>
            )
          })}
        </div>

        {/* Logout */}
        <div className="px-3 pb-5 border-t-2 border-sidebar-border pt-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl font-semibold text-sm text-destructive hover:bg-destructive/10 border-2 border-transparent transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {user ? 'Log Out' : 'Exit Guest'}
          </button>
        </div>
      </nav>

      {/* ── MOBILE BOTTOM NAV ─────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-sidebar border-t-2 border-sidebar-border flex items-center justify-around px-2 py-2">
        {navItems.slice(0, 5).map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link key={href} href={href}>
              <div className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors',
                active ? 'text-sidebar-primary' : 'text-sidebar-foreground/50'
              )}>
                <Icon className="w-5 h-5" />
                <span className={cn('text-[10px] font-bold', active ? 'text-sidebar-primary' : 'text-sidebar-foreground/40')}>
                  {label}
                </span>
              </div>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
