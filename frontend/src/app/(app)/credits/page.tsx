'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { PageTransition } from '@/components/shared/PageTransition'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ComparisonMatrix } from '@/components/credits/ComparisonMatrix'
import { CreditExplainer } from '@/components/credits/CreditExplainer'
import { MarketPosition } from '@/components/credits/MarketPosition'
import type { Comparison } from '@/types'

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-xl border border-[var(--st-border)] bg-[var(--st-card)] ${className ?? ''}`} />
  )
}

function ConnectingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-[var(--st-text-muted)]">
      <div className="size-8 animate-spin rounded-full border-2 border-[var(--st-border)] border-t-[var(--st-primary)] mb-4" />
      <p className="text-sm font-medium">Connecting to data service...</p>
      <p className="text-xs mt-1">Please wait while we load credit intelligence</p>
    </div>
  )
}

export default function CreditsPage() {
  const [data, setData] = useState<Comparison[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api<Comparison[]>('/api/comparisons')
      .then(setData)
      .catch((e) => setError(e?.message ?? 'Failed to load comparisons'))
  }, [])

  if (error) {
    return (
      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Credit Intelligence</h1>
          <p className="text-muted-foreground mt-1">
            How SeaTrees Biodiversity Blocks compare to other frameworks
          </p>
        </div>
        <ConnectingState />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="space-y-4 p-4">
        <div>
          <div className="h-8 w-56 animate-pulse rounded-lg bg-[var(--st-card)] border border-[var(--st-border)]" />
          <div className="h-4 w-80 animate-pulse rounded-lg bg-[var(--st-card)] border border-[var(--st-border)] mt-2" />
        </div>
        <SkeletonBlock className="min-h-[200px]" />
        <SkeletonBlock className="min-h-[180px]" />
        <SkeletonBlock className="min-h-[300px]" />
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="space-y-4 p-4">
        <div>
          <h1 className="text-2xl font-semibold">Credit Intelligence</h1>
          <p className="text-muted-foreground mt-1">
            How SeaTrees Biodiversity Blocks compare to other frameworks
          </p>
        </div>

        <ErrorBoundary>
          <MarketPosition />
        </ErrorBoundary>

        <ErrorBoundary>
          <CreditExplainer />
        </ErrorBoundary>

        <ErrorBoundary>
          <Card>
            <CardHeader>
              <CardTitle>Framework Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ComparisonMatrix frameworks={data} />
            </CardContent>
          </Card>
        </ErrorBoundary>
      </div>
    </PageTransition>
  )
}
