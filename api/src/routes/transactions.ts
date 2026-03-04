import type { FastifyInstance } from 'fastify';
import { query } from '../db/client.js';

export default async function transactionRoutes(server: FastifyInstance) {
  // GET /api/transactions — with optional ?type=b2c|b2b filter
  server.get<{ Querystring: { type?: string } }>(
    '/api/transactions',
    async (request, reply) => {
      try {
        const { type } = request.query;

        let sql = `
          SELECT t.*, p.name AS project_name, p.slug AS project_slug
          FROM transactions t
          JOIN projects p ON p.id = t.project_id
        `;
        const params: unknown[] = [];

        if (type && ['b2c', 'b2b'].includes(type)) {
          sql += ` WHERE t.purchase_type = $1`;
          params.push(type);
        }

        sql += ` ORDER BY t.transaction_date DESC`;

        const { rows } = await query(sql, params);
        return reply.send(rows);
      } catch (err) {
        server.log.error(err);
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );

  // GET /api/transactions/summary — monthly aggregation
  server.get('/api/transactions/summary', async (_request, reply) => {
    try {
      const { rows } = await query(`
        SELECT
          DATE_TRUNC('month', transaction_date)::date AS month,
          COUNT(*)::int AS count,
          SUM(amount_usd) AS revenue,
          SUM(blocks_purchased)::int AS blocks,
          purchase_type
        FROM transactions
        GROUP BY month, purchase_type
        ORDER BY month
      `);

      return reply.send(rows);
    } catch (err) {
      server.log.error(err);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
}
