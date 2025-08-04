import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test('Check dashboard access without login', async ({ page }) => {
  console.log('Testing dashboard access without authentication...');
  
  // Try to access dashboard directly without logging in
  await page.goto(`${BASE_URL}/dashboard`);
  
  await page.waitForTimeout(2000);
  
  console.log('Dashboard URL:', page.url());
  
  // Take screenshot
  await page.screenshot({ path: 'dashboard-no-auth.png', fullPage: true });
  
  // Check what content is actually shown
  const headings = await page.locator('h1, h2, h3').allTextContents();
  console.log('Headings found:', headings);
  
  const bodyText = await page.locator('body').textContent();
  const isLoadingStuck = bodyText?.includes('Loading dashboard');
  const hasSessionsHeading = headings.some(h => h.includes('gaming sessions'));
  
  console.log('Is loading stuck:', isLoadingStuck);
  console.log('Has sessions heading:', hasSessionsHeading);
  
  if (isLoadingStuck) {
    console.log('❌ Dashboard is stuck in loading state - likely requires authentication');
  } else if (hasSessionsHeading) {
    console.log('✅ Dashboard loads without authentication');
  } else {
    console.log('ℹ️  Dashboard shows different content - might redirect or show login prompt');
  }
});

test('Check dashboard access with login', async ({ page }) => {
  console.log('Testing dashboard access with authentication...');
  
  await page.goto(BASE_URL);
  
  // Login first
  await page.getByRole('navigation').getByRole('button', { name: 'Login' }).click({ force: true });
  await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
  
  await page.locator('input[name="email"]').fill('testuser@hawaii.edu');
  await page.locator('input[name="password"]').fill('password123');
  await page.locator('form').getByRole('button', { name: 'Sign In' }).click();
  
  // Wait for login to process
  await page.waitForTimeout(3000);
  
  console.log('After login, URL:', page.url());
  
  // Now try dashboard
  await page.goto(`${BASE_URL}/dashboard`);
  await page.waitForTimeout(2000);
  
  console.log('Dashboard with auth, URL:', page.url());
  
  // Take screenshot
  await page.screenshot({ path: 'dashboard-with-auth.png', fullPage: true });
  
  // Check content
  const headings = await page.locator('h1, h2, h3').allTextContents();
  console.log('Headings with auth:', headings);
  
  const bodyText = await page.locator('body').textContent();
  const isLoadingStuck = bodyText?.includes('Loading dashboard');
  const hasSessionsHeading = headings.some(h => h.includes('gaming sessions'));
  
  console.log('Is loading stuck with auth:', isLoadingStuck);
  console.log('Has sessions heading with auth:', hasSessionsHeading);
});