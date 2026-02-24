import { useState, useEffect, useCallback, useRef } from 'react'

interface TimerConfig {
  focusDuration: number // in minutes
  shortBreakDuration: number // in minutes
  longBreakDuration: number // in minutes
  sessionsUntilLongBreak: number
}

type TimerMode = 'focus' | 'short_break' | 'long_break'

interface UseTimerReturn {
  timeLeft: number
  isRunning: boolean
  mode: TimerMode
  sessionCount: number
  start: () => void
  pause: () => void
  resume: () => void
  stop: () => void
  nextMode: () => void
  getDurationMinutes: () => number
}

export function useTimer(config: TimerConfig): UseTimerReturn {
  const [timeLeft, setTimeLeft] = useState(config.focusDuration * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<TimerMode>('focus')
  const [sessionCount, setSessionCount] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const getDurationSeconds = useCallback(() => {
    switch (mode) {
      case 'focus':
        return config.focusDuration * 60
      case 'short_break':
        return config.shortBreakDuration * 60
      case 'long_break':
        return config.longBreakDuration * 60
    }
  }, [mode, config])

  const getDurationMinutes = useCallback(() => {
    switch (mode) {
      case 'focus':
        return config.focusDuration
      case 'short_break':
        return config.shortBreakDuration
      case 'long_break':
        return config.longBreakDuration
    }
  }, [mode, config])

  const moveToNextMode = useCallback(() => {
    if (mode === 'focus') {
      setSessionCount(prev => prev + 1)
      if ((sessionCount + 1) % config.sessionsUntilLongBreak === 0) {
        setMode('long_break')
      } else {
        setMode('short_break')
      }
    } else {
      setMode('focus')
    }
  }, [mode, sessionCount, config.sessionsUntilLongBreak])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            return getDurationSeconds()
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, getDurationSeconds])

  const start = () => {
    setTimeLeft(getDurationSeconds())
    setIsRunning(true)
  }

  const pause = () => {
    setIsRunning(false)
  }

  const resume = () => {
    setIsRunning(true)
  }

  const stop = () => {
    setIsRunning(false)
    setTimeLeft(getDurationSeconds())
  }

  const nextMode = () => {
    setIsRunning(false)
    moveToNextMode()
    setTimeLeft(getDurationSeconds())
  }

  return {
    timeLeft,
    isRunning,
    mode,
    sessionCount,
    start,
    pause,
    resume,
    stop,
    nextMode,
    getDurationMinutes,
  }
}
