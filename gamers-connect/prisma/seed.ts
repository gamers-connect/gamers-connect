import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create test user
  const user = await prisma.user.upsert({
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
  await prisma.session.create({
    data: {
      title: 'Boss Raid',
      game: 'Elden Ring',
      platform: 'PC', // Required field
      description: 'Looking for co-op players',
      date: new Date('2025-08-05T18:00:00Z'),
      time: '18:00', // Required field
      skillLevel: 'Intermediate',
      maxPlayers: 4,
      isPrivate: false,
      host: {
        connect: { email: 'testuser@hawaii.edu' }
      }
    }
  });

  // Create additional test sessions for variety
  await prisma.session.create({
    data: {
      title: 'Competitive Match',
      game: 'Valorant',
      platform: 'PC',
      description: 'Looking for skilled players for ranked matches',
      date: new Date('2025-08-06T20:00:00Z'),
      time: '20:00',
      skillLevel: 'Advanced',
      maxPlayers: 5,
      isPrivate: false,
      host: {
        connect: { email: 'testuser@hawaii.edu' }
      }
    }
  });

  await prisma.session.create({
    data: {
      title: 'Chill Co-op Session',
      game: 'Minecraft',
      platform: 'PC',
      description: 'Building and exploring together',
      date: new Date('2025-08-07T15:30:00Z'),
      time: '15:30',
      skillLevel: 'Beginner',
      maxPlayers: 8,
      isPrivate: true,
      host: {
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
