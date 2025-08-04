import { test } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Route Discovery', () => {
  
  test('Find working routes', async ({ page }) => {
    // Test common route variations
    const routesToTest = [
      '/',           // Home page
      '/login',      // Alternative to signin
      '/sign-in',    // Alternative to signin
      '/signin',     // Current signin
      '/register',   // Alternative to signup
      '/sign-up',    // Alternative to signup
      '/signup',     // Current signup
      '/dashboard',  // Current dashboard
      '/home',       // Alternative to dashboard
      '/profile',    // Profile page
      '/sessions',   // Sessions page
      '/create-session', // Alternative to createsession
      '/createsession',  // Current create session
    ];

    console.log('Testing routes...\n');

    for (const route of routesToTest) {
      try {
        await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle', timeout: 5000 });
        
        const title = await page.title();
        const url = page.url();
        const headings = await page.locator('h1, h2, h3, h4, h5, h6').first().textContent();
        const bodyText = await page.locator('body').textContent();
        
        // Check if it's a 404
        const is404 = bodyText?.includes('404') || bodyText?.includes('not be found');
        
        if (!is404) {
          console.log(`✅ ${route} - SUCCESS`);
          console.log(`   Title: ${title}`);
          console.log(`   URL: ${url}`);
          console.log(`   First heading: ${headings || 'None found'}`);
          console.log('');
        } else {
          console.log(`❌ ${route} - 404 Not Found`);
        }
        
      } catch (error) {
        console.log(`⚠️  ${route} - Error: ${error}`);
      }
    }
  });

  test('Check homepage and see navigation', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Take screenshot of homepage
    await page.screenshot({ path: 'homepage.png', fullPage: true });
    
    console.log('Homepage title:', await page.title());
    console.log('Homepage URL:', page.url());
    
    // Look for navigation links
    const links = await page.locator('a').all();
    console.log(`Found ${links.length} links on homepage:`);
    
    for (let i = 0; i < Math.min(links.length, 10); i++) { // Limit to first 10 links
      const href = await links[i].getAttribute('href');
      const text = await links[i].textContent();
      console.log(`  Link ${i + 1}: "${text}" -> ${href}`);
    }
  });
});
