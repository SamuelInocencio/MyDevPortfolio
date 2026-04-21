import 'dotenv/config';
import { PrismaClient } from '../../node_modules/.prisma/postgres-client/index.js';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@portfolio.dev';
  const name = process.env.SEED_ADMIN_NAME ?? 'Admin';
  const plainPassword = process.env.SEED_ADMIN_PASSWORD ?? 'admin123';

  const passwordHash = await bcrypt.hash(plainPassword, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      password: passwordHash,
    },
    create: {
      email,
      name,
      password: passwordHash,
    },
  });

  console.log(`[seed] admin ready: ${user.email}`);
}

main()
  .catch((err) => {
    console.error('[seed] error', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
