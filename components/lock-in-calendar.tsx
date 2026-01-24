"use client"

import React from "react"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Calendar, Flame, TrendingUp, Award, Target } from "lucide-react"
import { cn } from "@/lib/utils"

export type LockInLevel = "none" | "partial" | "locked" | "deep"

export interface DayActivity {
  date: string // YYYY-MM-DD
  focusSessions: number
  tasksCompleted: number
  reflectionCompleted: boolean
  level: LockInLevel
  isGraceDay?: boolean
}

interface LockInCalendarProps {
  activities?: DayActivity[]
}

export function LockInCalendar({ activities = [] }: LockInCalendarProps) {
  const [view, setView] = useState<"year" | "month" | "90days">("year")
  const [hoveredDay, setHoveredDay] = useState<DayActivity | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  // Calculate date range based on view
  const dateRange = useMemo(() => {
    const today = new Date()
    const endDate = new Date(today)
    let startDate: Date

    switch (view) {
      case "month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1)
        break
      case "90days":
        startDate = new Date(today)
        startDate.setDate(startDate.getDate() - 90)
        break
      case "year":
      default:
        startDate = new Date(today)
        startDate.setDate(startDate.getDate() - 364) // 52 weeks
        break
    }

    return { startDate, endDate }
  }, [view])

  // Generate all days in the range
  const allDays = useMemo(() => {
    const days: DayActivity[] = []
    const currentDate = new Date(dateRange.startDate)

    while (currentDate <= dateRange.endDate) {
      const dateStr = currentDate.toISOString().split("T")[0]
      const existingActivity = activities.find((a) => a.date === dateStr)

      days.push(
        existingActivity || {
          date: dateStr,
          focusSessions: 0,
          tasksCompleted: 0,
          reflectionCompleted: false,
          level: "none",
        },
      )

      currentDate.setDate(currentDate.getDate() + 1)
    }

    return days
  }, [dateRange, activities])

  // Group days into weeks
  const weeks = useMemo(() => {
    const result: DayActivity[][] = []
    let week: DayActivity[] = []

    // Start from the first day and pad beginning if needed
    const firstDayOfWeek = allDays[0] ? new Date(allDays[0].date).getDay() : 0
    const paddingDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1 // Monday is 0

    // Add padding
    for (let i = 0; i < paddingDays; i++) {
      week.push({ date: "", focusSessions: 0, tasksCompleted: 0, reflectionCompleted: false, level: "none" })
    }

    allDays.forEach((day) => {
      week.push(day)
      if (week.length === 7) {
        result.push(week)
        week = []
      }
    })

    // Pad the last week if needed
    if (week.length > 0) {
      while (week.length < 7) {
        week.push({ date: "", focusSessions: 0, tasksCompleted: 0, reflectionCompleted: false, level: "none" })
      }
      result.push(week)
    }

    return result
  }, [allDays])

  // Calculate statistics
  const stats = useMemo(() => {
    const lockedDays = activities.filter((a) => a.level === "locked" || a.level === "deep")
    const deepDays = activities.filter((a) => a.level === "deep")

    // Calculate current streak
    let currentStreak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - i)
      const dateStr = checkDate.toISOString().split("T")[0]
      const activity = activities.find((a) => a.date === dateStr)

      if (activity && (activity.level === "locked" || activity.level === "deep")) {
        currentStreak++
      } else if (!activity?.isGraceDay) {
        break
      }
    }

    // Calculate longest streak
    let longestStreak = 0
    let tempStreak = 0
    const sortedActivities = [...activities].sort((a, b) => a.date.localeCompare(b.date))

    sortedActivities.forEach((activity, index) => {
      if (activity.level === "locked" || activity.level === "deep") {
        tempStreak++
        longestStreak = Math.max(longestStreak, tempStreak)
      } else if (!activity.isGraceDay) {
        tempStreak = 0
      }
    })

    // Calculate average per week
    const weeks = Math.ceil(activities.length / 7)
    const avgPerWeek = weeks > 0 ? (lockedDays.length / weeks).toFixed(1) : "0"

    // Find best week
    let bestWeek = 0
    for (let i = 0; i < weeks; i++) {
      const weekStart = i * 7
      const weekActivities = activities.slice(weekStart, weekStart + 7)
      const weekLockedDays = weekActivities.filter((a) => a.level === "locked" || a.level === "deep").length
      bestWeek = Math.max(bestWeek, weekLockedDays)
    }

    return {
      totalLocked: lockedDays.length,
      totalDeep: deepDays.length,
      currentStreak,
      longestStreak,
      avgPerWeek,
      bestWeek,
    }
  }, [activities])

  const getLevelColor = (level: LockInLevel, isGraceDay?: boolean) => {
    if (isGraceDay) {
      return "bg-yellow-200 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700"
    }

    switch (level) {
      case "partial":
        return "bg-primary/20 hover:bg-primary/30"
      case "locked":
        return "bg-primary/60 hover:bg-primary/70"
      case "deep":
        return "bg-primary hover:bg-primary/90"
      case "none":
      default:
        return "bg-muted/30 hover:bg-muted/50"
    }
  }

  const handleMouseEnter = (day: DayActivity, event: React.MouseEvent<HTMLDivElement>) => {
    if (day.date) {
      setHoveredDay(day)
      const rect = event.currentTarget.getBoundingClientRect()
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      })
    }
  }

  const handleMouseLeave = () => {
    setHoveredDay(null)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const getLevelText = (level: LockInLevel) => {
    switch (level) {
      case "partial":
        return "Partial Lock-In"
      case "locked":
        return "Locked In"
      case "deep":
        return "Deep Lock-In"
      default:
        return "No Activity"
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8 text-primary" />
          <div>
            <h2 className="text-3xl font-bold">Lock-In Calendar</h2>
            <p className="text-muted-foreground">Track your consistency and build discipline</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setView("month")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              view === "month" ? "bg-primary text-primary-foreground" : "bg-muted/50 hover:bg-muted",
            )}
          >
            Month
          </button>
          <button
            onClick={() => setView("90days")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              view === "90days" ? "bg-primary text-primary-foreground" : "bg-muted/50 hover:bg-muted",
            )}
          >
            90 Days
          </button>
          <button
            onClick={() => setView("year")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              view === "year" ? "bg-primary text-primary-foreground" : "bg-muted/50 hover:bg-muted",
            )}
          >
            Year
          </button>
        </div>
      </div>

      {/* Heatmap */}
      <Card className="glass-smooth rounded-3xl p-8 shadow-lg border backdrop-blur-xl">
        <div className="space-y-6">
          {/* Day labels */}
          <div className="flex gap-2">
            <div className="w-12" /> {/* Spacer for day names */}
            <div className="flex-1 grid gap-1" style={{ gridTemplateColumns: `repeat(${weeks.length}, 1fr)` }}>
              {weeks.map((_, weekIndex) => (
                <div key={weekIndex} className="text-xs text-muted-foreground text-center">
                  {weekIndex % 4 === 0 && (
                    <span>
                      {new Date(
                        weeks[weekIndex][0]?.date || new Date().toISOString().split("T")[0],
                      ).toLocaleDateString("en-US", { month: "short" })}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Calendar grid */}
          <div className="flex gap-2">
            {/* Day of week labels */}
            <div className="flex flex-col justify-around text-xs text-muted-foreground w-12">
              <div>Mon</div>
              <div>Wed</div>
              <div>Fri</div>
            </div>

            {/* Grid */}
            <div className="flex-1 grid gap-1" style={{ gridTemplateColumns: `repeat(${weeks.length}, 1fr)` }}>
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={cn(
                        "aspect-square rounded-sm border transition-all duration-200 cursor-pointer",
                        day.date ? getLevelColor(day.level, day.isGraceDay) : "bg-transparent border-transparent",
                      )}
                      onMouseEnter={(e) => handleMouseEnter(day, e)}
                      onMouseLeave={handleMouseLeave}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-4 h-4 rounded-sm bg-muted/30" />
                <div className="w-4 h-4 rounded-sm bg-primary/20" />
                <div className="w-4 h-4 rounded-sm bg-primary/60" />
                <div className="w-4 h-4 rounded-sm bg-primary" />
              </div>
              <span>More</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-yellow-200 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700" />
                <span>Grace Day</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="glass-smooth rounded-2xl p-6 border backdrop-blur-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Locked-In Days</p>
              <p className="text-3xl font-bold">{stats.totalLocked}</p>
              <p className="text-xs text-muted-foreground mt-1">{stats.totalDeep} deep lock-ins</p>
            </div>
            <Target className="w-8 h-8 text-primary/60" />
          </div>
        </Card>

        <Card className="glass-smooth rounded-2xl p-6 border backdrop-blur-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
              <p className="text-3xl font-bold flex items-center gap-2">
                {stats.currentStreak}
                <Flame className="w-6 h-6 text-orange-500" />
              </p>
              <p className="text-xs text-muted-foreground mt-1">Keep it going!</p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary/60" />
          </div>
        </Card>

        <Card className="glass-smooth rounded-2xl p-6 border backdrop-blur-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Longest Streak</p>
              <p className="text-3xl font-bold">{stats.longestStreak}</p>
              <p className="text-xs text-muted-foreground mt-1">Personal best</p>
            </div>
            <Award className="w-8 h-8 text-primary/60" />
          </div>
        </Card>

        <Card className="glass-smooth rounded-2xl p-6 border backdrop-blur-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Avg Days Per Week</p>
              <p className="text-3xl font-bold">{stats.avgPerWeek}</p>
              <p className="text-xs text-muted-foreground mt-1">Consistency score</p>
            </div>
            <Calendar className="w-8 h-8 text-primary/60" />
          </div>
        </Card>

        <Card className="glass-smooth rounded-2xl p-6 border backdrop-blur-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Best Week</p>
              <p className="text-3xl font-bold">{stats.bestWeek} days</p>
              <p className="text-xs text-muted-foreground mt-1">Most productive week</p>
            </div>
            <Award className="w-8 h-8 text-primary/60" />
          </div>
        </Card>

        <Card className="glass-smooth rounded-2xl p-6 border backdrop-blur-xl bg-gradient-to-br from-primary/10 to-primary/5">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Consistency Engine</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span className="font-semibold">{Math.round((stats.totalLocked / 365) * 100)}%</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2 transition-all duration-500"
                  style={{ width: `${Math.min((stats.totalLocked / 365) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">Keep building your discipline daily</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <Card className="glass-smooth p-3 shadow-xl border backdrop-blur-xl">
            <div className="text-sm space-y-1">
              <p className="font-semibold">{formatDate(hoveredDay.date)}</p>
              <p className="text-xs text-muted-foreground">{getLevelText(hoveredDay.level)}</p>
              <div className="pt-2 space-y-1 text-xs border-t">
                <p>Focus Sessions: {hoveredDay.focusSessions}</p>
                <p>Tasks Completed: {hoveredDay.tasksCompleted}</p>
                <p>Reflection: {hoveredDay.reflectionCompleted ? "Yes" : "No"}</p>
              </div>
              {hoveredDay.isGraceDay && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 pt-1">Grace Day</p>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
