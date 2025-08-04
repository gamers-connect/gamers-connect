import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test('Inspect signup form structure', async ({ page }) => {
  await page.goto(BASE_URL);
  
  // Click Sign Up to show the form
  await page.getByRole('button', { name: 'Sign Up' }).click();
  
  // Wait for form to appear
  await expect(page.getByRole('heading', { name: 'Join the Community' })).toBeVisible();
  
  // Take screenshot of the form
  await page.screenshot({ path: 'signup-form.png', fullPage: true });
  
  // Check form attributes
  const form = page.locator('form').first();
  const formAction = await form.getAttribute('action');
  const formMethod = await form.getAttribute('method');
  
  console.log('Form attributes:');
  console.log('Action:', formAction);
  console.log('Method:', formMethod);
  
  // List all buttons in the form
  const buttons = await page.locator('form button').all();
  console.log(`\nFound ${buttons.length} buttons in form:`);
  
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    const text = await button.textContent();
    const type = await button.getAttribute('type');
    const onClick = await button.getAttribute('onclick');
    
    console.log(`Button ${i + 1}:`);
    console.log(`  Text: "${text}"`);
    console.log(`  Type: ${type}`);
    console.log(`  OnClick: ${onClick}`);
  }
  
  // List all inputs in the form
  const inputs = await page.locator('form input').all();
  console.log(`\nFound ${inputs.length} inputs in form:`);
  
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    const name = await input.getAttribute('name');
    const type = await input.getAttribute('type');
    const placeholder = await input.getAttribute('placeholder');
    
    console.log(`Input ${i + 1}:`);
    console.log(`  Name: ${name}`);
    console.log(`  Type: ${type}`);
    console.log(`  Placeholder: ${placeholder}`);
  }
  
  // Check if form has onSubmit handler
  const formHTML = await form.innerHTML();
  console.log('\nForm HTML preview:', formHTML.substring(0, 500));
});
