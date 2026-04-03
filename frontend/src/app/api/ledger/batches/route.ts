import { NextResponse } from 'next/server'

const SUPPLY_URL = 'https://regen.gaiaai.xyz/regen-api/ecocredits/classes/MBS01/supply'

export async function GET() {
  try {
    const res = await fetch(SUPPLY_URL, {
      signal: AbortSignal.timeout(15000),
      next: { revalidate: 60 },
    })
    if (res.ok) {
      const json = await res.json()
      const batches = (json.data?.batches ?? []).map((b: {
        denom: string
        project_id: string
        total_amount: number
        retired_amount: number
        tradable_amount: number
        start_date: string
        end_date: string
      }) => ({
        batch_denom: b.denom,
        project_id: b.project_id,
        total_issued: b.total_amount,
        total_retired: b.retired_amount,
        start_date: b.start_date,
        end_date: b.end_date,
      }))
      return NextResponse.json({ source: 'live' as const, batches })
    }
  } catch {
    // Fall through to static fallback
  }

  return NextResponse.json({
    source: 'cached' as const,
    batches: [
      {
        batch_denom: 'MBS01-001-20240601-20340531-001',
        project_id: 'MBS01-001',
        total_issued: 300000,
        total_retired: 60369,
        start_date: '2024-06-01',
        end_date: '2034-05-31',
      },
    ],
  })
}
