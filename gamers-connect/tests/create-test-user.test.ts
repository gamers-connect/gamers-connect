import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Helper function to seed and login test user
async function seedAndLogin(page) {
  console.log('⏳ Seeding test user...');
  
  // Navigate to home page
  await page.goto(BASE_URL);
  await page.waitForLoadState('networkidle');
  
  // Click Login button to open modal
  const loginButton = page.getByRole('button', { name: 'Login' });
  await expect(loginButton).toBeVisible({ timeout: 10000 });
  await loginButton.click();
  
  // Wait for login modal
  await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible({ timeout: 10000 });
  
  // Fill credentials
  await page.locator('input[name="email"]').fill('testuser@hawaii.edu');
  await page.locator('input[name="password"]').fill('password123');
  
  // Submit and wait for API response
  const submitButton = page.locator('form').getByRole('button', { name: 'Sign In' });
  
  // Wait for the signin API call
  const signinPromise = page.waitForResponse(response => 
    response.url().includes('/api/auth/signin') && response.status() === 200
  );
  
  await submitButton.click();
  await signinPromise;
  
  // Wait for auth token
  await page.waitForFunction(() => {
    return window.localStorage.getItem('auth_token') !== null;
  }, { timeout: 10000 });
  
  console.log('✅ Test user seeded.');
}

test.describe('Login Tests', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);
  });

  test('Login with seeded test user', async ({ page }) => {
    await seedAndLogin(page);
    
    // Navigate to dashboard manually (app doesn't auto-redirect)
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    
    // Wait for dashboard to load and look for the actual "Sessions" text
    // Based on debug output, this should be in "Your Gaming Sessions" heading
    await expect(page.getByRole('heading', { name: 'Your Gaming Sessions' })).toBeVisible({ timeout: 15000 });
    
    // Also verify the Sessions text exists somewhere on the page
    await expect(page.getByText('Sessions')).toBeVisible({ timeout: 5000 });
    
    console.log('✅ Login test complete. URL:', page.url());
  });
});
