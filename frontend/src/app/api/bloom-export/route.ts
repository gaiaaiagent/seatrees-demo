import { NextRequest, NextResponse } from 'next/server'

const BLOOM_EXPORT_URL = 'https://regen.gaiaai.xyz/seatrees/bloom-export'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const start = searchParams.get('start')
  const end = searchParams.get('end')

  if (!start || !end) {
    return NextResponse.json(
      { error: 'Both start and end date parameters are required (YYYY-MM-DD)' },
      { status: 400 }
    )
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 120000)
    const res = await fetch(
      `${BLOOM_EXPORT_URL}?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`,
      { signal: controller.signal }
    )
    clearTimeout(timeout)

    if (!res.ok) {
      return NextResponse.json(
        { error: `Bloom export returned ${res.status}` },
        { status: res.status }
      )
    }

    const csv = await res.text()
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="seatrees-bloom-export-${start}-to-${end}.csv"`,
      },
    })
  } catch (err) {
    console.error('Bloom export error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch Bloom export data' },
      { status: 502 }
    )
  }
}
