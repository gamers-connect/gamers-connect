import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests', // The directory where your test files are located
  testMatch: '**/*.{test,spec}.{js,ts,mjs}', // Explicitly match test files
  fullyParallel: true, // Run tests in parallel
  forbidOnly: !!process.env.CI, // Forbid 'test.only' in CI environments
  retries: process.env.CI ? 2 : 0, // Retries for CI
  workers: process.env.CI ? 1 : undefined, // Workers for CI
  reporter: 'html', // Use the HTML reporter

  use: {
    baseURL: 'http://localhost:3000', // The base URL for your application
    trace: 'on-first-retry', // Collect a trace file on the first retry of a failed test
  },

  // Automatically start the dev server before running tests
  webServer: {
  command: 'npm run dev',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
  timeout: 120 * 1000, // wait 2 minutes
  },


  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
