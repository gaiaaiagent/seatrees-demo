'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Monitoring } from '@/types'

interface MonitoringTimelineProps {
  data: Monitoring[]
}

const METRIC_CONFIG: Record<string, { color: string; label: string; yAxisId: string }> = {
  survival_rate: { color: '#10B981', label: 'Survival Rate', yAxisId: 'left' },
  canopy_cover: { color: '#0e7490', label: 'Canopy Cover', yAxisId: 'right' },
  invertebrate_density: { color: '#d97706', label: 'Invertebrate Density', yAxisId: 'right' },
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

interface ChartPoint {
  date: string
  dateRaw: string
  survival_rate?: number
  canopy_cover?: number
  invertebrate_density?: number
  [key: string]: string | number | undefined
}

function buildChartData(data: Monitoring[]): ChartPoint[] {
  const byDate = new Map<string, ChartPoint>()

  const sorted = [...data].sort(
    (a, b) => new Date(a.measured_at).getTime() - new Date(b.measured_at).getTime()
  )

  for (const m of sorted) {
    const key = m.measured_at.slice(0, 10)
    if (!byDate.has(key)) {
      byDate.set(key, { date: formatDate(m.measured_at), dateRaw: key })
    }
    const point = byDate.get(key)!
    point[m.metric_type] = m.value
  }

  return Array.from(byDate.values())
}

interface TooltipPayloadItem {
  dataKey: string
  value: number
  color: string
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg bg-[var(--st-card)] border border-[var(--st-border)] px-3 py-2 text-xs shadow-lg space-y-1">
      <p className="text-[var(--st-text-muted)] font-medium">{label}</p>
      {payload.map((entry) => {
        const cfg = METRIC_CONFIG[entry.dataKey]
        const val =
          entry.dataKey === 'survival_rate'
            ? `${(entry.value * 100).toFixed(1)}%`
            : entry.value?.toFixed(2)
        return (
          <p key={entry.dataKey} style={{ color: entry.color }}>
            {cfg?.label ?? entry.dataKey}: {val}
          </p>
        )
      })}
    </div>
  )
}

export function MonitoringTimeline({ data }: MonitoringTimelineProps) {
  const chartData = buildChartData(data)
  const metricTypes = [...new Set(data.map((d) => d.metric_type))]

  if (chartData.length === 0) {
    return (
      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide text-[var(--st-text-muted)]">
            BACI Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--st-text-muted)] text-center py-8">
            No monitoring data available yet.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-wide text-[var(--st-text-muted)]">
          BACI Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dbe5ec" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#6b7f93', fontSize: 12 }}
              axisLine={{ stroke: '#dbe5ec' }}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
              tick={{ fill: '#6b7f93', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 1]}
            />
            {metricTypes.some((t) => t !== 'survival_rate') && (
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: '#6b7f93', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
            )}
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, color: '#6b7f93' }}
              formatter={(value: string) => METRIC_CONFIG[value]?.label ?? value}
            />
            {metricTypes.map((type) => {
              const cfg = METRIC_CONFIG[type]
              return (
                <Line
                  key={type}
                  type="monotone"
                  dataKey={type}
                  yAxisId={cfg?.yAxisId ?? 'right'}
                  stroke={cfg?.color ?? '#6b7f93'}
                  strokeWidth={2}
                  dot={{ r: 3, fill: cfg?.color ?? '#6b7f93' }}
                  activeDot={{ r: 5 }}
                  connectNulls
                />
              )
            })}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
