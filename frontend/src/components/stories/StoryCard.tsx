'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StoryDetail } from './StoryDetail'
import type { Story } from '@/types'

const typeColors: Record<Story['story_type'], string> = {
  pmu: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  explainer: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  faq: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  comparison: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
}

const typeLabels: Record<Story['story_type'], string> = {
  pmu: 'PMU',
  explainer: 'Explainer',
  faq: 'FAQ',
  comparison: 'Comparison',
}

interface StoryCardProps {
  story: Story
  expanded?: boolean
  onToggle?: () => void
}

export function StoryCard({ story, expanded = false, onToggle }: StoryCardProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(story.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: ignore
    }
  }

  const preview =
    story.content.length > 150
      ? story.content.slice(0, 150) + '...'
      : story.content

  return (
    <motion.div
      layout
      className={
        'glass-card rounded-xl p-4 cursor-pointer transition-colors hover:border-primary/30' +
        (expanded ? ' col-span-1 md:col-span-2 lg:col-span-3' : '')
      }
      onClick={() => onToggle?.()}
    >
      <AnimatePresence mode="wait" initial={false}>
        {expanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <StoryDetail story={story} onClose={() => onToggle?.()} />
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={typeColors[story.story_type]}>
                {typeLabels[story.story_type]}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {story.audience}
              </Badge>
            </div>

            <h3 className="font-semibold text-lg leading-snug">{story.title}</h3>

            <p className="text-sm text-muted-foreground line-clamp-3">
              {preview}
            </p>

            <div className="pt-1">
              <Button variant="outline" size="xs" onClick={handleCopy}>
                {copied ? (
                  <Check className="size-3 text-emerald-400" />
                ) : (
                  <Copy className="size-3" />
                )}
                {copied ? 'Copied' : 'Copy to Clipboard'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
