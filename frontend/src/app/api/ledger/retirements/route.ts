import { NextResponse } from 'next/server'

const SUPPLY_URL = 'https://regen.gaiaai.xyz/regen-api/ecocredits/classes/MBS01/supply'
const BATCH_DENOM = 'MBS01-001-20240601-20340531-001'

export async function GET() {
  try {
    const res = await fetch(SUPPLY_URL, {
      signal: AbortSignal.timeout(15000),
      next: { revalidate: 60 },
    })
    if (res.ok) {
      const json = await res.json()
      const supply = json.data?.supply ?? {}
      return NextResponse.json({
        source: 'live' as const,
        total_retired: supply.total_retired ?? 0,
        total_issued: supply.total_issued ?? 0,
        batch_denom: BATCH_DENOM,
      })
    }
  } catch {
    // Fall through to static fallback
  }

  return NextResponse.json({
    source: 'cached' as const,
    total_retired: 60369,
    total_issued: 300000,
    batch_denom: BATCH_DENOM,
  })
}
