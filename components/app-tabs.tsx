"use client"
import { Timer, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

type TabType = "pomodoro" | "habits" | "lockin"

interface AppTabsProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export function AppTabs({ activeTab, onTabChange }: AppTabsProps) {
  return (
    <div className="flex items-center justify-center gap-2 p-1 rounded-2xl glass-smooth max-w-lg mx-auto">
      <button
        onClick={() => onTabChange("pomodoro")}
        className={cn(
          "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200",
          activeTab === "pomodoro"
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
        )}
      >
        <Timer className="w-5 h-5" />
        <span>Timer</span>
      </button>
      <button
        onClick={() => onTabChange("habits")}
        className={cn(
          "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200",
          activeTab === "habits"
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
        )}
      >
        <span className="text-lg">🥣</span>
        <span>Habits</span>
      </button>
      <button
        onClick={() => onTabChange("lockin")}
        className={cn(
          "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200",
          activeTab === "lockin"
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
        )}
      >
        <Calendar className="w-5 h-5" />
        <span>Lock-In</span>
      </button>
    </div>
  )
}
