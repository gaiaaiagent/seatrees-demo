import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

const REGEN_API = 'https://regen-api.polkachu.com'
const BATCH_DENOM = 'MBS01-001-20240601-20340531-001'

export async function GET() {
  // Try live query to Regen Ledger first
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const res = await fetch(
      `${REGEN_API}/regen/ecocredit/v1/supply/${BATCH_DENOM}`,
      { signal: controller.signal, next: { revalidate: 60 } }
    )
    clearTimeout(timeout)
    if (res.ok) {
      const data = await res.json()
      const retired = parseInt(data.retired_amount || '0', 10)
      const tradeable = parseInt(data.tradable_amount || '0', 10)
      const total_issued = retired + tradeable
      return NextResponse.json({
        source: 'live' as const,
        total_retired: retired,
        total_issued,
        batch_denom: BATCH_DENOM,
      })
    }
  } catch {
    // Fall through to cached
  }

  // Fallback to database cache
  try {
    const { rows } = await query<{ total_retired: number; total_issued: number }>(
      `SELECT SUM(total_retired)::int AS total_retired, SUM(total_issued)::int AS total_issued FROM credits`
    )
    return NextResponse.json({ source: 'cached' as const, ...rows[0] })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
