import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

const REGEN_API = 'https://regen-api.polkachu.com'
const CLASS_ID = 'MBS01'

export async function GET() {
  // Try live query to Regen Ledger first
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const res = await fetch(
      `${REGEN_API}/regen/ecocredit/v1/batches-by-class/${CLASS_ID}`,
      { signal: controller.signal, next: { revalidate: 60 } }
    )
    clearTimeout(timeout)
    if (res.ok) {
      const data = await res.json()
      // Enrich batches with supply data
      const batches = await Promise.all(
        (data.batches || []).map(async (batch: { denom: string; project_id: string; start_date: string; end_date: string; issuance_date: string }) => {
          try {
            const supplyRes = await fetch(
              `${REGEN_API}/regen/ecocredit/v1/supply/${batch.denom}`,
              { signal: controller.signal }
            )
            if (supplyRes.ok) {
              const supply = await supplyRes.json()
              return {
                batch_denom: batch.denom,
                project_id: batch.project_id,
                total_issued: parseInt(supply.tradable_amount || '0', 10) + parseInt(supply.retired_amount || '0', 10),
                total_retired: parseInt(supply.retired_amount || '0', 10),
                start_date: batch.start_date,
                end_date: batch.end_date,
                issuance_date: batch.issuance_date,
              }
            }
          } catch { /* skip enrichment */ }
          return {
            batch_denom: batch.denom,
            project_id: batch.project_id,
            total_issued: 0,
            total_retired: 0,
            start_date: batch.start_date,
            end_date: batch.end_date,
            issuance_date: batch.issuance_date,
          }
        })
      )
      return NextResponse.json({ source: 'live' as const, batches })
    }
  } catch {
    // Fall through to cached
  }

  // Fallback to database cache
  try {
    const { rows } = await query(
      `SELECT c.*, p.name AS project_name, p.slug AS project_slug
       FROM credits c
       JOIN projects p ON p.id = c.project_id
       ORDER BY c.issued_at DESC`
    )
    return NextResponse.json({ source: 'cached' as const, batches: rows })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
