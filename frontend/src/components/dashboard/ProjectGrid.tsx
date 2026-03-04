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
  active: { color: 'bg-emerald-400', label: 'Active' },
  monitoring: { color: 'bg-amber-400', label: 'Monitoring' },
  planned: { color: 'bg-muted-foreground', label: 'Planned' },
} as const

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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
                className="rounded-xl border border-border bg-card p-4 hover:bg-accent/50 transition-colors cursor-pointer h-full"
                style={{ borderLeft: `4px solid ${project.ecosystem_color}` }}
              >
                <h3 className="font-semibold text-sm">{project.name}</h3>
                <p className="text-muted-foreground text-xs mt-0.5">
                  {project.region}, {project.country}
                </p>

                <div className="mt-2">
                  <Badge variant="outline" className="text-[10px]">
                    {project.partner}
                  </Badge>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    {new Intl.NumberFormat().format(project.trees_planted)} trees
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
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
