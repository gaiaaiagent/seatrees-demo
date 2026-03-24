import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const { rows } = await query(`
      SELECT c.batch_denom, p.name AS project_name, p.slug AS project_slug,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', v.id, 'stage', v.stage, 'party_name', v.party_name,
            'party_role', v.party_role, 'attestation_hash', v.attestation_hash,
            'attested_at', v.attested_at
          ) ORDER BY v.attested_at ASC
        ) AS chain
      FROM verifications v
      JOIN credits c ON c.id = v.credit_id
      JOIN projects p ON p.id = c.project_id
      GROUP BY c.id, c.batch_denom, p.name, p.slug
      HAVING COUNT(*) >= 2
      ORDER BY MAX(v.attested_at) DESC
    `)
    return NextResponse.json(rows)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
