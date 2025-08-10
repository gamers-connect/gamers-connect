import { test } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test('Simple diagnostic', async ({ page }) => {
  // Just check if we can reach the homepage
  await page.goto(BASE_URL);
  
  // Take a screenshot
  await page.screenshot({ path: 'diagnostic-homepage.png', fullPage: true });
  
  // Get all the basic info
  console.log('Title:', await page.title());
  console.log('URL:', page.url());
  
  // Get the full HTML content
  const html = await page.content();
  console.log('HTML length:', html.length);
  console.log('HTML preview:', html.substring(0, 1000));
  
  // Check if Next.js is working
  const nextScripts = await page.locator('script[src*="_next"]').count();
  console.log('Next.js scripts found:', nextScripts);
  
  // Check for any error messages in console
  page.on('console', msg => console.log('Browser console:', msg.text()));
  page.on('pageerror', error => console.log('Page error:', error.message));
});