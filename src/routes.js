import { DogPostSchema } from './schemas.js';
import { dogDb } from './db.js';

export async function registerRoutes(fastify) {
  // Create post
  fastify.post('/api/posts', async (request, reply) => {
    try {
      const validation = DogPostSchema.safeParse(request.body);
      
      if (!validation.success) {
        return reply.code(400).send({ error: validation.error.format() });
      }

      const post = await dogDb.create(validation.data);
      return reply.code(201).send(post);
    } catch (error) {
      fastify.log.error(error);
      console.error("Detailed error:", error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Get all posts
  fastify.get('/api/posts', async (request, reply) => {
    try {
      const posts = await dogDb.findAll();
      return posts;
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Update post
  fastify.put('/api/posts/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const validation = DogPostSchema.safeParse(request.body);
      
      if (!validation.success) {
        return reply.code(400).send({ error: validation.error.format() });
      }

      const post = await dogDb.update(Number(id), validation.data);
      if (!post) {
        return reply.code(404).send({ error: 'Post not found' });
      }
      return post;
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Delete post
  fastify.delete('/api/posts/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const result = await dogDb.delete(Number(id));
      if (result.changes === 0) {
        return reply.code(404).send({ error: 'Post not found' });
      }
      return reply.code(204).send();
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Seed data route
  fastify.post('/api/seed', async (request, reply) => {
    try {
      await dogDb.seed();
      return { message: 'Database seeded successfully' };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
}