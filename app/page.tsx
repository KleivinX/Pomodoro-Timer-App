"use client"

import { useState, useEffect } from "react"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { HabitTracker } from "@/components/habit-tracker"
import { LockInCalendar } from "@/components/lock-in-calendar"
import { InstallPrompt } from "@/components/install-prompt"
import { AppTabs } from "@/components/app-tabs"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getActivities } from "@/lib/activity-tracker"
import type { DayActivity } from "@/components/lock-in-calendar"

export default function Home() {
  const [activeTab, setActiveTab] = useState<"pomodoro" | "habits" | "lockin">("pomodoro")
  const [activities, setActivities] = useState<DayActivity[]>([])

  useEffect(() => {
    // Load activities on mount
    setActivities(getActivities())

    // Refresh activities when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setActivities(getActivities())
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [])

  // Refresh activities when switching to lock-in tab
  const handleTabChange = (tab: "pomodoro" | "habits" | "lockin") => {
    setActiveTab(tab)
    if (tab === "lockin") {
      setActivities(getActivities())
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-6">
        {/* Shared Header */}
        <Header />

        {/* Tab Navigation */}
        <div className="mt-6 mb-8">
          <AppTabs activeTab={activeTab} onTabChange={handleTabChange} />
        </div>

        {/* Content based on active tab */}
        <div className="transition-opacity duration-200">
          {activeTab === "pomodoro" && <PomodoroTimer />}
          {activeTab === "habits" && <HabitTracker />}
          {activeTab === "lockin" && <LockInCalendar activities={activities} />}
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
      
      <InstallPrompt />
    </main>
  )
}
