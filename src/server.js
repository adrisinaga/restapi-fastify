import Fastify from 'fastify';
import cors from '@fastify/cors';
import { registerRoutes } from './routes.js';

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: true
});

await registerRoutes(fastify);

try {
  await fastify.listen({ port: 3000, host: '0.0.0.0' });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}