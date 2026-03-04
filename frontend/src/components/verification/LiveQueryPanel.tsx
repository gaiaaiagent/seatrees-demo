'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

interface RetirementResponse {
  source: 'live' | 'cached'
  total_retired: number
  total_issued: number
}

interface BatchResponse {
  source: 'live' | 'cached'
  batches: { batch_denom: string; total_issued: number; total_retired: number }[]
}

type QueryKey = 'retirements' | 'supply' | 'batches'

const QUERIES: Record<QueryKey, { label: string; endpoint: string; display: string }> = {
  retirements: {
    label: 'Total credits retired',
    endpoint: '/api/ledger/retirements',
    display: 'How many SeaTrees biodiversity credits have been retired on Regen Network?',
  },
  supply: {
    label: 'Total supply: issued vs retired',
    endpoint: '/api/ledger/retirements',
    display: 'What is the total supply of SeaTrees credits — issued versus retired?',
  },
  batches: {
    label: 'List all credit batches',
    endpoint: '/api/ledger/batches',
    display: 'List all SeaTrees MBCI credit batches on Regen Network ledger.',
  },
}

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number>(null)

  useEffect(() => {
    if (target === 0) { setValue(0); return }
    const start = performance.now()
    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [target, duration])

  return value
}

export function LiveQueryPanel() {
  const [activeQuery, setActiveQuery] = useState<QueryKey>('retirements')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    type: QueryKey
    data: RetirementResponse | BatchResponse
    queriedAt: Date
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showQueries, setShowQueries] = useState(false)

  const handleQuery = useCallback(async (queryKey?: QueryKey) => {
    const key = queryKey ?? activeQuery
    setActiveQuery(key)
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const q = QUERIES[key]
      if (key === 'batches') {
        const data = await api<BatchResponse>(q.endpoint)
        setResult({ type: key, data, queriedAt: new Date() })
      } else {
        const data = await api<RetirementResponse>(q.endpoint)
        setResult({ type: key, data, queriedAt: new Date() })
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Query failed')
    } finally {
      setLoading(false)
    }
  }, [activeQuery])

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {/* Terminal query box */}
      <div className="bg-[#050d1a] p-5 border-b border-white/5">
        <div className="flex items-center gap-2 mb-3">
          <div className="size-3 rounded-full bg-red-500/70" />
          <div className="size-3 rounded-full bg-amber-500/70" />
          <div className="size-3 rounded-full bg-emerald-500/70" />
          <span className="ml-2 text-xs text-muted-foreground font-mono">regen-query</span>
        </div>

        <div className="font-mono text-sm text-foreground/90 leading-relaxed">
          <span className="text-primary">$</span>{' '}
          <span className="text-foreground/70">{QUERIES[activeQuery].display}</span>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <Button
            onClick={() => handleQuery()}
            disabled={loading}
            className={`gap-2 ${!loading ? 'pulse-glow' : ''}`}
          >
            <Search className="size-4" />
            {loading ? 'Querying...' : 'Query Ledger'}
          </Button>

          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQueries(!showQueries)}
              className="gap-1 text-xs"
            >
              Other queries
              <ChevronDown className={`size-3 transition-transform ${showQueries ? 'rotate-180' : ''}`} />
            </Button>

            <AnimatePresence>
              {showQueries && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-1 z-10 min-w-[260px] rounded-md border bg-popover p-1 shadow-lg"
                >
                  {(Object.keys(QUERIES) as QueryKey[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        setShowQueries(false)
                        handleQuery(key)
                      }}
                      className={`w-full text-left text-xs px-3 py-2 rounded hover:bg-accent transition-colors ${
                        key === activeQuery ? 'text-primary' : 'text-foreground/80'
                      }`}
                    >
                      {QUERIES[key].label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Response area */}
      <div className="p-5 min-h-[120px]">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 text-muted-foreground"
            >
              <div className="flex gap-1">
                <motion.span
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: 0 }}
                  className="size-2 rounded-full bg-primary"
                />
                <motion.span
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}
                  className="size-2 rounded-full bg-primary"
                />
                <motion.span
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }}
                  className="size-2 rounded-full bg-primary"
                />
              </div>
              <span className="text-sm">Querying Regen Network ledger...</span>
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-destructive"
            >
              {error}
            </motion.div>
          )}

          {result && !loading && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {result.type === 'batches' ? (
                <BatchResult data={result.data as BatchResponse} queriedAt={result.queriedAt} />
              ) : result.type === 'supply' ? (
                <SupplyResult data={result.data as RetirementResponse} queriedAt={result.queriedAt} />
              ) : (
                <RetirementResult data={result.data as RetirementResponse} queriedAt={result.queriedAt} />
              )}
            </motion.div>
          )}

          {!loading && !error && !result && (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground"
            >
              Click &quot;Query Ledger&quot; to fetch live data from the Regen Network blockchain.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function RetirementResult({ data, queriedAt }: { data: RetirementResponse; queriedAt: Date }) {
  const animatedRetired = useCountUp(data.total_retired)
  return (
    <div className="space-y-4">
      <div className="flex items-end gap-6">
        <div>
          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Credits Retired</p>
          <p className="text-4xl font-bold font-mono tabular-nums text-primary">
            {new Intl.NumberFormat().format(animatedRetired)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Total Issued</p>
          <p className="text-lg font-mono tabular-nums text-foreground/70">
            {new Intl.NumberFormat().format(data.total_issued)}
          </p>
        </div>
      </div>
      <SourceMeta source={data.source} queriedAt={queriedAt} />
    </div>
  )
}

function SupplyResult({ data, queriedAt }: { data: RetirementResponse; queriedAt: Date }) {
  const animatedIssued = useCountUp(data.total_issued)
  const animatedRetired = useCountUp(data.total_retired)
  const tradeable = data.total_issued - data.total_retired
  const animatedTradeable = useCountUp(tradeable)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-6">
        <div>
          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Issued</p>
          <p className="text-2xl font-bold font-mono tabular-nums">
            {new Intl.NumberFormat().format(animatedIssued)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Retired</p>
          <p className="text-2xl font-bold font-mono tabular-nums text-primary">
            {new Intl.NumberFormat().format(animatedRetired)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Tradeable</p>
          <p className="text-2xl font-bold font-mono tabular-nums text-amber-400">
            {new Intl.NumberFormat().format(animatedTradeable)}
          </p>
        </div>
      </div>
      <SourceMeta source={data.source} queriedAt={queriedAt} />
    </div>
  )
}

function BatchResult({ data, queriedAt }: { data: BatchResponse; queriedAt: Date }) {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground uppercase tracking-wide border-b border-white/5">
              <th className="text-left py-2 pr-4">Batch Denom</th>
              <th className="text-right py-2 px-4">Issued</th>
              <th className="text-right py-2 pl-4">Retired</th>
            </tr>
          </thead>
          <tbody>
            {data.batches.map((batch) => (
              <tr key={batch.batch_denom} className="border-b border-white/5 last:border-0">
                <td className="py-2 pr-4 font-mono text-xs">
                  {batch.batch_denom.length > 40
                    ? `${batch.batch_denom.slice(0, 18)}...${batch.batch_denom.slice(-14)}`
                    : batch.batch_denom}
                </td>
                <td className="text-right py-2 px-4 font-mono">
                  {new Intl.NumberFormat().format(batch.total_issued)}
                </td>
                <td className="text-right py-2 pl-4 font-mono text-primary">
                  {new Intl.NumberFormat().format(batch.total_retired)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SourceMeta source={data.source} queriedAt={queriedAt} />
    </div>
  )
}

function SourceMeta({ source, queriedAt }: { source: 'live' | 'cached'; queriedAt: Date }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <Badge
        variant="secondary"
        className={
          source === 'live'
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 gap-1.5'
            : 'bg-amber-500/20 text-amber-400 border-amber-500/30 gap-1.5'
        }
      >
        <span
          className={`size-1.5 rounded-full ${
            source === 'live' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
          }`}
        />
        {source === 'live' ? 'Live' : 'Cached'}
      </Badge>
      <span className="text-xs text-muted-foreground font-mono">
        {queriedAt.toLocaleTimeString()}
      </span>
    </div>
  )
}
