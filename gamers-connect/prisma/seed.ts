import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: 'testuser@hawaii.edu' },
    update: {},
    create: {
      email: 'testuser@hawaii.edu',
      password: hashedPassword,
      name: 'Test User',
    },
  });

  console.log('✅ Test user seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
