'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface TransactionRow {
  month: string
  count: number
  revenue: number
  blocks: number
  purchase_type: string
}

interface MonthlyData {
  month: string
  b2c: number
  b2b: number
}

interface TransactionChartProps {
  data: TransactionRow[]
}

function aggregateByMonth(rows: TransactionRow[]): MonthlyData[] {
  const map = new Map<string, { b2c: number; b2b: number }>()

  for (const row of rows) {
    const existing = map.get(row.month) || { b2c: 0, b2b: 0 }
    if (row.purchase_type === 'b2c') {
      existing.b2c += row.revenue
    } else if (row.purchase_type === 'b2b') {
      existing.b2b += row.revenue
    } else {
      existing.b2c += row.revenue
    }
    map.set(row.month, existing)
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month: formatMonth(month),
      b2c: Math.round(data.b2c),
      b2b: Math.round(data.b2b),
    }))
}

function formatMonth(m: string): string {
  const [year, month] = m.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[parseInt(month, 10) - 1]} ${year.slice(2)}`
}

function formatCurrency(v: number): string {
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`
  return `$${v}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const b2c = payload.find((p: any) => p.dataKey === 'b2c')?.value ?? 0
  const b2b = payload.find((p: any) => p.dataKey === 'b2b')?.value ?? 0
  return (
    <div className="rounded-lg border border-[var(--st-border)] bg-[var(--st-card)] p-3 text-xs shadow-lg">
      <p className="font-semibold mb-1 text-[var(--st-text)]">{label}</p>
      <p style={{ color: '#0e7490' }}>B2C: ${b2c.toLocaleString()}</p>
      <p style={{ color: '#10B981' }}>B2B: ${b2b.toLocaleString()}</p>
      <p className="text-[var(--st-text-muted)] mt-1 pt-1 border-t border-[var(--st-border)]">
        Total: ${(b2c + b2b).toLocaleString()}
      </p>
    </div>
  )
}

export function TransactionChart({ data }: TransactionChartProps) {
  const chartData = aggregateByMonth(data)

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[140px] text-[var(--st-text-muted)] text-sm">
        No transaction data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={140}>
      <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="gradB2C" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0e7490" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#0e7490" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradB2B" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#dbe5ec" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: '#6b7f93', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={formatCurrency}
          tick={{ fill: '#6b7f93', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="b2c"
          stackId="1"
          stroke="#0e7490"
          fill="url(#gradB2C)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="b2b"
          stackId="1"
          stroke="#10B981"
          fill="url(#gradB2B)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
