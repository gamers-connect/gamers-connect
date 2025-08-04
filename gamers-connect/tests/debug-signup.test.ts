/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test('Debug signup API directly', async ({ page }) => {
  await page.goto(BASE_URL);
  
  // Monitor network requests to see what's happening
  const responses: any[] = [];
  page.on('response', response => {
    if (response.url().includes('/api/')) {
      responses.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
    }
  });
  
  // Monitor console logs for errors
  page.on('console', msg => {
    console.log(`Browser console [${msg.type()}]:`, msg.text());
  });
  
  // Monitor page errors
  page.on('pageerror', error => {
    console.log('Page error:', error.message);
  });
  
  // Click Sign Up to show the form
  await page.getByRole('button', { name: 'Sign Up' }).click();
  
  // Wait for form to appear
  await expect(page.getByRole('heading', { name: 'Join the Community' })).toBeVisible();
  
  // Fill out form
  const uniqueUsername = `testuser${Date.now()}`;
  const uniqueEmail = `test${Date.now()}@example.com`;
  
  console.log(`Testing signup with username: ${uniqueUsername}, email: ${uniqueEmail}`);
  
  await page.locator('input[placeholder*="username" i], input[name="username"]').fill(uniqueUsername);
  await page.locator('input[type="email"], input[placeholder*="email" i]').fill(uniqueEmail);
  await page.locator('input[type="password"], input[placeholder*="password" i]').fill('testpassword123');
  
  // Submit the form and wait for network activity
  await Promise.all([
    page.waitForResponse(response => response.url().includes('/api/auth'), { timeout: 10000 }),
    page.locator('form button[type="submit"], form button:has-text("Sign Up"), form button:has-text("Register")').click()
  ]);
  
  // Wait a bit for any additional requests
  await page.waitForTimeout(2000);
  
  console.log('\nAPI Responses:');
  responses.forEach(response => {
    console.log(`${response.status} ${response.statusText} - ${response.url}`);
  });
  
  console.log('\nFinal URL:', page.url());
  
  // Check if there are any visible error messages on the page
  const errorSelectors = [
    'text=/error/i',
    'text=/failed/i',
    'text=/invalid/i',
    '[role="alert"]',
    '.error',
    '.alert'
  ];
  
  for (const selector of errorSelectors) {
    const errorElement = page.locator(selector);
    if (await errorElement.count() > 0) {
      const errorText = await errorElement.textContent();
      console.log(`Error found with selector "${selector}":`, errorText);
    }
  }
});