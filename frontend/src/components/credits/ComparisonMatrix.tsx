'use client'

import { cn } from '@/lib/utils'
import type { Comparison } from '@/types'

const ATTRIBUTE_KEYS = [
  { key: 'credit_unit', label: 'Credit Unit' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'duration', label: 'Duration' },
  { key: 'monitoring', label: 'Monitoring' },
  { key: 'verification', label: 'Verification' },
  { key: 'blockchain', label: 'Blockchain' },
  { key: 'community_benefit', label: 'Community Benefit' },
] as const

export function ComparisonMatrix({ frameworks }: { frameworks: Comparison[] }) {
  return (
    <div className="overflow-x-auto -mx-6 px-6 pb-2">
      <div className="flex gap-4 min-w-max lg:grid lg:grid-cols-5 lg:min-w-0">
        {frameworks.map((fw) => (
          <div
            key={fw.id}
            className={cn(
              'rounded-xl p-5 flex flex-col gap-4 shrink-0 bg-[var(--st-card)] border shadow-[var(--shadow-card)]',
              fw.highlight
                ? 'border-[var(--st-primary)] ring-1 ring-[var(--st-primary)]/20 w-64 lg:w-auto'
                : 'border-[var(--st-border)] w-56 lg:w-auto'
            )}
          >
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold leading-tight text-[var(--st-text)]">{fw.framework_name}</h3>
              {fw.highlight && (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--st-primary)] bg-[var(--st-primary-pale)] rounded-full px-2 py-0.5">
                  Featured
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {ATTRIBUTE_KEYS.map(({ key, label }) => (
                <div key={key}>
                  <p className="text-xs text-[var(--st-text-muted)] uppercase tracking-wide mb-0.5">
                    {label}
                  </p>
                  <p className="text-sm leading-snug text-[var(--st-text)]">
                    {fw[key as keyof Comparison] as string}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
