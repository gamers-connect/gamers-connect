import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test('Test database connection by creating a user', async ({ page }) => {
  await page.goto(BASE_URL);
  
  // Click Sign Up to show the form
  await page.getByRole('button', { name: 'Sign Up' }).click();
  
  // Wait for form to appear
  await expect(page.getByRole('heading', { name: 'Join the Community' })).toBeVisible();
  
  // Fill out form with test data
  const uniqueUsername = `testuser${Date.now()}`;
  const uniqueEmail = `test${Date.now()}@example.com`;
  
  await page.locator('input[placeholder*="username" i], input[name="username"]').fill(uniqueUsername);
  await page.locator('input[type="email"], input[placeholder*="email" i]').fill(uniqueEmail);
  await page.locator('input[type="password"], input[placeholder*="password" i]').fill('testpassword123');
  
  // Submit the form
  await page.locator('form button[type="submit"], form button:has-text("Sign Up"), form button:has-text("Register")').click();
  
  // Wait for either success or error
  await page.waitForTimeout(3000);
  
  console.log('After signup attempt:');
  console.log('Current URL:', page.url());
  
  // Take a screenshot to see what happened
  await page.screenshot({ path: 'after-signup-attempt.png', fullPage: true });
  
  // Check if we got redirected to dashboard (success) or stayed on same page (error)
  if (page.url().includes('/dashboard')) {
    console.log('✅ Signup successful - redirected to dashboard');
  } else {
    console.log('❌ Signup failed - stayed on same page');
    
    // Look for any error messages
    const bodyText = await page.locator('body').textContent();
    console.log('Page content preview:', bodyText?.substring(0, 500));
  }
});
