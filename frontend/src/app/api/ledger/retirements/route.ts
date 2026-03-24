import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
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
