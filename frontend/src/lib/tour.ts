'use client'

import { useContext } from 'react'
import { TourContext } from '@/components/tour/TourProvider'

export function useTour() {
  const ctx = useContext(TourContext)
  if (!ctx) {
    return {
      currentStep: 0,
      isActive: false,
      totalSteps: 0,
      next: () => {},
      prev: () => {},
      skip: () => {},
      restart: () => {},
    }
  }
  return ctx
}
