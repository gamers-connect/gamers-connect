// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// One password for all demo users
const PASSWORD = 'test1234';

const STATUSES = ['ONLINE', 'AWAY', 'OFFLINE'];

const USERS = [
  { email: 'kazlck@hawaii.edu',   username: 'kaz',   name: 'Kazuki',   games: ['Valorant', 'Overwatch'], platforms: ['PC'] },
  { email: 'henryL@hawaii.edu',     username: 'henry',     name: 'Henry',    games: ['CS2'],                    platforms: ['PC', 'Xbox'] },
  { email: 'mayalck@hawaii.edu', username: 'maya', name: 'Maya',    games: ['Rocket League'],          platforms: ['PS5'] },
  { email: 'alliyah@hawaii.edu',   username: 'alliyah',   name: 'Alliyah',   games: ['LoL'],                    platforms: ['PC'] },
  { email: 'kellenok@hawaii.edu',    username: 'kenji',    name: 'Kellen',       games: ['Overwatch'],              platforms: ['PC'] },
  { email: 'elijah@hawaii.edu',  username: 'elijah',   name: 'Elijah',    games: ['Fortnite'],               platforms: ['Xbox'] },
  { email: 'ella@hawaii.edu',    username: 'ella',    name: 'Ella',    games: ['CS2', 'Valorant'],        platforms: ['PC'] },
  { email: 'hjng@hawaii.edu',   username: 'HJ',   name: 'Haojiang',   games: ['Valorant'],               platforms: ['PC'] },
  { email: 'michelle@hawaii.edu',   username: 'mmiy',   name: 'Michelle',    games: ['LoL'],                    platforms: ['PC', 'PS5'] },
  { email: 'nvoe@hawaii.edu',    username: 'nolphin',    name: 'Nathanael',     games: ['Rocket League'],          platforms: ['Switch'] },
  { email: 'vncem@hawaii.edu',    username: 'xenon',    name: 'Vince',    games: ['Overwatch'],              platforms: ['PC'] },
  { email: 'zach@example.com',     username: 'zach',     name: 'Zachary',      games: ['Fortnite'],               platforms: ['PS5'] },
];

function randStatus() {
  return STATUSES[Math.floor(Math.random() * STATUSES.length)];
}

async function main() {
  const hashed = await bcrypt.hash(PASSWORD, 10);

  await Promise.all(
    USERS.map(u =>
      prisma.user.upsert({
        where: { email: u.email },
        update: {}, // keep existing user if already present
        create: {
          email: u.email,
          username: u.username,
          name: u.name,
          password: hashed,
          games: u.games,
          platforms: u.platforms,
          status: randStatus(),
        },
      })
    )
  );

  console.log(`Seeded ${USERS.length} users. Login password for all: ${PASSWORD}`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
