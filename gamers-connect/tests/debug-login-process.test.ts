/* eslint-disable @typescript-eslint/no-unused-vars */
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
  
  page.on('response', async response => {
    if (response.url().includes('/api/auth/signin')) {
      try {
        const responseBody = await response.text();
        console.log('🔍 Signin API Response:', responseBody);
      } catch (e) {
        console.log('Could not read response body');
      }
    }
    
    responses.push({
      url: response.url(),
      status: response.status(),
      headers: response.headers()
    });
  });
  
  await page.goto(BASE_URL);
  
  console.log('=== PERFORMING LOGIN ===');
  
  // Clear previous requests
  requests.length = 0;
  responses.length = 0;
  
  // Perform login
  await page.getByRole('navigation').getByRole('button', { name: 'Login' }).click({ force: true });
  await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
  
  await page.locator('input[name="email"]').fill('testuser@hawaii.edu');
  await page.locator('input[name="password"]').fill('password123');
  
  await page.locator('form').getByRole('button', { name: 'Sign In' }).click();
  
  // Wait for login request to complete
  await page.waitForTimeout(3000);
  
  console.log('=== AFTER LOGIN ===');
  console.log('Current URL after login:', page.url());
  
  // Check what's in localStorage/sessionStorage
  const localStorage = await page.evaluate(() => {
    const items: any = {};
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key) {
        items[key] = window.localStorage.getItem(key);
      }
    }
    return items;
  });
  
  console.log('localStorage after login:', localStorage);
  
  const sessionStorage = await page.evaluate(() => {
    const items: any = {};
    for (let i = 0; i < window.sessionStorage.length; i++) {
      const key = window.sessionStorage.key(i);
      if (key) {
        items[key] = window.sessionStorage.getItem(key);
      }
    }
    return items;
  });
  
  console.log('sessionStorage after login:', sessionStorage);
  
  // Check cookies
  const cookies = await page.context().cookies();
  console.log('Cookies after login:', cookies);
  
  console.log('\n=== LOGIN API RESPONSES ===');
  const loginResponses = responses.filter(res => res.url.includes('/api/auth/signin'));
  loginResponses.forEach((res, i) => {
    console.log(`${i + 1}. Status: ${res.status} ${res.url}`);
  });
});
