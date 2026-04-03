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
      const batches: { denom: string; project_id: string; total_amount: number; retired_amount: number; tradable_amount: number; start_date: string; end_date: string }[] = json.data?.batches ?? []
      const credits = batches.map((b) => ({
        id: b.denom,
        project_id: b.project_id,
        batch_denom: b.denom,
        total_issued: b.total_amount,
        total_retired: b.retired_amount,
        total_tradeable: b.tradable_amount,
        credit_class: 'MBS01',
        price_per_block: 3,
        credit_length_years: 10,
        issued_at: '2024-10-19T00:00:00Z',
      }))
      return NextResponse.json(credits)
    }
  } catch {
    // Fall through to static fallback
  }

  return NextResponse.json([
    {
      id: 'MBS01-001-20240601-20340531-001',
      project_id: 'MBS01-001',
      batch_denom: 'MBS01-001-20240601-20340531-001',
      total_issued: 300000,
      total_retired: 60369,
      total_tradeable: 239631,
      credit_class: 'MBS01',
      price_per_block: 3,
      credit_length_years: 10,
      issued_at: '2024-10-19T00:00:00Z',
    },
  ])
}
