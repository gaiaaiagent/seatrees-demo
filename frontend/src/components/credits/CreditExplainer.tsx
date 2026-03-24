'use client'

import { motion } from 'framer-motion'
import { Sprout, Shield, CheckCircle, Lock } from 'lucide-react'

const STEPS = [
  {
    icon: Sprout,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    title: 'Plant',
    description: 'Fund the planting of one mangrove seedling',
  },
  {
    icon: Shield,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    title: 'Protect',
    description: '10 years of stewardship and monitoring',
  },
  {
    icon: CheckCircle,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    title: 'Verify',
    description: 'Third-party verification + satellite analysis',
  },
  {
    icon: Lock,
    color: 'text-[var(--st-primary)]',
    bg: 'bg-[var(--st-primary-pale)]',
    title: 'Retire',
    description: 'Permanently retired on Regen Network blockchain',
  },
] as const

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0, 0, 0.2, 1] as const } },
}

export function CreditExplainer() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[var(--st-text)]">What is 1 Biodiversity Block?</h2>
        <p className="text-sm text-[var(--st-text-muted)] mt-1">
          From seedling to permanent ledger entry in four steps
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
      >
        {STEPS.map((step, i) => {
          const Icon = step.icon
          return (
            <motion.div key={step.title} variants={item} className="relative">
              <div className="rounded-xl bg-[var(--st-card)] p-5 h-full flex flex-col items-center text-center gap-3 shadow-[var(--shadow-card)] border border-[var(--st-border)]">
                <div className={`${step.bg} rounded-full p-3`}>
                  <Icon className={`size-6 ${step.color}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--st-text)]">{step.title}</p>
                  <p className="text-xs text-[var(--st-text-muted)] mt-1 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {i < STEPS.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 text-[var(--st-text-muted)]/40">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </motion.div>
          )
        })}
      </motion.div>

      {/* Key callout */}
      <div className="rounded-xl border border-[var(--st-primary)]/30 bg-[var(--st-primary-pale)] p-4 flex items-start gap-3">
        <Lock className="size-5 text-[var(--st-primary)] shrink-0 mt-0.5" />
        <p className="text-sm leading-relaxed text-[var(--st-text)]">
          <span className="font-semibold text-[var(--st-primary)]">All Biodiversity Blocks are retired immediately upon purchase</span>{' '}
          — no secondary market, no trading, no speculation.
        </p>
      </div>
    </div>
  )
}
