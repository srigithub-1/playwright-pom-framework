import { defineConfig, devices } from '@playwright/test';
import path from 'path';

// Jenkins workspace support
const workspace = process.env.WORKSPACE || process.cwd();

// STEP 2 + 4: All report folders consolidated under ./reports/
const htmlReportPath      = path.join(workspace, 'reports', 'html-report');
const playwrightReportPath = path.join(workspace, 'reports', 'playwright');
const allureReportPath     = path.join(workspace, 'reports', 'allure');
const monocartReportPath   = path.join(workspace, 'reports', 'monocart-report');
const rawResultsPath       = path.join(workspace, 'reports', 'raw');   // Step 5

export default defineConfig({
  // ----------------------------
  // Test discovery
  // ----------------------------
  testDir: './tests',
  timeout: 30 * 1000,

  expect: { timeout: 5000 },

  // ----------------------------
  // STEP 5: Raw artifacts go here
  // ----------------------------
  outputDir: rawResultsPath,

  // ----------------------------
  // Reporters
  // ----------------------------
  reporter: [
    ['list'],

    // ⭐ Default Playwright HTML report
    ['html', {
      outputFolder: htmlReportPath,
      open: 'never'                      // Jenkins-safe
    }],

    // ⭐ Required: Playwright's trace/attachments viewer
    ['json', { outputFile: path.join(playwrightReportPath, 'report.json') }],

    // ⭐ Allure (optional — enable if you want)
    // ['allure-playwright', { outputFolder: allureReportPath }],

    // ⭐ Your existing Monocart reporter
    ['monocart-reporter', {
      outputFile: path.join(monocartReportPath, 'index.html'),
      reportTitle: 'Playwright Test Dashboard',
      autoOpen: false,
      trend: true,
      removeExisting: true
    }]
  ],

  // ----------------------------
  // Parallelism
  // ----------------------------
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: process.env.CI ? 1 : undefined,

  // ----------------------------
  // Browser launch defaults
  // ----------------------------
  use: {
    headless: true,
    baseURL: 'https://playwright.dev',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry'
  },

  // ----------------------------
  // Projects (browsers)
  // ----------------------------
  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
