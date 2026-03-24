'use client'

import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { tourSteps } from './tourSteps'
import { TourTooltip } from './TourTooltip'

const STORAGE_KEY = 'seatrees-tour-completed'

interface TourContextValue {
  currentStep: number
  isActive: boolean
  totalSteps: number
  next: () => void
  prev: () => void
  skip: () => void
  restart: () => void
}

export const TourContext = createContext<TourContextValue | null>(null)

export function TourProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY)
    if (!completed) {
      const timer = setTimeout(() => setIsActive(true), 800)
      return () => clearTimeout(timer)
    }
  }, [])

  // When navigating completes, clear the navigating flag
  useEffect(() => {
    if (isNavigating) {
      const timer = setTimeout(() => setIsNavigating(false), 300)
      return () => clearTimeout(timer)
    }
  }, [pathname, isNavigating])

  const navigateToStep = useCallback((stepIndex: number) => {
    const step = tourSteps[stepIndex]
    if (step.navigateTo && step.navigateTo !== pathname) {
      setIsNavigating(true)
      router.push(step.navigateTo)
    }
  }, [pathname, router])

  const next = useCallback(() => {
    if (currentStep < tourSteps.length - 1) {
      const nextIndex = currentStep + 1
      navigateToStep(nextIndex)
      setCurrentStep(nextIndex)
    } else {
      setIsActive(false)
      localStorage.setItem(STORAGE_KEY, 'true')
    }
  }, [currentStep, navigateToStep])

  const prev = useCallback(() => {
    if (currentStep > 0) {
      const prevIndex = currentStep - 1
      navigateToStep(prevIndex)
      setCurrentStep(prevIndex)
    }
  }, [currentStep, navigateToStep])

  const skip = useCallback(() => {
    setIsActive(false)
    localStorage.setItem(STORAGE_KEY, 'true')
    // Navigate back to dashboard when skipping
    if (pathname !== '/dashboard') {
      router.push('/dashboard')
    }
  }, [pathname, router])

  const restart = useCallback(() => {
    setCurrentStep(0)
    setIsActive(true)
    if (pathname !== '/dashboard') {
      router.push('/dashboard')
    }
  }, [pathname, router])

  return (
    <TourContext.Provider
      value={{
        currentStep,
        isActive,
        totalSteps: tourSteps.length,
        next,
        prev,
        skip,
        restart,
      }}
    >
      {children}
      {isActive && !isNavigating && (
        <TourOverlay
          step={tourSteps[currentStep]}
          stepIndex={currentStep}
          totalSteps={tourSteps.length}
          onNext={next}
          onPrev={prev}
          onSkip={skip}
        />
      )}
    </TourContext.Provider>
  )
}

function TourOverlay({
  step,
  stepIndex,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
}: {
  step: (typeof tourSteps)[number]
  stepIndex: number
  totalSteps: number
  onNext: () => void
  onPrev: () => void
  onSkip: () => void
}) {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    if (!step.target) {
      setTargetRect(null)
      return
    }

    // Retry finding the element a few times (page may still be loading)
    let attempts = 0
    const maxAttempts = 10

    function findElement() {
      const el = document.querySelector(step.target!)
      if (el) {
        setTargetRect(el.getBoundingClientRect())
      } else if (attempts < maxAttempts) {
        attempts++
        setTimeout(findElement, 200)
      } else {
        setTargetRect(null)
      }
    }

    findElement()
  }, [step])

  const padding = 8

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* SVG spotlight mask */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <mask id="tour-mask">
            <rect width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.x - padding}
                y={targetRect.y - padding}
                width={targetRect.width + padding * 2}
                height={targetRect.height + padding * 2}
                rx="8"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.5)"
          mask="url(#tour-mask)"
        />
      </svg>

      {/* Tooltip */}
      <TourTooltip
        step={step}
        stepIndex={stepIndex}
        totalSteps={totalSteps}
        targetRect={targetRect}
        onNext={onNext}
        onPrev={onPrev}
        onSkip={onSkip}
      />
    </div>
  )
}
