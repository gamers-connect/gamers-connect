/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test('Test clicking different buttons in signup form', async ({ page }) => {
  await page.goto(BASE_URL);
  
  // Monitor all network requests
  const requests: any[] = [];
  page.on('request', request => {
    requests.push({
      url: request.url(),
      method: request.method(),
      postData: request.postData()
    });
  });
  
  // Monitor console logs
  page.on('console', msg => {
    console.log(`Console [${msg.type()}]:`, msg.text());
  });
  
  // Click Sign Up to show the form
  await page.getByRole('button', { name: 'Sign Up' }).click();
  
  // Wait for form to appear
  await expect(page.getByRole('heading', { name: 'Join the Community' })).toBeVisible();
  
  // Fill out the form
  await page.locator('input[placeholder*="username" i], input[name="username"]').fill('testuser123');
  await page.locator('input[type="email"], input[placeholder*="email" i]').fill('test@example.com');
  await page.locator('input[type="password"], input[placeholder*="password" i]').fill('password123');
  
  console.log('Form filled out, now testing different button click methods...');
  
  // Clear previous requests
  requests.length = 0;
  
  // Try different ways to submit the form
  
  // Method 1: Try clicking any button with type="submit"
  const submitButtons = await page.locator('form button[type="submit"]').count();
  if (submitButtons > 0) {
    console.log('\nMethod 1: Clicking button[type="submit"]');
    await page.locator('form button[type="submit"]').first().click();
    await page.waitForTimeout(2000);
    console.log('Requests after submit button click:', requests.length);
  }
  
  // Method 2: Try clicking any button containing "Sign Up" text
  const signUpButtons = await page.locator('form button:has-text("Sign Up")').count();
  if (signUpButtons > 0 && requests.length === 0) {
    console.log('\nMethod 2: Clicking button with "Sign Up" text');
    await page.locator('form button:has-text("Sign Up")').first().click();
    await page.waitForTimeout(2000);
    console.log('Requests after Sign Up button click:', requests.length);
  }
  
  // Method 3: Try pressing Enter on the form
  if (requests.length === 0) {
    console.log('\nMethod 3: Pressing Enter on form');
    await page.locator('form').press('Enter');
    await page.waitForTimeout(2000);
    console.log('Requests after Enter press:', requests.length);
  }
  
  // Method 4: Try clicking any button in the form
  const allButtons = await page.locator('form button').count();
  if (allButtons > 0 && requests.length === 0) {
    console.log('\nMethod 4: Clicking first button in form');
    await page.locator('form button').first().click();
    await page.waitForTimeout(2000);
    console.log('Requests after first button click:', requests.length);
  }
  
  console.log('\nAll network requests made:');
  requests.forEach((req, i) => {
    console.log(`${i + 1}. ${req.method} ${req.url}`);
    if (req.postData) {
      console.log(`   Data: ${req.postData.substring(0, 200)}`);
    }
  });
  
  console.log('\nFinal URL:', page.url());
});
