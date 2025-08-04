import { test } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Test actual auth flow', () => {

  test('What happens when clicking Login button', async ({ page }) => {
    await page.goto(BASE_URL);
    
    console.log('Before clicking Login:');
    console.log('URL:', page.url());
    
    // Click the Login button
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Wait a moment for any changes
    await page.waitForTimeout(2000);
    
    console.log('After clicking Login:');
    console.log('URL:', page.url());
    
    // Take screenshot to see what appeared
    await page.screenshot({ path: 'after-login-click.png', fullPage: true });
    
    // Check if URL changed (navigated to a page)
    const urlChanged = !page.url().endsWith('/');
    console.log('URL changed:', urlChanged);
    
    // Check if any forms appeared
    const forms = await page.locator('form').count();
    console.log('Forms found after click:', forms);
    
    // Check if any modals appeared
    const modals = await page.locator('[role="dialog"], .modal, .popup').count();
    console.log('Modals found after click:', modals);
    
    // Look for email/password inputs
    const emailInputs = await page.locator('input[type="email"], input[placeholder*="email" i]').count();
    const passwordInputs = await page.locator('input[type="password"], input[placeholder*="password" i]').count();
    console.log('Email inputs found:', emailInputs);
    console.log('Password inputs found:', passwordInputs);
    
    // Log any headings that appeared
    const headings = await page.locator('h1, h2, h3').allTextContents();
    console.log('Headings after login click:', headings);
  });

  test('What happens when clicking Sign Up button', async ({ page }) => {
    await page.goto(BASE_URL);
    
    console.log('Before clicking Sign Up:');
    console.log('URL:', page.url());
    
    // Click the Sign Up button
    await page.getByRole('button', { name: 'Sign Up' }).click();
    
    // Wait a moment for any changes
    await page.waitForTimeout(2000);
    
    console.log('After clicking Sign Up:');
    console.log('URL:', page.url());
    
    // Take screenshot
    await page.screenshot({ path: 'after-signup-click.png', fullPage: true });
    
    // Check for forms and inputs
    const forms = await page.locator('form').count();
    console.log('Forms found after Sign Up click:', forms);
    
    const usernameInputs = await page.locator('input[placeholder*="username" i], input[name="username"]').count();
    const emailInputs = await page.locator('input[type="email"], input[placeholder*="email" i]').count();
    const passwordInputs = await page.locator('input[type="password"], input[placeholder*="password" i]').count();
    
    console.log('Username inputs:', usernameInputs);
    console.log('Email inputs:', emailInputs);
    console.log('Password inputs:', passwordInputs);
    
    // Log headings
    const headings = await page.locator('h1, h2, h3').allTextContents();
    console.log('Headings after signup click:', headings);
  });

  test('What happens when clicking Get Started Today', async ({ page }) => {
    await page.goto(BASE_URL);
    
    await page.getByRole('button', { name: 'Get Started Today' }).click();
    await page.waitForTimeout(2000);
    
    console.log('After clicking Get Started Today:');
    console.log('URL:', page.url());
    
    await page.screenshot({ path: 'after-get-started-click.png', fullPage: true });
    
    const headings = await page.locator('h1, h2, h3').allTextContents();
    console.log('Headings after get started click:', headings);
  });
});
