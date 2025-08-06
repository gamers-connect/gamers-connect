import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.beforeAll(async () => {
  console.log('⏳ Seeding test user...');

  // Hash password exactly like your auth system does
  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: 'testuser@hawaii.edu' },
    update: {}, // no update needed for this test
    create: {
      name: 'Test User',
      username: 'testuser',
      email: 'testuser@hawaii.edu',
      password: hashedPassword,
    },
  });

  console.log('✅ Test user seeded.');
});

test('Login with seeded test user', async ({ page }) => {
  await page.goto(BASE_URL);

  // Click Login button
  await page.getByRole('navigation').getByRole('button', { name: 'Login' }).click();

  // Wait for login form
  await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();

  // Fill login form
  await page.locator('input[name="email"]').fill('testuser@hawaii.edu');
  await page.locator('input[name="password"]').fill('password123');

  // Submit login
  await page.locator('form').getByRole('button', { name: 'Sign In' }).click();

  // Wait for redirect
  await page.waitForTimeout(3000);

  console.log('✅ Login test complete. URL:', page.url());

  // Optional: assert login worked (e.g. dashboard loaded)
  await expect(page.getByText('Sessions')).toBeVisible();
});
