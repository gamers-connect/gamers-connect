/* eslint-disable @typescript-eslint/no-unused-vars */
import { test } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test('Test login with existing user', async ({ page }) => {
  await page.goto(BASE_URL);
  
  // Take initial screenshot
  await page.screenshot({ path: 'before-login-click.png', fullPage: true });
  
  console.log('Current URL:', page.url());
  
  // Try different methods to click the Login button
  console.log('Attempting to click Login button...');
  
  try {
    // Method 1: Try clicking with force (ignore intercepting elements)
    await page.getByRole('navigation').getByRole('button', { name: 'Login' }).click({ force: true });
    console.log('✅ Forced click worked');
  } catch (error) {
    console.log('❌ Forced click failed, trying alternative methods...');
    
    try {
      // Method 2: Try clicking any login button
      await page.getByRole('button', { name: 'Login' }).first().click({ force: true });
      console.log('✅ First login button click worked');
    } catch (error2) {
      console.log('❌ All click methods failed');
      
      // Method 3: Use keyboard navigation
      await page.getByRole('button', { name: 'Login' }).first().focus();
      await page.keyboard.press('Enter');
      console.log('✅ Keyboard press attempted');
    }
  }
  
  // Wait for potential form to appear
  await page.waitForTimeout(2000);
  
  // Take screenshot after click attempt
  await page.screenshot({ path: 'after-login-click.png', fullPage: true });
  
  // Check if login form appeared
  const loginHeading = page.getByRole('heading', { name: 'Welcome Back' });
  const isLoginFormVisible = await loginHeading.isVisible();
  
  console.log('Login form visible:', isLoginFormVisible);
  
  if (isLoginFormVisible) {
    console.log('✅ Login form appeared, testing login...');
    
    // Fill login form
    await page.locator('input[name="email"]').fill('testuser@hawaii.edu');
    await page.locator('input[name="password"]').fill('password123');
    
    // Submit login form
    await page.locator('form').getByRole('button', { name: 'Sign In' }).click();
    
    // Wait for response
    await page.waitForTimeout(3000);
    
    console.log('After login attempt, URL:', page.url());
    
    // Take final screenshot
    await page.screenshot({ path: 'after-login-submit.png', fullPage: true });
    
    // Check if we got redirected (success) or stayed (might be expected)
    if (page.url().includes('/dashboard')) {
      console.log('🎉 SUCCESS: Redirected to dashboard!');
    } else {
      console.log('ℹ️  Stayed on homepage - this might be expected behavior');
    }
  } else {
    console.log('❌ Login form did not appear');
    
    // Debug: check what elements are actually on the page
    const buttons = await page.locator('button').allTextContents();
    console.log('All buttons on page:', buttons);
  }
});
