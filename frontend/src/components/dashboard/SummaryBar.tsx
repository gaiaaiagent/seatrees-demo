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
      className="grid grid-cols-2 gap-4 md:grid-cols-4"
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
            className="glass-card rounded-xl p-4 relative"
          >
            <Icon className="size-4 text-muted-foreground absolute top-4 right-4" />
            <p className="text-primary text-2xl font-bold font-mono">{card.value}</p>
            <p className="text-muted-foreground text-sm mt-1">{card.label}</p>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
