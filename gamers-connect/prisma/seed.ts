import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create test user
  await prisma.user.upsert({
    where: { email: 'testuser@hawaii.edu' },
    update: {},
    create: {
      email: 'testuser@hawaii.edu',
      username: 'testuser',
      name: 'Test User',
      password: hashedPassword
    },
  });

  // Create test session
  await prisma.gamingSession.create({
    data: {
      title: 'Boss Raid',
      game: 'Elden Ring',
      description: 'Looking for co-op players',
      date: new Date('2025-08-05T18:00:00Z'),
      createdBy: {
        connect: { email: 'testuser@hawaii.edu' }
      }
    }
  });

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
