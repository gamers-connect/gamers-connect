import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Login Tests', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);
  });

  test('Login with seeded test user', async ({ page }) => {
    console.log('🔄 Testing login with seeded user...');
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Click login button (opens modal, doesn't navigate)
    const loginButton = page.getByRole('button', { name: 'Login' });
    await expect(loginButton).toBeVisible({ timeout: 10000 });
    await loginButton.click();
    
    // Wait for login modal
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible({ timeout: 10000 });
    
    // Fill credentials
    await page.locator('input[name="email"]').fill('testuser@hawaii.edu');
    await page.locator('input[name="password"]').fill('password123');
    
    // Submit form and wait for API response instead of URL change
    const submitButton = page.locator('form').getByRole('button', { name: 'Sign In' });
    
    // Wait for the signin API call
    const signinPromise = page.waitForResponse(response => 
      response.url().includes('/api/auth/signin') && response.status() === 200
    );
    
    await submitButton.click();
    await signinPromise;
    
    // Wait for auth token to be stored
    await page.waitForFunction(() => {
      return window.localStorage.getItem('auth_token') !== null;
    }, { timeout: 10000 });
    
    console.log('✅ Login API successful, navigating to dashboard...');
    
    // Manually navigate to dashboard (app doesn't auto-redirect)
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    
    // Verify dashboard loaded with expected content
    await expect(page.getByRole('heading', { name: 'Your Gaming Sessions' })).toBeVisible({ timeout: 15000 });
    
    console.log('✅ Dashboard loaded successfully');
  });
});
