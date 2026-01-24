import type { DayActivity, LockInLevel } from "@/components/lock-in-calendar"

const STORAGE_KEY = "saladtimer-activities"
const GRACE_DAYS_PER_MONTH = 2

export function getTodayDateString(): string {
  const today = new Date()
  return today.toISOString().split("T")[0]
}

export function getActivities(): DayActivity[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    return JSON.parse(stored)
  } catch (error) {
    console.error("Failed to load activities:", error)
    return []
  }
}

export function saveActivities(activities: DayActivity[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities))
  } catch (error) {
    console.error("Failed to save activities:", error)
  }
}

export function calculateLockInLevel(
  focusSessions: number,
  tasksCompleted: number,
  reflectionCompleted: boolean,
): LockInLevel {
  // No activity
  if (focusSessions === 0 && tasksCompleted === 0 && !reflectionCompleted) {
    return "none"
  }

  // Deep lock-in: 2+ focus sessions OR (focus + task + reflection)
  if (focusSessions >= 2 || (focusSessions >= 1 && tasksCompleted >= 1 && reflectionCompleted)) {
    return "deep"
  }

  // Locked-in: at least 1 focus session OR key task
  if (focusSessions >= 1 || tasksCompleted >= 1) {
    return "locked"
  }

  // Partial activity
  return "partial"
}

export function recordFocusSession(): void {
  const today = getTodayDateString()
  const activities = getActivities()
  const todayActivity = activities.find((a) => a.date === today)

  if (todayActivity) {
    todayActivity.focusSessions += 1
    todayActivity.level = calculateLockInLevel(
      todayActivity.focusSessions,
      todayActivity.tasksCompleted,
      todayActivity.reflectionCompleted,
    )
  } else {
    const newActivity: DayActivity = {
      date: today,
      focusSessions: 1,
      tasksCompleted: 0,
      reflectionCompleted: false,
      level: "locked",
    }
    activities.push(newActivity)
  }

  saveActivities(activities)
}

export function recordTaskCompletion(): void {
  const today = getTodayDateString()
  const activities = getActivities()
  const todayActivity = activities.find((a) => a.date === today)

  if (todayActivity) {
    todayActivity.tasksCompleted += 1
    todayActivity.level = calculateLockInLevel(
      todayActivity.focusSessions,
      todayActivity.tasksCompleted,
      todayActivity.reflectionCompleted,
    )
  } else {
    const newActivity: DayActivity = {
      date: today,
      focusSessions: 0,
      tasksCompleted: 1,
      reflectionCompleted: false,
      level: "locked",
    }
    activities.push(newActivity)
  }

  saveActivities(activities)
}

export function recordReflection(): void {
  const today = getTodayDateString()
  const activities = getActivities()
  const todayActivity = activities.find((a) => a.date === today)

  if (todayActivity) {
    todayActivity.reflectionCompleted = true
    todayActivity.level = calculateLockInLevel(
      todayActivity.focusSessions,
      todayActivity.tasksCompleted,
      todayActivity.reflectionCompleted,
    )
  } else {
    const newActivity: DayActivity = {
      date: today,
      focusSessions: 0,
      tasksCompleted: 0,
      reflectionCompleted: true,
      level: "partial",
    }
    activities.push(newActivity)
  }

  saveActivities(activities)
}

export function markGraceDay(date: string): void {
  const activities = getActivities()
  const activity = activities.find((a) => a.date === date)

  if (activity) {
    activity.isGraceDay = true
    saveActivities(activities)
  }
}

// Check if we can use grace days (max 2 per month)
export function canUseGraceDay(date: string): boolean {
  const activities = getActivities()
  const targetDate = new Date(date)
  const month = targetDate.getMonth()
  const year = targetDate.getFullYear()

  const graceDaysThisMonth = activities.filter((a) => {
    const activityDate = new Date(a.date)
    return (
      a.isGraceDay && activityDate.getMonth() === month && activityDate.getFullYear() === year
    )
  }).length

  return graceDaysThisMonth < GRACE_DAYS_PER_MONTH
}
