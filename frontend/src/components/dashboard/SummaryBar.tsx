'use client'

import { motion } from 'framer-motion'
import { MapPin, Waves, Shield, DollarSign } from 'lucide-react'
import type { DashboardSummary } from '@/types'

interface SummaryBarProps {
  summary: DashboardSummary
}

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 20,
    },
  },
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  return `$${n}`
}

export function SummaryBar({ summary }: SummaryBarProps) {
  const cards = [
    {
      label: 'Total Projects',
      value: summary.total_projects.toString(),
      icon: MapPin,
    },
    {
      label: 'Ecosystems',
      value: summary.total_ecosystems.toString(),
      icon: Waves,
    },
    {
      label: 'Blocks Retired',
      value: new Intl.NumberFormat().format(summary.total_blocks_retired),
      icon: Shield,
    },
    {
      label: 'Total Revenue',
      value: formatCompact(summary.total_revenue),
      icon: DollarSign,
    },
  ]

  return (
    <motion.div
      className="grid grid-cols-2 gap-3 md:grid-cols-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <motion.div
            key={card.label}
            variants={itemVariants}
            className="rounded-xl bg-[var(--st-card)] px-4 py-3 relative shadow-[var(--shadow-card)] border border-[var(--st-border)]"
          >
            <Icon className="size-3.5 text-[var(--st-text-muted)] absolute top-3 right-3" />
            <p className="text-[var(--st-primary)] text-xl font-bold font-mono">{card.value}</p>
            <p className="text-[var(--st-text-muted)] text-xs mt-0.5">{card.label}</p>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
