'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Home, Zap, Book, Settings, LogOut, Clock, User } from 'lucide-react'
import Link from 'next/link'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/timer', label: 'Timer', icon: Clock },
  { href: '/tasks', label: 'Tasks', icon: Zap },
  { href: '/cards', label: 'Study Cards', icon: Book },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <nav className="w-64 bg-card border-r border-border flex flex-col p-4 gap-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">CRUMBO</h1>
        <p className="text-xs text-muted-foreground">Student Productivity</p>
      </div>

      <div className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'default' : 'ghost'}
                className="w-full justify-start gap-3"
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </div>

      <Button
        variant="ghost"
        className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={handleLogout}
      >
        <LogOut className="w-5 h-5" />
        Log Out
      </Button>
    </nav>
  )
}
