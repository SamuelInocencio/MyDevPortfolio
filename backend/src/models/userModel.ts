import { prismaPostgres } from '../lib/prismaPostgres.js';

export const userModel = {
  findByEmail(email: string) {
    return prismaPostgres.user.findUnique({ where: { email } });
  },

  findById(id: string) {
    return prismaPostgres.user.findUnique({ where: { id } });
  },

  create(data: { name: string; email: string; password: string }) {
    return prismaPostgres.user.create({ data });
  },
};
