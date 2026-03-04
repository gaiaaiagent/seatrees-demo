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
      // untagged goes to b2c bucket
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
  // m is like "2024-10"
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
    <div className="rounded-lg border border-border bg-card p-3 text-xs shadow-lg">
      <p className="font-semibold mb-1">{label}</p>
      <p style={{ color: '#06B6D4' }}>B2C: ${b2c.toLocaleString()}</p>
      <p style={{ color: '#10B981' }}>B2B: ${b2b.toLocaleString()}</p>
      <p className="text-muted-foreground mt-1 pt-1 border-t border-border">
        Total: ${(b2c + b2b).toLocaleString()}
      </p>
    </div>
  )
}

export function TransactionChart({ data }: TransactionChartProps) {
  const chartData = aggregateByMonth(data)

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
        No transaction data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="gradB2C" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradB2B" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 10%)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: '#94A3B8', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={formatCurrency}
          tick={{ fill: '#94A3B8', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="b2c"
          stackId="1"
          stroke="#06B6D4"
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
