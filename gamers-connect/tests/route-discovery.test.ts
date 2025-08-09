import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Route Discovery', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(45000); // Increased timeout
  });

  test('Find working routes', async ({ page }) => {
    console.log('🔄 Testing basic routes...');
    
    const routes = [
      '/',
      '/dashboard', // This one requires auth but we can test it returns something
    ];
    
    const results = [];
    
    for (const route of routes) {
      try {
        console.log(`Testing route: ${route}`);
        const response = await page.goto(`${BASE_URL}${route}`, { 
          timeout: 15000,
          waitUntil: 'domcontentloaded' // Don't wait for everything to load
        });
        
        const status = response?.status() || 0;
        const title = await page.title().catch(() => 'No title');
        
        results.push({
          route,
          status,
          title,
          working: status === 200 || status === 401 // 401 is fine for protected routes
        });
        
        console.log(`${route}: ${status} - ${title}`);
        
      } catch (error) {
        console.log(`${route}: Failed - ${error.message}`);
        results.push({
          route,
          status: 0,
          title: 'Failed to load',
          working: false,
          error: error.message
        });
      }
    }
    
    // Verify at least the homepage works
    const homepageResult = results.find(r => r.route === '/');
    expect(homepageResult?.working).toBe(true);
    
    console.log('✅ Route discovery completed');
    console.log('Results:', results);
  });
});
