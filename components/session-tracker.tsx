"use client"

interface SessionTrackerProps {
  completedSessions: number
}

export function SessionTracker({ completedSessions }: SessionTrackerProps) {
  const sessions = Array.from({ length: 8 }, (_, i) => i < completedSessions)

  return (
    <div className="game-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-black text-sm">Sessions Today</h3>
        <span className="text-2xl font-black text-primary">{completedSessions}</span>
      </div>

      {/* Dots — groups of 4 like Duolingo hearts */}
      <div className="flex items-center gap-1.5 mb-3">
        {sessions.map((completed, index) => (
          <div
            key={index}
            className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
              completed
                ? "bg-primary border-primary scale-110"
                : "bg-muted border-border"
            } ${index === 3 || index === 7 ? "mr-2" : ""}`}
          />
        ))}
      </div>

      <p className="text-xs font-semibold text-muted-foreground">
        {completedSessions === 0
          ? "Start your first session!"
          : completedSessions % 4 === 0
          ? `Full cycle complete! Keep going!`
          : `${4 - (completedSessions % 4)} more to complete a cycle`}
      </p>
    </div>
  )
}
