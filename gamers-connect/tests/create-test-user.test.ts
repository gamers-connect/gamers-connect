import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test('Create specific test user for signin tests', async ({ page }) => {
  await page.goto(BASE_URL);
  
  // Click the FIRST Sign Up button (in navigation) to show the form
  await page.getByRole('navigation').getByRole('button', { name: 'Sign Up' }).click();
  
  // Wait for form
  await expect(page.getByRole('heading', { name: 'Join the Community' })).toBeVisible();
  
  // Create the EXACT test user that signin tests expect
  await page.locator('input[name="name"]').fill('Test User');
  await page.locator('input[name="username"]').fill('testuser');
  await page.locator('input[name="email"]').fill('testuser@hawaii.edu');
  await page.locator('input[name="password"]').fill('password123');
  
  // Click the submit button (the one inside the form)
  await page.locator('form').getByRole('button', { name: 'Sign Up' }).click();
  
  // Wait and check what happens
  await page.waitForTimeout(3000);
  
  console.log('Test user creation completed');
  console.log('Final URL:', page.url());
  
  // Check if user was created by trying to login immediately
  console.log('Testing login with created user...');
  
  // Click Login button
  await page.getByRole('navigation').getByRole('button', { name: 'Login' }).click();
  
  // Wait for login form
  await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
  
  // Fill login form
  await page.locator('input[name="email"]').fill('testuser@hawaii.edu');
  await page.locator('input[name="password"]').fill('password123');
  
  // Submit login
  await page.locator('form').getByRole('button', { name: 'Sign In' }).click();
  
  // Wait and see what happens
  await page.waitForTimeout(3000);
  
  console.log('After login attempt, URL:', page.url());
  
  // Take screenshot to see the result
  await page.screenshot({ path: 'after-test-login.png', fullPage: true });
});
