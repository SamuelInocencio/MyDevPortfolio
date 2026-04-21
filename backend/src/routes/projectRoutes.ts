import type { FastifyInstance } from 'fastify';
import { projectController } from '../controllers/projectController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

export async function projectRoutes(app: FastifyInstance) {
  app.get('/', projectController.list);
  app.get('/:id', projectController.getById);

  app.post('/', { preHandler: [authMiddleware] }, projectController.create);
  app.put('/:id', { preHandler: [authMiddleware] }, projectController.update);
  app.delete('/:id', { preHandler: [authMiddleware] }, projectController.remove);
}
