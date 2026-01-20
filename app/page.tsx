"use client"

import { useState } from "react"
import { PomodoroTimer } from "@/components/pomodoro-timer"
import { HabitTracker } from "@/components/habit-tracker"
import { InstallPrompt } from "@/components/install-prompt"
import { AppTabs } from "@/components/app-tabs"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function Home() {
  const [activeTab, setActiveTab] = useState<"pomodoro" | "habits">("pomodoro")

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-6">
        {/* Shared Header */}
        <Header />

        {/* Tab Navigation */}
        <div className="mt-6 mb-8">
          <AppTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Content based on active tab */}
        <div className="transition-opacity duration-200">
          {activeTab === "pomodoro" ? <PomodoroTimer /> : <HabitTracker />}
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
      
      <InstallPrompt />
    </main>
  )
}
