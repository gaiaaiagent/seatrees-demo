'use client'

import { motion } from 'framer-motion'
import type { Credit } from '@/types'

interface BatchTimelineProps {
  batches: Credit[]
}

export function BatchTimeline({ batches }: BatchTimelineProps) {
  if (batches.length === 0) {
    return (
      <p className="text-sm text-[var(--st-text-muted)] text-center py-8">
        No batch data available.
      </p>
    )
  }

  const sorted = [...batches].sort(
    (a, b) => new Date(a.issued_at).getTime() - new Date(b.issued_at).getTime()
  )

  const isMarereni = (batch: Credit) =>
    batch.batch_denom.toLowerCase().includes('marereni') ||
    batch.credit_class.toLowerCase().includes('mbci')

  return (
    <div className="relative py-4">
      {/* Horizontal line */}
      <div className="absolute top-[28px] left-4 right-4 h-px bg-[var(--st-border)]" />

      <div
        className="flex justify-between gap-4 px-4"
        style={{ minWidth: batches.length <= 2 ? '100%' : undefined }}
      >
        {sorted.map((batch, i) => {
          const highlighted = isMarereni(batch)
          const date = new Date(batch.issued_at)
          const truncDenom =
            batch.batch_denom.length > 24
              ? `${batch.batch_denom.slice(0, 10)}...${batch.batch_denom.slice(-8)}`
              : batch.batch_denom

          return (
            <motion.div
              key={batch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
              className="flex flex-col items-center flex-1 min-w-[140px]"
            >
              {/* Node */}
              <div
                className={`relative z-10 rounded-full border-2 ${
                  highlighted
                    ? 'size-5 border-[var(--st-primary)] bg-[var(--st-primary-pale)]'
                    : 'size-3.5 border-border bg-muted'
                }`}
              />

              {/* Vertical line down to card */}
              <div
                className={`w-px h-5 ${
                  highlighted ? 'bg-[var(--st-primary)]/50' : 'bg-[var(--st-border)]'
                }`}
              />

              {/* Info card */}
              <div
                className={`rounded-lg p-3 text-center w-full max-w-[180px] ${
                  highlighted
                    ? 'bg-[var(--st-card)] border border-[var(--st-primary)]/30 shadow-[var(--shadow-card)]'
                    : 'bg-muted border border-[var(--st-border)]'
                }`}
              >
                <p className="font-mono text-[10px] text-[var(--st-text-muted)] truncate" title={batch.batch_denom}>
                  {truncDenom}
                </p>
                <p className="text-xs text-[var(--st-text-muted)] mt-1">
                  {date.toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
                <p className={`text-sm font-semibold font-mono mt-1 ${highlighted ? 'text-[var(--st-primary)]' : 'text-[var(--st-text)]'}`}>
                  {new Intl.NumberFormat().format(batch.total_issued)}
                  <span className="text-xs text-[var(--st-text-muted)] font-normal ml-1">credits</span>
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
