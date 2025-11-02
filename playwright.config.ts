import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: './tests',
  reporter: [['html', { open: 'never' }]],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  use: {
    headless: true,
    screenshot: 'on',               // ✅ take screenshots for all tests
    video: 'retain-on-failure',
    trace: 'on-first-retry',

    // ✅ Save results by date
    outputDir: path.join(__dirname, 'test-results', new Date().toISOString().slice(0, 10)),
  },

  projects: [
    {
      name: 'Google Chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome', // Runs using your installed Chrome browser
      },
    },
  ],
});