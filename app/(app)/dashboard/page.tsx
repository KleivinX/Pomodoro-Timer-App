'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Flame, Zap, Clock, CheckSquare, Trophy, ArrowRight, Star, Target } from 'lucide-react'
import { LockInCalendarView } from '@/components/lock-in-calendar-view'

// Static data for guest/unconnected state
const STATS = {
  level: 1, xp: 0, xpMax: 100, streak: 0,
  sessions: 0, tasks: 0, badges: 0,
}

const LEVEL_TITLES: Record<number, string> = {
  1: 'Crumb', 2: 'Crumb', 3: 'Slice', 4: 'Slice', 5: 'Slice',
  6: 'Loaf',  7: 'Loaf',  8: 'Loaf',  9: 'Loaf', 10: 'Loaf',
}

function StatCard({
  label, value, sub, color, icon: Icon,
}: {
  label: string; value: string | number; sub: string
  color: string; icon: React.ElementType
}) {
  return (
    <div className={`game-card p-4 flex flex-col gap-2`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>
      <p className="text-3xl font-black text-foreground leading-none">{value}</p>
      <p className="text-xs font-semibold text-muted-foreground">{sub}</p>
    </div>
  )
}

function QuickActionBtn({
  href, label, desc, color,
}: {
  href: string; label: string; desc: string; color: string
}) {
  return (
    <Link href={href}>
      <div className={`game-btn ${color} px-4 py-3 flex items-center justify-between cursor-pointer`}>
        <div>
          <p className="font-bold text-sm">{label}</p>
          <p className="text-xs opacity-80 font-medium">{desc}</p>
        </div>
        <ArrowRight className="w-4 h-4 flex-shrink-0" />
      </div>
    </Link>
  )
}

export default function DashboardPage() {
  const { user, isGuest } = useAuth()
  const name = user?.user_metadata?.full_name
    || user?.email?.split('@')[0]
    || (isGuest ? 'Guest' : 'Student')

  const xpPct = Math.min(100, Math.round((STATS.xp / STATS.xpMax) * 100))
  const levelTitle = LEVEL_TITLES[STATS.level] ?? 'Baker'

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* ── HEADER ─────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-foreground leading-tight">
              Hey, {name}!
            </h1>
            <p className="text-muted-foreground font-semibold mt-1 text-sm">
              Stack your crumbs. Lock in today.
            </p>
          </div>
          {/* Level badge */}
          <div className="game-card px-4 py-2 flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary border-2 border-border flex items-center justify-center font-black text-primary-foreground text-xs">
              {STATS.level}
            </div>
            <div>
              <p className="font-bold text-xs leading-none">{levelTitle}</p>
              <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">Level {STATS.level}</p>
            </div>
          </div>
        </div>

        {/* ── TODAY'S GOAL BANNER ─────────────────────────── */}
        <div className="game-card bg-primary p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-foreground/10 border-2 border-border flex items-center justify-center">
              <Target className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-black text-primary-foreground text-sm">Today's Goal</p>
              <p className="text-primary-foreground/80 text-xs font-semibold mt-0.5">
                Complete 1 focus session + 1 task to Lock In
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-primary-foreground bg-foreground/15 rounded-full px-3 py-1 border border-foreground/20 flex-shrink-0">
            0 / 2
          </span>
        </div>

        {/* ── XP BAR ──────────────────────────────────────── */}
        <div className="game-card p-4 space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              <span className="font-black text-sm">Level {STATS.level} — {levelTitle}</span>
            </div>
            <span className="text-xs font-bold text-muted-foreground">{STATS.xp} / {STATS.xpMax} XP</span>
          </div>
          <div className="xp-bar-track">
            <div className="xp-bar-fill" style={{ width: `${xpPct}%` }} />
          </div>
          <p className="text-xs text-muted-foreground font-semibold">{STATS.xpMax - STATS.xp} XP to next level</p>
        </div>

        {/* ── STAT CARDS ──────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Streak" value={STATS.streak === 0 ? '—' : `${STATS.streak}d`}
            sub="days locked in" color="bg-destructive text-destructive-foreground" icon={Flame} />
          <StatCard label="Sessions" value={STATS.sessions}
            sub="this week" color="bg-primary text-primary-foreground" icon={Clock} />
          <StatCard label="Tasks" value={STATS.tasks}
            sub="completed" color="bg-accent text-accent-foreground" icon={CheckSquare} />
          <StatCard label="Badges" value={STATS.badges}
            sub="unlocked" color="bg-secondary text-secondary-foreground" icon={Trophy} />
        </div>

        {/* ── CALENDAR + QUICK ACTIONS ────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Lock-In Calendar */}
          <div className="lg:col-span-2">
            <LockInCalendarView />
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h2 className="font-black text-base text-foreground">Quick Actions</h2>
            <QuickActionBtn
              href="/timer"
              label="Start Focusing"
              desc="+10 XP per session"
              color="bg-primary text-primary-foreground"
            />
            <QuickActionBtn
              href="/tasks"
              label="Add a Task"
              desc="+5 XP per task done"
              color="bg-accent text-accent-foreground"
            />
            <QuickActionBtn
              href="/cards"
              label="Review Cards"
              desc="+10 XP per review"
              color="bg-secondary text-secondary-foreground"
            />
            <QuickActionBtn
              href="/profile"
              label="View Badges"
              desc={`${STATS.badges} unlocked`}
              color="bg-muted text-foreground"
            />
          </div>
        </div>

      </div>
    </div>
  )
}
