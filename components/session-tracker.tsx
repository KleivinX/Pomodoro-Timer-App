"use client"

interface SessionTrackerProps {
  completedSessions: number
}

export function SessionTracker({ completedSessions }: SessionTrackerProps) {
  const sessions = Array.from({ length: 8 }, (_, i) => i < completedSessions)

  return (
    <div className="rounded-2xl p-6 text-center border-2 border-border bg-card shadow-md">
      <h3 className="text-lg font-semibold mb-4">Completed Sessions</h3>

      <div className="flex items-center justify-center gap-2 mb-4">
        {sessions.map((completed, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              completed ? "bg-primary shadow-lg scale-110" : "bg-muted border-2 border-muted-foreground/20"
            }`}
          />
        ))}
      </div>

      <div className="text-2xl font-bold text-primary mb-1">{completedSessions}</div>
      <div className="text-sm text-muted-foreground">
        {completedSessions === 1 ? "session" : "sessions"} completed today
      </div>

      {completedSessions > 0 && completedSessions % 4 === 0 && (
        <div className="mt-4 text-sm text-secondary font-medium">
          🎉 Great job! You've completed {completedSessions / 4} full cycle{completedSessions / 4 !== 1 ? "s" : ""}!
        </div>
      )}
    </div>
  )
}
