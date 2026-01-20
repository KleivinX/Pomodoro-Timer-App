"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Check, ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface Habit {
  id: string
  name: string
  color: string
  completedDays: number[]
}

interface HabitData {
  habits: Habit[]
  currentMonth: number
  currentYear: number
}

const HABIT_COLORS = [
  { name: "Rose", value: "oklch(0.65 0.2 10)" },
  { name: "Orange", value: "oklch(0.7 0.18 50)" },
  { name: "Amber", value: "oklch(0.75 0.16 85)" },
  { name: "Lime", value: "oklch(0.75 0.18 130)" },
  { name: "Emerald", value: "oklch(0.7 0.17 160)" },
  { name: "Cyan", value: "oklch(0.7 0.14 195)" },
  { name: "Blue", value: "oklch(0.65 0.18 250)" },
  { name: "Violet", value: "oklch(0.65 0.2 290)" },
  { name: "Pink", value: "oklch(0.7 0.18 330)" },
]

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [newHabitName, setNewHabitName] = useState("")
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0].value)
  const [isAddingHabit, setIsAddingHabit] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [mounted, setMounted] = useState(false)

  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const today = new Date()
  const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem(`habits-${currentMonth}-${currentYear}`)
    if (saved) {
      setHabits(JSON.parse(saved))
    } else {
      setHabits([])
    }
  }, [currentMonth, currentYear])

  useEffect(() => {
    if (mounted && habits.length >= 0) {
      localStorage.setItem(`habits-${currentMonth}-${currentYear}`, JSON.stringify(habits))
    }
  }, [habits, currentMonth, currentYear, mounted])

  const addHabit = () => {
    if (!newHabitName.trim() || habits.length >= 10) return
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName.trim(),
      color: selectedColor,
      completedDays: [],
    }
    setHabits([...habits, newHabit])
    setNewHabitName("")
    setIsAddingHabit(false)
  }

  const removeHabit = (id: string) => {
    setHabits(habits.filter((h) => h.id !== id))
  }

  const toggleDay = (habitId: string, day: number) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === habitId) {
          const isCompleted = habit.completedDays.includes(day)
          return {
            ...habit,
            completedDays: isCompleted ? habit.completedDays.filter((d) => d !== day) : [...habit.completedDays, day],
          }
        }
        return habit
      }),
    )
  }

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const getCompletionRate = (habit: Habit): number => {
    const relevantDays = isCurrentMonth ? today.getDate() : daysInMonth
    return Math.round((habit.completedDays.length / relevantDays) * 100)
  }

  const getTotalCompletionRate = (): number => {
    if (habits.length === 0) return 0
    const relevantDays = isCurrentMonth ? today.getDate() : daysInMonth
    const totalPossible = habits.length * relevantDays
    const totalCompleted = habits.reduce((sum, h) => sum + h.completedDays.length, 0)
    return Math.round((totalCompleted / totalPossible) * 100)
  }

  // Calculate arc path for a day segment
  const getArcPath = (dayIndex: number, ringIndex: number, totalDays: number, totalRings: number) => {
    const centerX = 200
    const centerY = 200
    const startRadius = 60
    const ringWidth = (140 - startRadius) / Math.max(totalRings, 1)
    const innerRadius = startRadius + ringIndex * ringWidth
    const outerRadius = innerRadius + ringWidth - 2

    const gapAngle = 2
    const availableAngle = 300
    const segmentAngle = (availableAngle - gapAngle * totalDays) / totalDays
    const startAngle = 120 + dayIndex * (segmentAngle + gapAngle)
    const endAngle = startAngle + segmentAngle

    const startAngleRad = (startAngle * Math.PI) / 180
    const endAngleRad = (endAngle * Math.PI) / 180

    const x1 = centerX + innerRadius * Math.cos(startAngleRad)
    const y1 = centerY + innerRadius * Math.sin(startAngleRad)
    const x2 = centerX + outerRadius * Math.cos(startAngleRad)
    const y2 = centerY + outerRadius * Math.sin(startAngleRad)
    const x3 = centerX + outerRadius * Math.cos(endAngleRad)
    const y3 = centerY + outerRadius * Math.sin(endAngleRad)
    const x4 = centerX + innerRadius * Math.cos(endAngleRad)
    const y4 = centerY + innerRadius * Math.sin(endAngleRad)

    return `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1}`
  }

  // Get day label position
  const getDayLabelPosition = (dayIndex: number, totalDays: number) => {
    const centerX = 200
    const centerY = 200
    const radius = 155

    const gapAngle = 2
    const availableAngle = 300
    const segmentAngle = (availableAngle - gapAngle * totalDays) / totalDays
    const angle = 120 + dayIndex * (segmentAngle + gapAngle) + segmentAngle / 2
    const angleRad = (angle * Math.PI) / 180

    return {
      x: centerX + radius * Math.cos(angleRad),
      y: centerY + radius * Math.sin(angleRad),
      rotation: angle + 90,
    }
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Habit Tracker</h2>
        <p className="text-muted-foreground">Build better habits, one day at a time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Circular Tracker */}
        <div className="lg:col-span-2 glass rounded-3xl p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h3 className="text-xl font-semibold">
              {MONTHS[currentMonth]} {currentYear}
            </h3>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="rounded-full">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* SVG Circular Chart */}
          <div className="relative flex justify-center items-center">
            <svg viewBox="0 0 400 400" className="w-full max-w-md">
              {/* Background ring segments */}
              {Array.from({ length: daysInMonth }).map((_, dayIndex) => (
                <g key={`bg-${dayIndex}`}>
                  {habits.length > 0 ? (
                    habits.map((habit, ringIndex) => {
                      const isCompleted = habit.completedDays.includes(dayIndex + 1)
                      const isToday = isCurrentMonth && dayIndex + 1 === today.getDate()
                      return (
                        <path
                          key={`${habit.id}-${dayIndex}`}
                          d={getArcPath(dayIndex, ringIndex, daysInMonth, habits.length)}
                          fill={isCompleted ? habit.color : "var(--color-muted)"}
                          stroke={isToday ? "var(--color-foreground)" : "var(--color-border)"}
                          strokeWidth={isToday ? 2 : 0.5}
                          className="cursor-pointer transition-all duration-200 hover:opacity-80"
                          onClick={() => toggleDay(habit.id, dayIndex + 1)}
                          style={{
                            opacity: isCompleted ? 1 : 0.3,
                          }}
                        />
                      )
                    })
                  ) : (
                    <path
                      d={getArcPath(dayIndex, 0, daysInMonth, 1)}
                      fill="var(--color-muted)"
                      stroke="var(--color-border)"
                      strokeWidth={0.5}
                      style={{ opacity: 0.3 }}
                    />
                  )}
                </g>
              ))}

              {/* Day labels */}
              {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                const pos = getDayLabelPosition(dayIndex, daysInMonth)
                const isToday = isCurrentMonth && dayIndex + 1 === today.getDate()
                return (
                  <text
                    key={`label-${dayIndex}`}
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={cn(
                      "text-[8px] fill-muted-foreground select-none",
                      isToday && "fill-foreground font-bold",
                    )}
                    transform={`rotate(${pos.rotation}, ${pos.x}, ${pos.y})`}
                  >
                    {String(dayIndex + 1).padStart(2, "0")}
                  </text>
                )
              })}

              {/* Center Stats */}
              <g>
                <text x="200" y="185" textAnchor="middle" className="text-4xl font-bold fill-foreground">
                  {getTotalCompletionRate()}%
                </text>
                <text x="200" y="215" textAnchor="middle" className="text-sm fill-muted-foreground">
                  completed
                </text>
              </g>
            </svg>
          </div>

          {/* Legend */}
          {habits.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {habits.map((habit) => (
                <div key={habit.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-smooth">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: habit.color }} />
                  <span className="text-sm font-medium">{habit.name}</span>
                  <span className="text-xs text-muted-foreground">{getCompletionRate(habit)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Goals Panel */}
        <div className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Goals
            </h3>
            <span className="text-sm text-muted-foreground">{habits.length}/10</span>
          </div>

          {/* Habit List */}
          <div className="space-y-3 mb-6">
            {habits.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="mb-2">No habits yet</p>
                <p className="text-sm">Add your first habit to start tracking!</p>
              </div>
            ) : (
              habits.map((habit) => (
                <div key={habit.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 group">
                  <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: habit.color }} />
                  <span className="flex-1 font-medium truncate">{habit.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {habit.completedDays.length}/{isCurrentMonth ? today.getDate() : daysInMonth}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeHabit(habit.id)}
                    className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Add Habit Form */}
          {isAddingHabit ? (
            <div className="space-y-4 p-4 rounded-xl bg-muted/30">
              <Input
                placeholder="Habit name..."
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addHabit()}
                className="bg-background"
                autoFocus
              />
              <div className="flex flex-wrap gap-2">
                {HABIT_COLORS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.value)}
                    className={cn(
                      "w-8 h-8 rounded-full transition-all",
                      selectedColor === color.value && "ring-2 ring-offset-2 ring-foreground",
                    )}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <Button onClick={addHabit} className="flex-1" disabled={!newHabitName.trim()}>
                  <Check className="w-4 h-4 mr-2" />
                  Add
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingHabit(false)
                    setNewHabitName("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setIsAddingHabit(true)}
              className="w-full"
              disabled={habits.length >= 10}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Habit
            </Button>
          )}

          {/* Quick Stats */}
          {habits.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">This Month</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-xl bg-muted/30">
                  <div className="text-2xl font-bold text-foreground">
                    {habits.reduce((sum, h) => sum + h.completedDays.length, 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Check-ins</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-muted/30">
                  <div className="text-2xl font-bold text-foreground">
                    {habits.filter((h) => getCompletionRate(h) >= 80).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Goals on Track</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
