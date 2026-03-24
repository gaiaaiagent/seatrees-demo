import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const [summaryResult, projectsResult, recentTxResult] = await Promise.all([
      query(`
        SELECT
          (SELECT COUNT(*) FROM projects)::int AS total_projects,
          (SELECT COUNT(DISTINCT ecosystem_id) FROM projects)::int AS total_ecosystems,
          (SELECT COALESCE(SUM(total_retired), 0) FROM credits)::int AS total_blocks_retired,
          (SELECT COALESCE(SUM(amount_usd), 0) FROM transactions) AS total_revenue,
          (SELECT COALESCE(SUM(trees_planted), 0) FROM projects)::int AS total_trees
      `),
      query(`
        SELECT p.*, e.name AS ecosystem_name, e.color AS ecosystem_color,
          COALESCE(c.total_issued, 0)::int AS total_credits_issued,
          COALESCE(c.total_retired, 0)::int AS total_credits_retired,
          COALESCE(t.tx_count, 0)::int AS transaction_count,
          COALESCE(t.revenue, 0) AS total_revenue
        FROM projects p
        JOIN ecosystems e ON e.id = p.ecosystem_id
        LEFT JOIN LATERAL (
          SELECT SUM(total_issued) AS total_issued, SUM(total_retired) AS total_retired
          FROM credits WHERE project_id = p.id
        ) c ON true
        LEFT JOIN LATERAL (
          SELECT COUNT(*) AS tx_count, SUM(amount_usd) AS revenue
          FROM transactions WHERE project_id = p.id
        ) t ON true
        ORDER BY t.revenue DESC NULLS LAST
      `),
      query(`
        SELECT t.*, p.name AS project_name, p.slug AS project_slug
        FROM transactions t JOIN projects p ON p.id = t.project_id
        ORDER BY t.transaction_date DESC LIMIT 10
      `),
    ])

    return NextResponse.json({
      ...summaryResult.rows[0],
      projects: projectsResult.rows,
      recent_transactions: recentTxResult.rows,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
