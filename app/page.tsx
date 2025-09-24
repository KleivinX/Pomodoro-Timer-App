import { PomodoroTimer } from "@/components/pomodoro-timer"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <PomodoroTimer />
    </main>
  )
}
