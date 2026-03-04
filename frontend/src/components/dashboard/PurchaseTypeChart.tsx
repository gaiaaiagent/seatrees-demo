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
function renderLabel({ cx, cy, total }: { cx: number; cy: number; total: number }) {
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
      <tspan x={cx} dy="-0.4em" fill="#E2E8F0" fontSize="18" fontWeight="700" fontFamily="var(--font-mono)">
        {new Intl.NumberFormat().format(total)}
      </tspan>
      <tspan x={cx} dy="1.4em" fill="#94A3B8" fontSize="11">
        Total
      </tspan>
    </text>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomLegend({ payload }: any) {
  return (
    <div className="flex items-center justify-center gap-4 mt-2">
      {payload?.map((entry: any) => (
        <span key={entry.value} className="flex items-center gap-1.5 text-xs text-muted-foreground">
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
      <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
        No purchase data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={60}
          outerRadius={100}
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
          y="45%"
          textAnchor="middle"
          dominantBaseline="central"
        >
          <tspan
            x="50%"
            dy="-0.4em"
            fill="#E2E8F0"
            fontSize="18"
            fontWeight="700"
            fontFamily="var(--font-mono)"
          >
            {new Intl.NumberFormat().format(total)}
          </tspan>
          <tspan x="50%" dy="1.4em" fill="#94A3B8" fontSize="11">
            Total
          </tspan>
        </text>
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  )
}
