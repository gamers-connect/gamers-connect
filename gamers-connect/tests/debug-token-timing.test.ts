/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// debug-token-timing.test.ts
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test('Debug token storage timing issue', async ({ page }) => {
  // Monitor all network activity
  const networkActivity: any[] = [];
  
  page.on('response', async (response) => {
    if (response.url().includes('/api/auth/signin')) {
      try {
        const responseText = await response.text();
        networkActivity.push({
          timestamp: Date.now(),
          url: response.url(),
          status: response.status(),
          body: responseText
        });
        console.log(`🔍 Signin API Response at ${Date.now()}:`, responseText);
      } catch (e) {
        console.log('Could not read signin response body');
      }
    }
  });
  
  // Monitor localStorage changes
  await page.addInitScript(() => {
    const originalSetItem = window.localStorage.setItem;
    window.localStorage.setItem = function(key, value) {
      if (key === 'auth_token') {
        console.log(`🔑 Token stored at ${Date.now()}: ${value.substring(0, 50)}...`);
        (window as any).tokenStoredAt = Date.now();
      }
      return originalSetItem.call(this, key, value);
    };
  });
  
  await page.goto(BASE_URL);
  
  console.log('=== STARTING LOGIN PROCESS ===');
  const startTime = Date.now();
  
  await page.getByRole('navigation').getByRole('button', { name: 'Login' }).click({ force: true });
  await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
  
  await page.locator('input[name="email"]').fill('testuser@hawaii.edu');
  await page.locator('input[name="password"]').fill('password123');
  
  console.log(`⏰ Submitting form at ${Date.now() - startTime}ms`);
  await page.locator('form').getByRole('button', { name: 'Sign In' }).click();
  
  // Check token storage every 500ms for 10 seconds
  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(500);
    
    const token = await page.evaluate(() => {
      return {
        authToken: window.localStorage.getItem('auth_token'),
        tokenStoredAt: (window as any).tokenStoredAt,
        currentTime: Date.now()
      };
    });
    
    const elapsed = Date.now() - startTime;
    
    if (token.authToken) {
      console.log(`✅ Token found at ${elapsed}ms after start`);
      if (token.tokenStoredAt) {
        console.log(`📅 Token was stored at ${token.tokenStoredAt - startTime}ms after start`);
      }
      break;
    } else {
      console.log(`⏳ No token yet at ${elapsed}ms`);
    }
  }
  
  // Final check
  const finalToken = await page.evaluate(() => {
    return window.localStorage.getItem('auth_token');
  });
  
  console.log('\n=== FINAL RESULTS ===');
  console.log('Token found:', !!finalToken);
  console.log('Network activity:', networkActivity.length, 'signin responses');
  
  networkActivity.forEach((activity, i) => {
    console.log(`${i + 1}. ${activity.status} at ${activity.timestamp - startTime}ms`);
  });
  
  if (!finalToken) {
    await page.screenshot({ path: 'token-timing-debug.png', fullPage: true });
    console.log('❌ No token stored - check token-timing-debug.png');
  }
});
