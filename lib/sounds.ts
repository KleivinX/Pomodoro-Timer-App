// Sound effect utilities for CRUMBO

export enum SoundType {
  TIMER_COMPLETE = 'timer-complete',
  LEVEL_UP = 'level-up',
  BADGE_UNLOCK = 'badge-unlock',
  TASK_COMPLETE = 'task-complete',
  LOCK_IN = 'lock-in',
  REFLECTION_SUBMIT = 'reflection-submit',
  BUTTON_CLICK = 'button-click',
}

// Generate simple beep sounds using Web Audio API
export function playSound(type: SoundType): void {
  if (typeof window === 'undefined') return

  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

    switch (type) {
      case SoundType.TIMER_COMPLETE:
        playBeeps(audioContext, [523, 659, 784], 100)
        break
      case SoundType.LEVEL_UP:
        playBeeps(audioContext, [330, 392, 494, 587], 80)
        break
      case SoundType.BADGE_UNLOCK:
        playBeeps(audioContext, [440, 554, 659, 784, 1047], 60)
        break
      case SoundType.TASK_COMPLETE:
        playBeep(audioContext, 800, 100)
        break
      case SoundType.LOCK_IN:
        playBeeps(audioContext, [587, 659], 120)
        break
      case SoundType.REFLECTION_SUBMIT:
        playBeeps(audioContext, [440, 495, 554], 90)
        break
      case SoundType.BUTTON_CLICK:
        playBeep(audioContext, 1000, 50)
        break
    }
  } catch (error) {
    console.log('Sound playback not available')
  }
}

function playBeep(
  audioContext: AudioContext,
  frequency: number,
  duration: number
): void {
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.frequency.value = frequency
  oscillator.type = 'sine'

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + duration / 1000
  )

  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + duration / 1000)
}

function playBeeps(
  audioContext: AudioContext,
  frequencies: number[],
  duration: number
): void {
  frequencies.forEach((freq, index) => {
    const startTime = audioContext.currentTime + (index * duration) / 1000
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = freq
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, startTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration / 1000)

    oscillator.start(startTime)
    oscillator.stop(startTime + duration / 1000)
  })
}
