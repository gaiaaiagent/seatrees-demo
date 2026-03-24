import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const { rows } = await query(`
      SELECT
        DATE_TRUNC('month', transaction_date)::date AS month,
        COUNT(*)::int AS count,
        SUM(amount_usd) AS revenue,
        SUM(blocks_purchased)::int AS blocks,
        purchase_type
      FROM transactions
      GROUP BY month, purchase_type
      ORDER BY month
    `)
    return NextResponse.json(rows)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
