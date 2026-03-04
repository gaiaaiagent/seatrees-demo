import type { FastifyInstance } from 'fastify';
import { query } from '../db/client.js';

export default async function comparisonRoutes(server: FastifyInstance) {
  // GET /api/comparisons — all frameworks
  server.get('/api/comparisons', async (_request, reply) => {
    try {
      const { rows } = await query(`
        SELECT * FROM comparisons
        ORDER BY highlight DESC, framework_name ASC
      `);

      return reply.send(rows);
    } catch (err) {
      server.log.error(err);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
}
