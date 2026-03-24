'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import type { ProjectWithStats } from '@/types'

interface ProjectGridProps {
  projects: ProjectWithStats[]
}

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.95, rotateX: 3 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 200,
      damping: 22,
    },
  },
}

const statusConfig = {
  active: { color: 'bg-emerald-500', label: 'Active' },
  monitoring: { color: 'bg-amber-500', label: 'Monitoring' },
  planned: { color: 'bg-gray-400', label: 'Planned' },
} as const

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      style={{ perspective: 1000 }}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {projects.map((project) => {
        const status = statusConfig[project.status]
        return (
          <motion.div key={project.id} variants={itemVariants}>
            <Link href={`/project/${project.slug}`}>
              <div
                className="rounded-lg border border-[var(--st-border)] bg-[var(--st-card)] px-3 py-2.5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow cursor-pointer h-full"
                style={{ borderLeft: `4px solid ${project.ecosystem_color}` }}
              >
                <h3 className="font-semibold text-sm text-[var(--st-text)]">{project.name}</h3>
                <p className="text-[var(--st-text-muted)] text-xs mt-0.5">
                  {project.region}, {project.country}
                </p>

                <div className="mt-1.5">
                  <Badge variant="outline" className="text-[10px]">
                    {project.partner}
                  </Badge>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--st-border)]">
                  <span className="text-xs text-[var(--st-text-muted)]">
                    {new Intl.NumberFormat().format(project.trees_planted)} trees
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-[var(--st-text-muted)]">
                    <span className={`size-2 rounded-full ${status.color}`} />
                    {status.label}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
