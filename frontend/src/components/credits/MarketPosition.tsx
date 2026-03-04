'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

function useCountUp(target: number, duration = 1500) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()

          function tick(now: number) {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            // ease-out quad
            const eased = 1 - (1 - progress) * (1 - progress)
            setValue(Math.round(eased * target))
            if (progress < 1) requestAnimationFrame(tick)
          }

          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return { value, ref }
}

const SEATREES_SALES = 51
const REST_SALES = 5

export function MarketPosition() {
  const { value: pct, ref } = useCountUp(91)
  const maxWidth = SEATREES_SALES // scale bars relative to largest

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-xl border-primary/20 border p-6 lg:p-8 space-y-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-end gap-6">
        {/* Big number */}
        <div className="shrink-0">
          <p className="text-6xl font-bold font-mono text-primary leading-none">
            {pct}%
          </p>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs leading-relaxed">
            of voluntary biodiversity credit market sales (Jan 2026)
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Source: bloomlabs Market Intelligence
          </p>
        </div>

        {/* Bar chart */}
        <div className="flex-1 space-y-3 min-w-0">
          {/* SeaTrees bar */}
          <div className="space-y-1">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium text-primary">SeaTrees</span>
              <span className="text-xs text-muted-foreground">${SEATREES_SALES}K</span>
            </div>
            <div className="h-6 rounded-md bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-md bg-primary"
                initial={{ width: 0 }}
                whileInView={{ width: `${(SEATREES_SALES / maxWidth) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Rest of market bar */}
          <div className="space-y-1">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium text-muted-foreground">Rest of Market</span>
              <span className="text-xs text-muted-foreground">${REST_SALES}K</span>
            </div>
            <div className="h-6 rounded-md bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-md bg-muted-foreground/30"
                initial={{ width: 0 }}
                whileInView={{ width: `${(REST_SALES / maxWidth) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
