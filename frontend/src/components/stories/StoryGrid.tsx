'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StoryCard } from './StoryCard'
import type { Story } from '@/types'

const filters = [
  { value: '', label: 'All' },
  { value: 'pmu', label: 'PMU' },
  { value: 'explainer', label: 'Explainer' },
  { value: 'faq', label: 'FAQ' },
  { value: 'comparison', label: 'Comparison' },
] as const

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 200,
      damping: 22,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15 },
  },
}

interface StoryGridProps {
  stories: Story[]
}

export function StoryGrid({ stories }: StoryGridProps) {
  const [activeFilter, setActiveFilter] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = activeFilter
    ? stories.filter((s) => s.story_type === activeFilter)
    : stories

  function handleToggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="space-y-4">
      <Tabs
        value={activeFilter}
        onValueChange={(v) => {
          setActiveFilter(v)
          setExpandedId(null)
        }}
      >
        <TabsList>
          {filters.map((f) => (
            <TabsTrigger key={f.value} value={f.value}>
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
          exit="hidden"
        >
          {filtered.map((story) => (
            <motion.div
              key={story.id}
              variants={itemVariants}
              layout
              className={
                expandedId === story.id
                  ? 'col-span-1 md:col-span-2 lg:col-span-3'
                  : ''
              }
            >
              <StoryCard
                story={story}
                expanded={expandedId === story.id}
                onToggle={() => handleToggle(story.id)}
              />
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center text-muted-foreground py-12"
            >
              No stories found for this filter.
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
