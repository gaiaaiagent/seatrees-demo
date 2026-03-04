import Fastify from 'fastify';
import cors from '@fastify/cors';
import dashboardRoutes from './routes/dashboard.js';
import projectRoutes from './routes/projects.js';
import creditRoutes from './routes/credits.js';
import comparisonRoutes from './routes/comparisons.js';
import transactionRoutes from './routes/transactions.js';
import storyRoutes from './routes/stories.js';
import verificationRoutes from './routes/verifications.js';
import ledgerRoutes from './routes/ledger.js';

const server = Fastify({ logger: true });

await server.register(cors, {
  origin: [
    'http://localhost:3000',
    'https://seatrees.gaiaai.xyz',
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
  ],
});

server.get('/health', async () => ({ status: 'ok' }));

// Global error handler — prevents unhandled errors from crashing the server
server.setErrorHandler((error: Error & { statusCode?: number }, _request, reply) => {
  server.log.error(error);
  const statusCode = error.statusCode ?? 500;
  reply.status(statusCode).send({
    error: statusCode >= 500 ? 'Internal server error' : error.message,
  });
});

// Register route modules
await server.register(dashboardRoutes);
await server.register(projectRoutes);
await server.register(creditRoutes);
await server.register(comparisonRoutes);
await server.register(transactionRoutes);
await server.register(storyRoutes);
await server.register(verificationRoutes);
await server.register(ledgerRoutes);

const port = Number(process.env.PORT) || 4000;
await server.listen({ port, host: '0.0.0.0' });
console.log(`API running on port ${port}`);
