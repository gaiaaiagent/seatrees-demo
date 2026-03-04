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
      color: 'bg-muted-foreground/20 border border-muted-foreground/30',
      textColor: 'text-foreground/70',
    },
    {
      label: 'Total Retired',
      value: totalRetired,
      pct: retiredPct,
      color: 'bg-primary/30 border border-primary/50',
      textColor: 'text-primary',
    },
    {
      label: 'Tradeable',
      value: totalTradeable,
      pct: tradeablePct,
      color: 'bg-amber-500/20 border border-amber-500/40',
      textColor: 'text-amber-400',
    },
  ]

  return (
    <div className="space-y-5">
      {bars.map((bar, i) => (
        <div key={bar.label}>
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xs text-muted-foreground">{bar.label}</span>
            <span className={`text-xs font-mono ${bar.textColor}`}>
              {new Intl.NumberFormat().format(bar.value)}
              <span className="text-muted-foreground ml-1">
                ({bar.pct.toFixed(1)}%)
              </span>
            </span>
          </div>
          <div className="h-7 w-full rounded-md bg-muted/30 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(bar.pct, bar.value > 0 ? 2 : 0)}%` }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: 'easeOut' }}
              className={`h-full rounded-md ${bar.color}`}
            />
          </div>
        </div>
      ))}

      <p className="text-xs text-muted-foreground/70 italic pt-1 leading-relaxed">
        All SeaTrees credits are retired immediately upon purchase — no secondary market.
      </p>
    </div>
  )
}
