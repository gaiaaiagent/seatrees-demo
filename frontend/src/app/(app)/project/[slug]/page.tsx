'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin } from 'lucide-react'
import { api } from '@/lib/api'
import { PageTransition } from '@/components/shared/PageTransition'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { Badge } from '@/components/ui/badge'
import { MetricsRow } from '@/components/project/MetricsRow'
import { MonitoringTimeline } from '@/components/project/MonitoringTimeline'
import { CreditStatus } from '@/components/project/CreditStatus'
import { DataFlowDiagram } from '@/components/project/DataFlowDiagram'
import { CommunityImpact } from '@/components/project/CommunityImpact'
import type { Project, Credit, Monitoring } from '@/types'

interface ProjectDetail {
  id: string
  name: string
  slug: string
  ecosystem_id: string
  region: string
  country: string
  partner: string
  lat: number
  lng: number
  trees_planted: number
  survival_rate: number
  species_count: number
  hectares: number
  year_started: number
  status: 'active' | 'monitoring' | 'planned'
  ecosystem_name: string
  ecosystem_color: string
  credits: Credit[]
  transactions: unknown[]
  monitoring: Monitoring[]
  verifications: unknown[]
}

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl border border-[var(--st-border)] bg-[var(--st-card)] ${className ?? ''}`}
    />
  )
}

function ConnectingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-[var(--st-text-muted)]">
      <div className="size-8 animate-spin rounded-full border-2 border-[var(--st-border)] border-t-[var(--st-primary)] mb-4" />
      <p className="text-sm font-medium">Connecting to data service...</p>
      <p className="text-xs mt-1">Please wait while we load project details</p>
    </div>
  )
}

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  monitoring: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  planned: 'bg-amber-50 text-amber-700 border-amber-200',
}

export default function ProjectPage() {
  const params = useParams<{ slug: string }>()
  const slug = params.slug
  const [data, setData] = useState<ProjectDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    api<ProjectDetail>(`/api/projects/${encodeURIComponent(slug)}`)
      .then((d) => {
        if (d) setData(d)
      })
      .catch((e) => setError(e?.message ?? 'Failed to load project'))
  }, [slug])

  if (error) {
    return (
      <div className="p-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <ConnectingState />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="space-y-4 p-4">
        <SkeletonBlock className="h-10 w-48" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonBlock key={i} className="h-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[3fr_2fr]">
          <SkeletonBlock className="h-80" />
          <SkeletonBlock className="h-80" />
        </div>
        <SkeletonBlock className="h-32" />
        <SkeletonBlock className="h-48" />
      </div>
    )
  }

  const project: Project & { ecosystem_color: string } = {
    id: data.id,
    name: data.name,
    slug: data.slug,
    ecosystem_id: data.ecosystem_id,
    region: data.region,
    country: data.country,
    partner: data.partner,
    lat: data.lat,
    lng: data.lng,
    trees_planted: data.trees_planted,
    survival_rate: data.survival_rate,
    species_count: data.species_count,
    hectares: data.hectares,
    year_started: data.year_started,
    status: data.status,
    ecosystem_color: data.ecosystem_color,
  }

  return (
    <PageTransition>
      <div className="space-y-4 p-4">
        {/* Hero Header */}
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant="secondary"
                  style={{
                    backgroundColor: `${data.ecosystem_color}20`,
                    color: data.ecosystem_color,
                    borderColor: `${data.ecosystem_color}40`,
                  }}
                >
                  {data.ecosystem_name}
                </Badge>
                <Badge
                  variant="secondary"
                  className={STATUS_STYLES[data.status] ?? ''}
                >
                  {data.status}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold text-foreground">{data.name}</h1>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                <MapPin className="size-3" />
                {data.region}, {data.country} &mdash; Est. {data.year_started}
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Row */}
        <ErrorBoundary>
          <MetricsRow project={project} />
        </ErrorBoundary>

        {/* Two-column: Monitoring + Credits */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[3fr_2fr]">
          <ErrorBoundary>
            <MonitoringTimeline data={data.monitoring ?? []} />
          </ErrorBoundary>
          <ErrorBoundary>
            <CreditStatus credits={data.credits ?? []} />
          </ErrorBoundary>
        </div>

        {/* Data Flow Diagram */}
        <ErrorBoundary>
          <DataFlowDiagram />
        </ErrorBoundary>

        {/* Community Impact */}
        <ErrorBoundary>
          <CommunityImpact project={project} />
        </ErrorBoundary>
      </div>
    </PageTransition>
  )
}
