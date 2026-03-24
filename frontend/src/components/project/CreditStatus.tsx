'use client'

import { useState } from 'react'
import { RefreshCw, Copy, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { api } from '@/lib/api'
import type { Credit } from '@/types'

interface CreditStatusProps {
  credits: Credit[]
}

interface LedgerResponse {
  source: 'live' | 'cached'
  retirements: { batch_denom: string; total_retired: number }[]
}

export function CreditStatus({ credits }: CreditStatusProps) {
  const [refreshing, setRefreshing] = useState(false)
  const [source, setSource] = useState<'live' | 'cached' | null>(null)
  const [copied, setCopied] = useState(false)

  const credit = credits[0]

  if (!credit) {
    return (
      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide text-[var(--st-text-muted)]">
            Credit Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--st-text-muted)] text-center py-8">
            No credit data available.
          </p>
        </CardContent>
      </Card>
    )
  }

  const retiredPct =
    credit.total_issued > 0
      ? Math.min(100, Math.round((credit.total_retired / credit.total_issued) * 100))
      : 0

  async function handleRefresh() {
    setRefreshing(true)
    try {
      const res = await api<LedgerResponse>('/api/ledger/retirements')
      setSource(res.source)
    } catch {
      // silently fail, keep existing data
    } finally {
      setRefreshing(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(credit.batch_denom)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const truncatedDenom =
    credit.batch_denom.length > 30
      ? `${credit.batch_denom.slice(0, 14)}...${credit.batch_denom.slice(-12)}`
      : credit.batch_denom

  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-wide text-[var(--st-text-muted)]">
          Credit Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Batch Denom */}
        <div>
          <p className="text-xs text-[var(--st-text-muted)] mb-1">Batch Denom</p>
          <div className="flex items-center gap-2">
            <code className="font-mono text-xs bg-muted border border-[var(--st-border)] px-2 py-1 rounded text-[var(--st-text)]">
              {truncatedDenom}
            </code>
            <Button variant="ghost" size="icon-xs" onClick={handleCopy}>
              {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between text-xs text-[var(--st-text-muted)] mb-2">
            <span>Retired / Issued</span>
            <span className="font-mono">{retiredPct}%</span>
          </div>
          <Progress value={retiredPct} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-[var(--st-text-muted)]">Issued</p>
            <p className="font-mono text-sm font-semibold text-[var(--st-text)]">
              {new Intl.NumberFormat().format(credit.total_issued)}
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--st-text-muted)]">Retired</p>
            <p className="font-mono text-sm font-semibold text-[var(--st-text)]">
              {new Intl.NumberFormat().format(credit.total_retired)}
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--st-text-muted)]">Tradeable</p>
            <p className="font-mono text-sm font-semibold text-[var(--st-text)]">
              {new Intl.NumberFormat().format(credit.total_tradeable)}
            </p>
          </div>
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{credit.credit_class}</Badge>
          <Badge variant="outline">
            ${credit.price_per_block.toFixed(2)} / block
          </Badge>
          <Badge variant="outline">{credit.credit_length_years} years</Badge>
        </div>

        {/* Refresh */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`size-3 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh from Ledger
          </Button>
          {source && (
            <Badge
              variant="secondary"
              className={
                source === 'live'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }
            >
              {source === 'live' ? 'Live' : 'Cached'}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
