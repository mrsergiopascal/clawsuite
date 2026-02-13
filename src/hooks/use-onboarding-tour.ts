import { useState, useCallback } from 'react'

const TOUR_STORAGE_KEY = 'clawsuite-onboarding-completed'

export function useOnboardingTour() {
  const [tourCompleted, setTourCompleted] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      return localStorage.getItem(TOUR_STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  })

  const resetTour = useCallback(() => {
    try {
      localStorage.removeItem(TOUR_STORAGE_KEY)
      setTourCompleted(false)
      // Reload to restart tour
      if (typeof window !== 'undefined') {
        window.location.reload()
      }
    } catch {
      // ignore
    }
  }, [])

  const completeTour = useCallback(() => {
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, 'true')
      setTourCompleted(true)
    } catch {
      // ignore
    }
  }, [])

  return {
    tourCompleted,
    resetTour,
    completeTour,
  }
}
