import { test } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Debug - Check actual page content', () => {
  
  test('Debug: Check what is actually on the dashboard page', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Take a screenshot to see what the page looks like
    await page.screenshot({ path: 'debug-dashboard.png', fullPage: true });
    
    // Print the page title and URL
    console.log('Page title:', await page.title());
    console.log('Current URL:', page.url());
    
    // Print all headings on the page
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    console.log('All headings found:', headings);
    
    // Print the page content (first 500 characters)
    const bodyText = await page.locator('body').textContent();
    console.log('Page content preview:', bodyText?.substring(0, 500));
  });

  test('Debug: Check signin page content', async ({ page }) => {
    await page.goto(`${BASE_URL}/signin`);
    
    await page.screenshot({ path: 'debug-signin.png', fullPage: true });
    
    console.log('Signin page title:', await page.title());
    console.log('Signin current URL:', page.url());
    
    // Check for form elements
    const inputs = await page.locator('input').all();
    console.log('Number of input fields found:', inputs.length);
    
    for (let i = 0; i < inputs.length; i++) {
      const placeholder = await inputs[i].getAttribute('placeholder');
      const type = await inputs[i].getAttribute('type');
      console.log(`Input ${i + 1}: type="${type}", placeholder="${placeholder}"`);
    }
    
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    console.log('Signin headings:', headings);
  });

  test('Debug: Check signup page content', async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);
    
    await page.screenshot({ path: 'debug-signup.png', fullPage: true });
    
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    console.log('Signup headings:', headings);
    
    const inputs = await page.locator('input').all();
    console.log('Signup inputs found:', inputs.length);
    
    for (let i = 0; i < inputs.length; i++) {
      const placeholder = await inputs[i].getAttribute('placeholder');
      const type = await inputs[i].getAttribute('type');
      console.log(`Signup Input ${i + 1}: type="${type}", placeholder="${placeholder}"`);
    }
  });
});
