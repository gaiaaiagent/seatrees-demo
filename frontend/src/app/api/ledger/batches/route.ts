import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
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
