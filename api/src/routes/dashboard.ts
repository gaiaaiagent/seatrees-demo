import type { FastifyInstance } from 'fastify';
import { query } from '../db/client.js';

export default async function dashboardRoutes(server: FastifyInstance) {
  server.get('/api/dashboard', async (_request, reply) => {
    try {
      const [summaryResult, projectsResult, recentTxResult] = await Promise.all([
        // Query 1 — Summary stats
        query<{
          total_projects: number;
          total_ecosystems: number;
          total_blocks_retired: number;
          total_revenue: number;
          total_trees: number;
        }>(`
          SELECT
            (SELECT COUNT(*) FROM projects)::int AS total_projects,
            (SELECT COUNT(DISTINCT ecosystem_id) FROM projects)::int AS total_ecosystems,
            (SELECT COALESCE(SUM(total_retired), 0) FROM credits)::int AS total_blocks_retired,
            (SELECT COALESCE(SUM(amount_usd), 0) FROM transactions) AS total_revenue,
            (SELECT COALESCE(SUM(trees_planted), 0) FROM projects)::int AS total_trees
        `),

        // Query 2 — Projects with stats
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

        // Query 3 — Recent 10 transactions
        query(`
          SELECT t.*, p.name AS project_name, p.slug AS project_slug
          FROM transactions t JOIN projects p ON p.id = t.project_id
          ORDER BY t.transaction_date DESC LIMIT 10
        `),
      ]);

      const summary = summaryResult.rows[0];

      return reply.send({
        ...summary,
        projects: projectsResult.rows,
        recent_transactions: recentTxResult.rows,
      });
    } catch (err) {
      server.log.error(err);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
}
