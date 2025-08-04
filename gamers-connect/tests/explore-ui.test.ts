import { test } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test('Explore actual signin UI', async ({ page }) => {
  await page.goto(BASE_URL);
  
  // Take screenshot of homepage
  await page.screenshot({ path: 'homepage-actual.png', fullPage: true });
  
  console.log('Page title:', await page.title());
  console.log('Current URL:', page.url());
  
  // Look for any buttons or links related to signin/auth
  const authButtons = await page.locator('button, a').allTextContents();
  console.log('All buttons/links found:', authButtons);
  
  // Look for any text containing "sign"
  const signText = await page.locator('text=/sign/i').allTextContents();
  console.log('Elements containing "sign":', signText);
  
  // Look for any forms on the page
  const forms = await page.locator('form').count();
  console.log('Number of forms found:', forms);
  
  if (forms > 0) {
    console.log('Form inputs found:');
    const inputs = await page.locator('form input').all();
    for (let i = 0; i < inputs.length; i++) {
      const placeholder = await inputs[i].getAttribute('placeholder');
      const type = await inputs[i].getAttribute('type');
      console.log(`  Input ${i + 1}: type="${type}", placeholder="${placeholder}"`);
    }
  }
  
  // Look for modals or popups that might contain signin
  const modals = await page.locator('[role="dialog"], .modal, .popup').count();
  console.log('Modals/dialogs found:', modals);
});
