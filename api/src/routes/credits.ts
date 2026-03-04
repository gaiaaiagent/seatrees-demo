import type { FastifyInstance } from 'fastify';
import { query } from '../db/client.js';

export default async function creditRoutes(server: FastifyInstance) {
  // GET /api/credits — all credits with project info
  server.get('/api/credits', async (_request, reply) => {
    try {
      const { rows } = await query(`
        SELECT c.*, p.name AS project_name, p.slug AS project_slug
        FROM credits c
        JOIN projects p ON p.id = c.project_id
        ORDER BY c.issued_at DESC
      `);

      return reply.send(rows);
    } catch (err) {
      server.log.error(err);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // GET /api/credits/summary — aggregate credit stats
  server.get('/api/credits/summary', async (_request, reply) => {
    try {
      const { rows } = await query<{
        total_issued: number;
        total_retired: number;
        total_tradeable: number;
        unique_classes: number;
      }>(`
        SELECT
          COALESCE(SUM(total_issued), 0)::int AS total_issued,
          COALESCE(SUM(total_retired), 0)::int AS total_retired,
          COALESCE(SUM(total_tradeable), 0)::int AS total_tradeable,
          COUNT(DISTINCT credit_class)::int AS unique_classes
        FROM credits
      `);

      return reply.send(rows[0]);
    } catch (err) {
      server.log.error(err);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
}
