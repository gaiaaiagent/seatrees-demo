'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, FileSpreadsheet, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface BloomExportState {
  loading: boolean
  csv: string | null
  error: string | null
  fetchedAt: Date | null
}

function parseCsvToRows(csv: string): { headers: string[]; rows: string[][] } {
  const lines = csv.trim().split('\n')
  if (lines.length === 0) return { headers: [], rows: [] }
  const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim())
  const rows = lines.slice(1).map(line => {
    const cols: string[] = []
    let current = ''
    let inQuotes = false
    for (const ch of line) {
      if (ch === '"') { inQuotes = !inQuotes; continue }
      if (ch === ',' && !inQuotes) { cols.push(current.trim()); current = ''; continue }
      current += ch
    }
    cols.push(current.trim())
    return cols
  })
  return { headers, rows }
}

export function BloomExport() {
  const [startDate, setStartDate] = useState('2026-02-01')
  const [endDate, setEndDate] = useState('2026-02-28')
  const [state, setState] = useState<BloomExportState>({
    loading: false,
    csv: null,
    error: null,
    fetchedAt: null,
  })

  const fetchExport = useCallback(async () => {
    setState({ loading: true, csv: null, error: null, fetchedAt: null })
    try {
      const res = await fetch(`/api/bloom-export?start=${startDate}&end=${endDate}`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: 'Export failed' }))
        throw new Error(body.error || `HTTP ${res.status}`)
      }
      const csv = await res.text()
      setState({ loading: false, csv, error: null, fetchedAt: new Date() })
    } catch (e) {
      setState({
        loading: false,
        csv: null,
        error: e instanceof Error ? e.message : 'Export failed',
        fetchedAt: null,
      })
    }
  }, [startDate, endDate])

  const downloadCsv = useCallback(() => {
    if (!state.csv) return
    const blob = new Blob([state.csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `seatrees-bloom-export-${startDate}-to-${endDate}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [state.csv, startDate, endDate])

  const parsed = state.csv ? parseCsvToRows(state.csv) : null

  return (
    <div className="rounded-xl border border-[var(--st-border)] bg-[var(--st-card)] overflow-hidden shadow-[var(--shadow-card)]">
      {/* Header */}
      <div className="bg-[#1a2b3d] p-5 border-b border-[#2a3b4d]">
        <div className="flex items-center gap-2 mb-3">
          <FileSpreadsheet className="size-4 text-emerald-400" />
          <span className="text-sm font-medium text-gray-200">Bloom CSV Export</span>
          <Badge variant="secondary" className="bg-emerald-900/40 text-emerald-300 border-emerald-700/50 text-[10px]">
            Production API
          </Badge>
        </div>

        <p className="text-xs text-gray-400 mb-4">
          Export retirement data in Bloom-compatible CSV format for SeaTrees Salesforce integration.
          Powered by <span className="text-cyan-400">regen.gaiaai.xyz</span>
        </p>

        {/* Date range inputs */}
        <div className="flex items-end gap-3">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
          <Button
            onClick={fetchExport}
            disabled={state.loading}
            className="gap-2"
          >
            {state.loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="size-4" />
            )}
            {state.loading ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </div>

      {/* Results area */}
      <div className="p-5 min-h-[100px]">
        <AnimatePresence mode="wait">
          {state.loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 text-[var(--st-text-muted)]"
            >
              <div className="flex gap-1">
                <motion.span
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: 0 }}
                  className="size-2 rounded-full bg-emerald-500"
                />
                <motion.span
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}
                  className="size-2 rounded-full bg-emerald-500"
                />
                <motion.span
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }}
                  className="size-2 rounded-full bg-emerald-500"
                />
              </div>
              <span className="text-sm">Fetching Bloom export from production API...</span>
            </motion.div>
          )}

          {state.error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-destructive"
            >
              {state.error}
            </motion.div>
          )}

          {parsed && !state.loading && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {/* Summary row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1.5">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    {parsed.rows.length} retirement{parsed.rows.length !== 1 ? 's' : ''}
                  </Badge>
                  <span className="text-xs text-[var(--st-text-muted)]">
                    {parsed.headers.length} columns
                  </span>
                  {state.fetchedAt && (
                    <span className="text-xs text-[var(--st-text-muted)] font-mono">
                      {state.fetchedAt.toLocaleTimeString()}
                    </span>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={downloadCsv} className="gap-2">
                  <Download className="size-3" />
                  Download CSV
                </Button>
              </div>

              {/* CSV preview table */}
              <div className="overflow-x-auto rounded-lg border border-[var(--st-border)]">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[var(--st-sidebar)]">
                      {parsed.headers.slice(0, 10).map((h, i) => (
                        <th key={i} className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-[var(--st-text-muted)] font-medium whitespace-nowrap border-b border-[var(--st-border)]">
                          {h}
                        </th>
                      ))}
                      {parsed.headers.length > 10 && (
                        <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-[var(--st-text-muted)] font-medium border-b border-[var(--st-border)]">
                          +{parsed.headers.length - 10} more
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.rows.slice(0, 5).map((row, ri) => (
                      <tr key={ri} className="border-b border-[var(--st-border)] last:border-0 hover:bg-[var(--st-primary-pale)] transition-colors">
                        {row.slice(0, 10).map((cell, ci) => (
                          <td key={ci} className="py-1.5 px-3 font-mono text-[var(--st-text)] whitespace-nowrap max-w-[200px] truncate">
                            {cell || '-'}
                          </td>
                        ))}
                        {parsed.headers.length > 10 && (
                          <td className="py-1.5 px-3 text-[var(--st-text-muted)]">...</td>
                        )}
                      </tr>
                    ))}
                    {parsed.rows.length > 5 && (
                      <tr>
                        <td colSpan={Math.min(parsed.headers.length, 11)} className="py-2 px-3 text-center text-[var(--st-text-muted)]">
                          +{parsed.rows.length - 5} more rows (download for full data)
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {parsed.rows.length === 0 && (
                <p className="text-sm text-[var(--st-text-muted)] text-center py-4">
                  No retirements found in this date range. Try a different period.
                </p>
              )}
            </motion.div>
          )}

          {!state.loading && !state.error && !parsed && (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-[var(--st-text-muted)]"
            >
              Select a date range and click &quot;Export&quot; to generate a Bloom-compatible CSV for Salesforce import.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
