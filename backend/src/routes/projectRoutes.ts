import type { FastifyInstance } from 'fastify';
import { projectController } from '../controllers/projectController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

type IdParams = { Params: { id: string } };

export async function projectRoutes(app: FastifyInstance) {
  app.get('/', projectController.list);
  app.get<IdParams>('/:id', projectController.getById);

  app.post('/', { preHandler: [authMiddleware] }, projectController.create);
  app.put<IdParams>('/:id', { preHandler: [authMiddleware] }, projectController.update);
  app.delete<IdParams>('/:id', { preHandler: [authMiddleware] }, projectController.remove);
}
