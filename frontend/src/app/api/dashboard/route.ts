import { NextResponse } from 'next/server'

const SUPPLY_URL = 'https://regen.gaiaai.xyz/regen-api/ecocredits/classes/MBS01/supply'

export async function GET() {
  let totalRetired = 60369
  let totalIssued = 300000

  try {
    const res = await fetch(SUPPLY_URL, {
      signal: AbortSignal.timeout(10000),
      next: { revalidate: 60 },
    })
    if (res.ok) {
      const json = await res.json()
      const supply = json.data?.supply ?? {}
      totalRetired = supply.total_retired ?? totalRetired
      totalIssued = supply.total_issued ?? totalIssued
    }
  } catch {
    // use fallback values
  }

  return NextResponse.json({
    total_projects: 1,
    total_ecosystems: 1,
    total_blocks_retired: totalRetired,
    total_revenue: Math.round(totalRetired * 3),
    total_trees: 190000,
    projects: [
      {
        id: 'marereni-001',
        name: 'Marereni, Kenya',
        slug: 'marereni-kenya',
        ecosystem_id: 'mangrove',
        ecosystem_name: 'Mangrove',
        ecosystem_color: '#2d6a4f',
        region: 'Kilifi County',
        country: 'Kenya',
        partner: 'COBEC',
        lat: -2.98,
        lng: 40.22,
        trees_planted: 190000,
        survival_rate: 0.80,
        species_count: 4,
        hectares: 120,
        year_started: 2022,
        status: 'active',
        total_credits_issued: totalIssued,
        total_credits_retired: totalRetired,
        transaction_count: 0,
        total_revenue: Math.round(totalRetired * 3),
      },
    ],
    recent_transactions: [],
  })
}
