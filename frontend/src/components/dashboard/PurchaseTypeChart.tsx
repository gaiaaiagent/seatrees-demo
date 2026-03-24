'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'

interface PurchaseSlice {
  name: string
  value: number
  color: string
}

interface PurchaseTypeChartProps {
  data: PurchaseSlice[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomLegend({ payload }: any) {
  return (
    <div className="flex items-center justify-center gap-4 mt-2">
      {payload?.map((entry: any) => (
        <span key={entry.value} className="flex items-center gap-1.5 text-xs text-[var(--st-text-muted)]">
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          {entry.value}
        </span>
      ))}
    </div>
  )
}

export function PurchaseTypeChart({ data }: PurchaseTypeChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-[140px] text-[var(--st-text-muted)] text-sm">
        No purchase data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={140}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="42%"
          innerRadius={35}
          outerRadius={58}
          paddingAngle={2}
          dataKey="value"
          strokeWidth={0}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        {/* Center label */}
        <text
          x="50%"
          y="42%"
          textAnchor="middle"
          dominantBaseline="central"
        >
          <tspan
            x="50%"
            dy="-0.3em"
            fill="#1a2b3d"
            fontSize="13"
            fontWeight="700"
            fontFamily="var(--font-mono)"
          >
            {new Intl.NumberFormat().format(total)}
          </tspan>
          <tspan x="50%" dy="1.2em" fill="#6b7f93" fontSize="9">
            Total
          </tspan>
        </text>
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  )
}
