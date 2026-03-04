'use client'

import { motion } from 'framer-motion'
import { TreePine, TrendingUp, Leaf, Map } from 'lucide-react'
import type { Project } from '@/types'

interface MetricsRowProps {
  project: Project & { ecosystem_color: string }
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

function fmt(n: number | null | undefined): string {
  if (n == null) return '\u2014'
  return new Intl.NumberFormat().format(n)
}

function fmtPct(n: number | null | undefined): string {
  if (n == null) return '\u2014'
  return `${Math.round(n * 100)}%`
}

export function MetricsRow({ project }: MetricsRowProps) {
  const cards = [
    {
      label: 'Trees Planted',
      value: fmt(project.trees_planted),
      icon: TreePine,
    },
    {
      label: 'Survival Rate',
      value: fmtPct(project.survival_rate),
      icon: TrendingUp,
    },
    {
      label: 'Native Species',
      value: fmt(project.species_count),
      icon: Leaf,
    },
    {
      label: 'Hectares',
      value: fmt(project.hectares),
      icon: Map,
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
            style={{ borderTop: `2px solid ${project.ecosystem_color}` }}
          >
            <Icon className="size-4 text-muted-foreground absolute top-4 right-4" />
            <p className="text-primary text-3xl font-bold font-mono">{card.value}</p>
            <p className="text-muted-foreground text-sm mt-1">{card.label}</p>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
