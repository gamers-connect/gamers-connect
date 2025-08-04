import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test('Debug profile page structure', async ({ page }) => {
  console.log('=== LOGGING IN FIRST ===');
  
  await page.goto(BASE_URL);
  
  // Login first
  await page.getByRole('navigation').getByRole('button', { name: 'Login' }).click({ force: true });
  await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
  
  await page.locator('input[name="email"]').fill('testuser@hawaii.edu');
  await page.locator('input[name="password"]').fill('password123');
  await page.locator('form').getByRole('button', { name: 'Sign In' }).click();
  
  // Wait for token
  await page.waitForTimeout(3000);
  
  const token = await page.evaluate(() => window.localStorage.getItem('auth_token'));
  console.log('Auth token exists:', !!token);
  
  console.log('=== ACCESSING PROFILE PAGE ===');
  
  await page.goto(`${BASE_URL}/profile`);
  await page.waitForTimeout(3000);
  
  // Take screenshot
  await page.screenshot({ path: 'profile-structure-debug.png', fullPage: true });
  
  console.log('Profile page URL:', page.url());
  
  // Get all headings
  const allHeadings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
  console.log('All headings on profile page:', allHeadings);
  
  // Get all text content
  const bodyText = await page.locator('body').textContent();
  
  console.log('Page contains "profile" (case-insensitive):', /profile/i.test(bodyText || ''));
  console.log('Page contains "testuser@hawaii.edu":', bodyText?.includes('testuser@hawaii.edu'));
  console.log('Page contains "testuser":', bodyText?.includes('testuser'));
  console.log('Page contains "Test User":', bodyText?.includes('Test User'));
  console.log('Page contains loading:', bodyText?.includes('Loading'));
  console.log('Page contains error:', /error/i.test(bodyText || ''));
  
  // Check if it's a 404 or different page
  console.log('Is 404 page:', bodyText?.includes('404') || bodyText?.includes('not found'));
  
  // Get first 500 characters of page content
  console.log('Page content preview:', bodyText?.substring(0, 500));
  
  // Check for any forms or user input fields
  const inputs = await page.locator('input').count();
  console.log('Number of input fields:', inputs);
  
  // Check for user avatar or profile picture
  const images = await page.locator('img').count();
  console.log('Number of images:', images);
});
