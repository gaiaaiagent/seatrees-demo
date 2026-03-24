'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { PageTransition } from '@/components/shared/PageTransition'
import { StoryGrid } from '@/components/stories/StoryGrid'
import type { Story } from '@/types'

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api<Story[]>('/api/stories')
      .then(setStories)
      .catch((e) => setError(e?.message ?? 'Failed to load'))
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-2">
          <p className="text-destructive font-medium">Failed to load stories</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (!stories) {
    return (
      <div className="space-y-4 p-4">
        <div>
          <div className="h-8 w-48 rounded animate-pulse bg-[var(--st-card)] border border-[var(--st-border)]" />
          <div className="h-5 w-80 rounded animate-pulse bg-[var(--st-card)] border border-[var(--st-border)] mt-2" />
        </div>
        <div className="h-9 w-96 rounded animate-pulse bg-[var(--st-card)] border border-[var(--st-border)]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-xl animate-pulse bg-[var(--st-card)] border border-[var(--st-border)]"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="space-y-4 p-4">
        <div>
          <h1 className="text-2xl font-semibold">Impact Stories</h1>
          <p className="text-muted-foreground mt-1">
            Pre-generated content for your comms team. Copy, edit, publish.
          </p>
        </div>
        <StoryGrid stories={stories} />
      </div>
    </PageTransition>
  )
}
