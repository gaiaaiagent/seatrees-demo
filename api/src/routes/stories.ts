import type { FastifyInstance } from 'fastify';
import { query } from '../db/client.js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function storyRoutes(server: FastifyInstance) {
  // GET /api/stories — with optional ?type filter
  server.get<{ Querystring: { type?: string } }>(
    '/api/stories',
    async (request, reply) => {
      try {
        const { type } = request.query;

        let sql = `SELECT * FROM stories`;
        const params: unknown[] = [];

        if (type && ['pmu', 'explainer', 'faq', 'comparison'].includes(type)) {
          sql += ` WHERE story_type = $1`;
          params.push(type);
        }

        sql += ` ORDER BY created_at DESC`;

        const { rows } = await query(sql, params);
        return reply.send(rows);
      } catch (err) {
        server.log.error(err);
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );

  // GET /api/stories/:id — single story by UUID
  server.get<{ Params: { id: string } }>(
    '/api/stories/:id',
    async (request, reply) => {
      try {
        const { id } = request.params;

        if (!UUID_RE.test(id)) {
          return reply.status(400).send({ error: 'Invalid story ID format' });
        }

        const { rows } = await query(
          `SELECT * FROM stories WHERE id = $1 LIMIT 1`,
          [id]
        );

        if (rows.length === 0) {
          return reply.status(404).send({ error: 'Story not found' });
        }

        return reply.send(rows[0]);
      } catch (err) {
        server.log.error(err);
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );
}
