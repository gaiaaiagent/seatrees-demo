import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!slug || slug.length > 200) {
      return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
    }

    const { rows: projectRows } = await query(
      `SELECT p.*, e.name AS ecosystem_name, e.color AS ecosystem_color
       FROM projects p
       JOIN ecosystems e ON e.id = p.ecosystem_id
       WHERE p.slug = $1 LIMIT 1`,
      [slug]
    )

    if (projectRows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const project = projectRows[0]

    const [creditsResult, txResult, monitoringResult, verificationsResult] =
      await Promise.all([
        query(`SELECT * FROM credits WHERE project_id = $1 ORDER BY issued_at DESC`, [project.id]),
        query(`SELECT * FROM transactions WHERE project_id = $1 ORDER BY transaction_date DESC`, [project.id]),
        query(`SELECT * FROM monitoring WHERE project_id = $1 ORDER BY measured_at`, [project.id]),
        query(
          `SELECT v.* FROM verifications v JOIN credits c ON c.id = v.credit_id WHERE c.project_id = $1 ORDER BY v.attested_at`,
          [project.id]
        ),
      ])

    return NextResponse.json({
      ...project,
      credits: creditsResult.rows,
      transactions: txResult.rows,
      monitoring: monitoringResult.rows,
      verifications: verificationsResult.rows,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
