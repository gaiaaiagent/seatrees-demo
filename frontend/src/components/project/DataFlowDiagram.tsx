'use client'

import { motion } from 'framer-motion'
import { Users, Eye, Shield, Link } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const stages: { icon: LucideIcon; title: string; subtitle: string; accent: string }[] = [
  {
    icon: Users,
    title: 'COBEC Field Data',
    subtitle: 'Community collection & GPS tagging',
    accent: '#10B981',
  },
  {
    icon: Eye,
    title: 'Ocean Ledger Satellite',
    subtitle: 'Remote sensing verification',
    accent: '#0e7490',
  },
  {
    icon: Shield,
    title: 'Regen Verification',
    subtitle: 'Third-party attestation',
    accent: '#d97706',
  },
  {
    icon: Link,
    title: 'On-Chain Record',
    subtitle: 'Immutable ledger entry',
    accent: 'var(--st-primary)',
  },
]

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring' as const, stiffness: 200, damping: 20 },
  },
}

export function DataFlowDiagram() {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--st-text-muted)]">
        Data Verification Pipeline
      </h3>
      <motion.div
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {stages.map((stage, i) => {
          const Icon = stage.icon
          return (
            <motion.div key={stage.title} variants={itemVariants} className="flex items-stretch">
              <div
                className="rounded-xl bg-[var(--st-card)] p-4 flex-1 flex flex-col items-center text-center gap-2 shadow-[var(--shadow-card)] border border-[var(--st-border)]"
                style={{ borderTop: `2px solid ${stage.accent}` }}
              >
                <div
                  className="size-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${stage.accent}15` }}
                >
                  <Icon className="size-5" style={{ color: stage.accent }} />
                </div>
                <p className="text-sm font-semibold text-[var(--st-text)]">{stage.title}</p>
                <p className="text-xs text-[var(--st-text-muted)] leading-relaxed">
                  {stage.subtitle}
                </p>
              </div>
              {i < stages.length - 1 && (
                <div className="hidden lg:flex items-center px-1">
                  <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
                    <path
                      d="M0 6h20m0 0l-4-4m4 4l-4 4"
                      stroke="#6b7f93"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="3 2"
                    />
                  </svg>
                </div>
              )}
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
