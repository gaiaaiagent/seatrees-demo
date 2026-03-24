'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { SummaryBar } from '@/components/dashboard/SummaryBar'
import { ProjectGrid } from '@/components/dashboard/ProjectGrid'
import { TransactionChart } from '@/components/dashboard/TransactionChart'
import { PurchaseTypeChart } from '@/components/dashboard/PurchaseTypeChart'
import { ProjectMap } from '@/components/shared/ProjectMap'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageTransition } from '@/components/shared/PageTransition'
import type { DashboardSummary } from '@/types'

interface TransactionRow {
  month: string
  count: number
  revenue: number
  blocks: number
  purchase_type: string
}

function SkeletonBar() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-16 animate-pulse rounded-xl border border-[var(--st-border)] bg-[var(--st-card)]" />
      ))}
    </div>
  )
}

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
      <p className="text-xs mt-1">Please wait while we load your dashboard</p>
    </div>
  )
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null)
  const [txData, setTxData] = useState<TransactionRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      api<DashboardSummary>('/api/dashboard'),
      api<TransactionRow[]>('/api/transactions/summary'),
    ])
      .then(([dashboard, transactions]) => {
        if (dashboard) setData(dashboard)
        if (transactions) setTxData(transactions)
      })
      .catch((e) => setError(e?.message ?? 'Failed to load dashboard'))
  }, [])

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-[var(--st-text)]">Portfolio Dashboard</h1>
        <ConnectingState />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="space-y-3 p-4">
        <SkeletonBar />
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[3fr_2fr]">
          <SkeletonBlock className="min-h-[280px]" />
          <div className="space-y-3">
            <SkeletonBlock className="min-h-[180px]" />
            <SkeletonBlock className="min-h-[180px]" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-24" />
          ))}
        </div>
      </div>
    )
  }

  const purchaseBreakdown = buildPurchaseBreakdown(txData ?? [])

  return (
    <PageTransition>
      <div className="space-y-3 p-4">
        {/* Summary metrics */}
        <ErrorBoundary>
          <div data-tour="key-metrics">
            <SummaryBar summary={data} />
          </div>
        </ErrorBoundary>

        {/* Map + Charts */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[3fr_2fr]">
          <ErrorBoundary>
            <Card className="gap-0 py-0 overflow-hidden shadow-[var(--shadow-card)]" data-tour="nav-map">
              <CardHeader className="py-2.5 px-4">
                <CardTitle className="text-xs font-semibold tracking-wide uppercase text-[var(--st-text-muted)]">
                  Global Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[280px]">
                <ProjectMap projects={data.projects} />
              </CardContent>
            </Card>
          </ErrorBoundary>

          <div className="flex flex-col gap-3">
            <ErrorBoundary>
              <Card className="gap-0 py-0 overflow-hidden shadow-[var(--shadow-card)] flex-1 flex flex-col">
                <CardHeader className="py-2 px-4">
                  <CardTitle className="text-xs font-semibold tracking-wide uppercase text-[var(--st-text-muted)]">
                    Transaction Volume
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-1 px-3 flex-1">
                  <TransactionChart data={txData ?? []} />
                </CardContent>
              </Card>
            </ErrorBoundary>

            <ErrorBoundary>
              <Card className="gap-0 py-0 overflow-hidden shadow-[var(--shadow-card)] flex-1 flex flex-col">
                <CardHeader className="py-2 px-4">
                  <CardTitle className="text-xs font-semibold tracking-wide uppercase text-[var(--st-text-muted)]">
                    Purchase Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-1 px-3 flex-1">
                  <PurchaseTypeChart data={purchaseBreakdown} />
                </CardContent>
              </Card>
            </ErrorBoundary>
          </div>
        </div>

        {/* Project grid */}
        <ErrorBoundary>
          <div>
            <h2 className="text-xs font-semibold tracking-wide uppercase text-[var(--st-text-muted)] mb-2">
              All Projects
            </h2>
            {data.projects.length > 0 ? (
              <ProjectGrid projects={data.projects} />
            ) : (
              <p className="text-sm text-[var(--st-text-muted)] py-8 text-center">
                No project data available
              </p>
            )}
          </div>
        </ErrorBoundary>
      </div>
    </PageTransition>
  )
}

function buildPurchaseBreakdown(rows: TransactionRow[]) {
  const totals = { b2c: 0, b2b: 0, untagged: 0 }

  for (const row of rows) {
    if (row.purchase_type === 'b2c') totals.b2c += row.count
    else if (row.purchase_type === 'b2b') totals.b2b += row.count
    else totals.untagged += row.count
  }

  return [
    { name: 'B2C', value: totals.b2c, color: '#0e7490' },
    { name: 'B2B', value: totals.b2b, color: '#10B981' },
    { name: 'Untagged', value: totals.untagged, color: '#d97706' },
  ].filter((d) => d.value > 0)
}
