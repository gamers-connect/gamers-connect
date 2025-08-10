/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test('Debug login process in detail', async ({ page }) => {
  // Monitor all network requests
  const requests: any[] = [];
  const responses: any[] = [];
  
  page.on('request', request => {
    requests.push({
      url: request.url(),
      method: request.method(),
      headers: request.headers()
    });
  });
  
  page.on('response', response => {
    responses.push({
      url: response.url(),
      status: response.status(),
      headers: response.headers()
    });
  });
  
  await page.goto(BASE_URL);
  
  console.log('=== BEFORE LOGIN ===');
  console.log('Cookies before login:', await page.context().cookies());
  
  // Clear previous requests
  requests.length = 0;
  responses.length = 0;
  
  // Perform login
  await page.getByRole('navigation').getByRole('button', { name: 'Login' }).click({ force: true });
  await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
  
  await page.locator('input[name="email"]').fill('testuser@hawaii.edu');
  await page.locator('input[name="password"]').fill('password123');
  
  console.log('=== DURING LOGIN SUBMIT ===');
  await page.locator('form').getByRole('button', { name: 'Sign In' }).click();
  
  // Wait for login request to complete
  await page.waitForTimeout(3000);
  
  console.log('=== AFTER LOGIN ===');
  console.log('Cookies after login:', await page.context().cookies());
  console.log('Current URL after login:', page.url());
  
  // Check login-related requests
  console.log('\n=== LOGIN REQUESTS ===');
  const loginRequests = requests.filter(req => req.url.includes('/api/auth'));
  loginRequests.forEach((req, i) => {
    console.log(`${i + 1}. ${req.method} ${req.url}`);
  });
  
  console.log('\n=== LOGIN RESPONSES ===');
  const loginResponses = responses.filter(res => res.url.includes('/api/auth'));
  loginResponses.forEach((res, i) => {
    console.log(`${i + 1}. ${res.status} ${res.url}`);
    console.log(`   Set-Cookie: ${res.headers['set-cookie'] || 'None'}`);
  });
  
  // Now try to access dashboard
  console.log('\n=== ACCESSING DASHBOARD ===');
  requests.length = 0;
  responses.length = 0;
  
  await page.goto(`${BASE_URL}/dashboard`);
  await page.waitForTimeout(2000);
  
  console.log('Dashboard URL:', page.url());
  console.log('Cookies when accessing dashboard:', await page.context().cookies());
  
  // Check dashboard requests
  console.log('\n=== DASHBOARD REQUESTS ===');
  const dashboardRequests = requests.filter(req => req.url.includes('/dashboard') || req.url.includes('/api/'));
  dashboardRequests.forEach((req, i) => {
    console.log(`${i + 1}. ${req.method} ${req.url}`);
    console.log(`   Cookies: ${req.headers.cookie || 'None'}`);
  });
  
  // Check if any authentication verification requests are made
  const authCheckRequests = requests.filter(req => 
    req.url.includes('/api/auth') || 
    req.url.includes('verify') || 
    req.url.includes('session')
  );
  
  console.log('\n=== AUTH CHECK REQUESTS ===');
  authCheckRequests.forEach((req, i) => {
    console.log(`${i + 1}. ${req.method} ${req.url}`);
  });
  
  if (authCheckRequests.length === 0) {
    console.log('⚠️  No authentication verification requests found');
  }
  
  // Take final screenshot
  await page.screenshot({ path: 'login-debug-detailed.png', fullPage: true });
});