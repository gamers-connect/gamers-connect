/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test('Test dashboard with manually set auth token', async ({ page }) => {
  console.log('=== TESTING DASHBOARD WITH AUTH TOKEN ===');
  
  // First, perform login to get a valid token
  await page.goto(BASE_URL);
  
  await page.getByRole('navigation').getByRole('button', { name: 'Login' }).click({ force: true });
  await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
  
  await page.locator('input[name="email"]').fill('testuser@hawaii.edu');
  await page.locator('input[name="password"]').fill('password123');
  
  await page.locator('form').getByRole('button', { name: 'Sign In' }).click();
  await page.waitForTimeout(3000);
  
  // Get the token from localStorage
  const authToken = await page.evaluate(() => {
    return window.localStorage.getItem('auth_token');
  });
  
  console.log('Auth token retrieved:', authToken ? 'Token exists' : 'No token found');
  
  if (!authToken) {
    console.log('❌ No auth token found in localStorage');
    return;
  }
  
  // Now try to access dashboard
  console.log('=== ACCESSING DASHBOARD WITH TOKEN ===');
  
  // Monitor network requests to see if token is being sent
  const requests: any[] = [];
  page.on('request', request => {
    if (request.url().includes('/api/') || request.url().includes('/dashboard')) {
      requests.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
        authHeader: request.headers()['authorization']
      });
    }
  });
  
  await page.goto(`${BASE_URL}/dashboard`);
  await page.waitForTimeout(5000); // Wait longer to see if it loads
  
  console.log('Dashboard URL after navigation:', page.url());
  
  // Take screenshot
  await page.screenshot({ path: 'dashboard-with-token.png', fullPage: true });
  
  // Check what's actually on the page
  const bodyText = await page.locator('body').textContent();
  const isStillLoading = bodyText?.includes('Loading dashboard');
  const headings = await page.locator('h1, h2, h3').allTextContents();
  
  console.log('Is still loading:', isStillLoading);
  console.log('Headings found:', headings);
  
  // Check if any API requests were made from dashboard
  console.log('\n=== DASHBOARD API REQUESTS ===');
  requests.forEach((req, i) => {
    console.log(`${i + 1}. ${req.method} ${req.url}`);
    if (req.authHeader) {
      console.log(`   Authorization: ${req.authHeader}`);
    } else {
      console.log(`   Authorization: None`);
    }
  });
  
  if (requests.length === 0) {
    console.log('⚠️  No API requests made from dashboard - it might not be fetching data');
  }
  
  // Try manually calling an API that might need authentication
  console.log('\n=== TESTING MANUAL API CALL WITH TOKEN ===');
  
  const apiResponse = await page.evaluate(async (token) => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.text();
      return {
        status: response.status,
        body: result
      };
    } catch (error) {
      return {
        error: (error as Error).message
      };
    }
  }, authToken);
  
  console.log('API verify response:', apiResponse);
});