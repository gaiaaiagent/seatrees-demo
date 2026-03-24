'use client'

import { Button } from '@/components/ui/button'
import type { TourStep } from './tourSteps'

interface TourTooltipProps {
  step: TourStep
  stepIndex: number
  totalSteps: number
  targetRect: DOMRect | null
  onNext: () => void
  onPrev: () => void
  onSkip: () => void
}

export function TourTooltip({
  step,
  stepIndex,
  totalSteps,
  targetRect,
  onNext,
  onPrev,
  onSkip,
}: TourTooltipProps) {
  const isLast = stepIndex === totalSteps - 1
  const isFirst = stepIndex === 0

  // Position calculation
  let style: React.CSSProperties = {}

  if (!targetRect) {
    // Center on screen
    style = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }
  } else {
    const placement = step.placement || 'bottom'
    const gap = 16

    switch (placement) {
      case 'bottom':
        style = {
          position: 'fixed',
          top: targetRect.bottom + gap,
          left: targetRect.left + targetRect.width / 2,
          transform: 'translateX(-50%)',
        }
        break
      case 'top':
        style = {
          position: 'fixed',
          bottom: window.innerHeight - targetRect.top + gap,
          left: targetRect.left + targetRect.width / 2,
          transform: 'translateX(-50%)',
        }
        break
      case 'right':
        style = {
          position: 'fixed',
          top: targetRect.top + targetRect.height / 2,
          left: targetRect.right + gap,
          transform: 'translateY(-50%)',
        }
        break
      case 'left':
        style = {
          position: 'fixed',
          top: targetRect.top + targetRect.height / 2,
          right: window.innerWidth - targetRect.left + gap,
          transform: 'translateY(-50%)',
        }
        break
    }
  }

  return (
    <div
      style={style}
      className="z-[10000] w-[320px] rounded-xl bg-[var(--st-card)] p-5 shadow-xl border border-[var(--st-border)]"
    >
      <div className="space-y-3">
        <div>
          <p className="text-xs font-medium text-[var(--st-primary)] mb-1">
            Step {stepIndex + 1} of {totalSteps}
          </p>
          <h3 className="text-base font-semibold text-[var(--st-text)]">
            {step.title}
          </h3>
        </div>
        <p className="text-sm text-[var(--st-text-muted)] leading-relaxed">
          {step.content}
        </p>
        <div className="flex items-center justify-between pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="text-xs text-[var(--st-text-muted)]"
          >
            Skip tour
          </Button>
          <div className="flex items-center gap-2">
            {!isFirst && (
              <Button variant="outline" size="sm" onClick={onPrev} className="text-xs">
                Back
              </Button>
            )}
            <Button size="sm" onClick={onNext} className="text-xs">
              {isLast ? 'Finish' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
