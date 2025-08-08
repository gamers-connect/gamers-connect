import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TEST_USER = {
  email: 'testuser@hawaii.edu',
  password: 'password123',
};

test('Login with seeded test user', async ({ page }) => {
  await page.goto(BASE_URL);

  await page.getByRole('navigation').getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('heading', { name: /Welcome Back/i })).toBeVisible();

  await page.locator('input[name="email"]').fill(TEST_USER.email);
  await page.locator('input[name="password"]').fill(TEST_USER.password);

  await Promise.all([
    page.waitForURL(`${BASE_URL}/dashboard`),
    page.locator('form').getByRole('button', { name: /Sign In/i }).click(),
  ]);

  await expect(page.locator('h1', { hasText: 'Sessions' })).toBeVisible();
});
