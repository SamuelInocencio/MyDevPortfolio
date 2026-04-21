import type { FastifyReply, FastifyRequest } from 'fastify';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { userModel } from '../models/userModel.js';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authController = {
  async login(request: FastifyRequest, reply: FastifyReply) {
    const parse = loginSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({
        message: 'Invalid payload',
        issues: parse.error.flatten(),
      });
    }

    const { email, password } = parse.data;

    const user = await userModel.findByEmail(email);
    if (!user) {
      return reply.status(401).send({ message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return reply.status(401).send({ message: 'Invalid credentials' });
    }

    const token = await reply.jwtSign(
      { sub: user.id, email: user.email, name: user.name },
      { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' },
    );

    return reply.send({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  },
};
