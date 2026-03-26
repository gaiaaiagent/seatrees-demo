import type { FastifyInstance } from 'fastify';
import { query } from '../db/client.js';

const REGEN_API = 'https://regen-api.polkachu.com';
const BATCH_DENOM = 'MBS01-001-20240601-20340531-001';
const CLASS_ID = 'MBS01';

export default async function ledgerRoutes(server: FastifyInstance) {
  // GET /api/ledger/retirements — live ledger with DB fallback
  server.get('/api/ledger/retirements', async (_request, reply) => {
    try {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(
          `${REGEN_API}/regen/ecocredit/v1/supply/${BATCH_DENOM}`,
          { signal: controller.signal }
        );
        clearTimeout(timeout);
        if (res.ok) {
          const data = await res.json();
          const retired = parseInt(data.retired_amount || '0', 10);
          const tradeable = parseInt(data.tradable_amount || '0', 10);
          return reply.send({
            source: 'live' as const,
            total_retired: retired,
            total_issued: retired + tradeable,
            batch_denom: BATCH_DENOM,
          });
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
        const timeout = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(
          `${REGEN_API}/regen/ecocredit/v1/batches-by-class/${CLASS_ID}`,
          { signal: controller.signal }
        );
        clearTimeout(timeout);
        if (res.ok) {
          const data = await res.json();
          const batches = await Promise.all(
            (data.batches || []).map(async (batch: { denom: string; project_id: string }) => {
              try {
                const supplyRes = await fetch(
                  `${REGEN_API}/regen/ecocredit/v1/supply/${batch.denom}`
                );
                if (supplyRes.ok) {
                  const supply = await supplyRes.json();
                  return {
                    batch_denom: batch.denom,
                    total_issued: parseInt(supply.tradable_amount || '0', 10) + parseInt(supply.retired_amount || '0', 10),
                    total_retired: parseInt(supply.retired_amount || '0', 10),
                  };
                }
              } catch { /* skip */ }
              return { batch_denom: batch.denom, total_issued: 0, total_retired: 0 };
            })
          );
          return reply.send({ source: 'live' as const, batches });
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
