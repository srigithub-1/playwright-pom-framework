import { defineConfig, devices } from '@playwright/test';
import path from 'path';

// Force reports to Jenkins workspace folder if it exists
const workspace = process.env.WORKSPACE || process.cwd();
const reportPath = path.join(workspace, 'monocart-report');

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000, // 30 seconds per test
  expect: {
    timeout: 5000, // 5 seconds for assertions
  },

  // ✅ Built-in reporters only
  reporter: [
    ['list'],
    ['monocart-reporter', {
      outputFile: path.join(reportPath, 'index.html'),
      reportTitle: 'Playwright Test Dashboard',
      autoOpen: false,
      trend: true,
      removeExisting: true
    }]
  ],
  // ✅ Parallel execution
  fullyParallel: true,

  // ✅ Fail build if test.only accidentally left in code
  forbidOnly: !!process.env.CI,

  // ✅ Retry failed tests once (optional)
  retries: 1,

  // ✅ CI runs can use limited workers
  workers: process.env.CI ? 1 : undefined,

  // ✅ Common settings for all tests
  use: {
    headless: true,
    baseURL: 'https://playwright.dev',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  // ✅ Configure projects for multiple browsers
  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
    }
    /* {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'WebKit',
      use: { ...devices['Desktop Safari'] },
    }, */
  ],

  // ✅ Optional local server before running tests
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  //   reuseExistingServer: !process.env.CI,
  // },
});
