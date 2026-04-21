import type { FastifyInstance } from 'fastify';
import { authController } from '../controllers/authController.js';

export async function authRoutes(app: FastifyInstance) {
  app.post('/login', authController.login);
}
