import type { FastifyInstance } from 'fastify';
import { query } from '../db/client.js';

export default async function projectRoutes(server: FastifyInstance) {
  // GET /api/projects — all projects with ecosystem info and stats
  server.get('/api/projects', async (_request, reply) => {
    try {
      const { rows } = await query(`
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
      `);

      return reply.send(rows);
    } catch (err) {
      server.log.error(err);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // GET /api/projects/:slug — single project detail
  server.get<{ Params: { slug: string } }>(
    '/api/projects/:slug',
    async (request, reply) => {
      try {
        const { slug } = request.params;

        if (!slug || typeof slug !== 'string' || slug.length > 200) {
          return reply.status(400).send({ error: 'Invalid slug parameter' });
        }

        // Fetch project with ecosystem info
        const { rows: projectRows } = await query(
          `SELECT p.*, e.name AS ecosystem_name, e.color AS ecosystem_color
           FROM projects p
           JOIN ecosystems e ON e.id = p.ecosystem_id
           WHERE p.slug = $1 LIMIT 1`,
          [slug]
        );

        if (projectRows.length === 0) {
          return reply.status(404).send({ error: 'Project not found' });
        }

        const project = projectRows[0];

        // Fetch related data in parallel
        const [creditsResult, txResult, monitoringResult, verificationsResult] =
          await Promise.all([
            query(
              `SELECT * FROM credits WHERE project_id = $1 ORDER BY issued_at DESC`,
              [project.id]
            ),
            query(
              `SELECT * FROM transactions WHERE project_id = $1 ORDER BY transaction_date DESC`,
              [project.id]
            ),
            query(
              `SELECT * FROM monitoring WHERE project_id = $1 ORDER BY measured_at`,
              [project.id]
            ),
            query(
              `SELECT v.*
               FROM verifications v
               JOIN credits c ON c.id = v.credit_id
               WHERE c.project_id = $1
               ORDER BY v.attested_at`,
              [project.id]
            ),
          ]);

        return reply.send({
          ...project,
          credits: creditsResult.rows,
          transactions: txResult.rows,
          monitoring: monitoringResult.rows,
          verifications: verificationsResult.rows,
        });
      } catch (err) {
        server.log.error(err);
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );
}
