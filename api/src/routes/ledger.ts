import type { FastifyInstance } from 'fastify';
import { query } from '../db/client.js';

export default async function ledgerRoutes(server: FastifyInstance) {
  // GET /api/ledger/retirements — live ledger with DB fallback
  server.get('/api/ledger/retirements', async (_request, reply) => {
    try {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        const res = await fetch(
          `${process.env.REGEN_LEDGER_API}/retirements?class=MBCI`,
          { signal: controller.signal }
        );
        clearTimeout(timeout);
        if (res.ok) {
          const data = await res.json();
          return reply.send({ source: 'live' as const, ...data });
        }
        throw new Error('Non-OK');
      } catch {
        const { rows } = await query<{
          total_retired: number;
          total_issued: number;
        }>(
          `SELECT SUM(total_retired)::int AS total_retired, SUM(total_issued)::int AS total_issued FROM credits`
        );
        return reply.send({ source: 'cached' as const, ...rows[0] });
      }
    } catch (err) {
      server.log.error(err);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // GET /api/ledger/batches — live ledger with DB fallback
  server.get('/api/ledger/batches', async (_request, reply) => {
    try {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        const res = await fetch(
          `${process.env.REGEN_LEDGER_API}/batches?class=MBCI`,
          { signal: controller.signal }
        );
        clearTimeout(timeout);
        if (res.ok) {
          const data = await res.json();
          return reply.send({ source: 'live' as const, ...data });
        }
        throw new Error('Non-OK');
      } catch {
        const { rows } = await query(
          `SELECT c.*, p.name AS project_name, p.slug AS project_slug
           FROM credits c
           JOIN projects p ON p.id = c.project_id
           ORDER BY c.issued_at DESC`
        );
        return reply.send({ source: 'cached' as const, batches: rows });
      }
    } catch (err) {
      server.log.error(err);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
}
