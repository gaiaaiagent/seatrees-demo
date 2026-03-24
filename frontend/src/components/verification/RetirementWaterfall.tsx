'use client'

import { motion } from 'framer-motion'

interface RetirementWaterfallProps {
  totalIssued: number
  totalRetired: number
  totalTradeable: number
}

export function RetirementWaterfall({
  totalIssued,
  totalRetired,
  totalTradeable,
}: RetirementWaterfallProps) {
  const retiredPct = totalIssued > 0 ? (totalRetired / totalIssued) * 100 : 0
  const tradeablePct = totalIssued > 0 ? (totalTradeable / totalIssued) * 100 : 0

  const bars = [
    {
      label: 'Total Issued',
      value: totalIssued,
      pct: 100,
      color: 'bg-muted border border-border',
      textColor: 'text-[var(--st-text)]',
    },
    {
      label: 'Total Retired',
      value: totalRetired,
      pct: retiredPct,
      color: 'bg-[var(--st-primary)]/20 border border-[var(--st-primary)]/40',
      textColor: 'text-[var(--st-primary)]',
    },
    {
      label: 'Tradeable',
      value: totalTradeable,
      pct: tradeablePct,
      color: 'bg-amber-100 border border-amber-300',
      textColor: 'text-amber-600',
    },
  ]

  return (
    <div className="space-y-5">
      {bars.map((bar, i) => (
        <div key={bar.label}>
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xs text-[var(--st-text-muted)]">{bar.label}</span>
            <span className={`text-xs font-mono ${bar.textColor}`}>
              {new Intl.NumberFormat().format(bar.value)}
              <span className="text-[var(--st-text-muted)] ml-1">
                ({bar.pct.toFixed(1)}%)
              </span>
            </span>
          </div>
          <div className="h-7 w-full rounded-md bg-muted overflow-hidden border border-[var(--st-border)]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(bar.pct, bar.value > 0 ? 2 : 0)}%` }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: 'easeOut' }}
              className={`h-full rounded-md ${bar.color}`}
            />
          </div>
        </div>
      ))}

      <p className="text-xs text-[var(--st-text-muted)]/70 italic pt-1 leading-relaxed">
        All SeaTrees credits are retired immediately upon purchase — no secondary market.
      </p>
    </div>
  )
}
