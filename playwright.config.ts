import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for the Demo Web Shop automation suite.
 * - HTML report: generated after every run (npx playwright show-report)
 * - Allure report: raw results written to ./allure-results, then built with
 *   `npm run report:allure:generate` (auto-runs via the `posttest` script)
 * - Screenshots are taken on every step ("on") so they land in both reports,
 *   with an extra explicit screenshot attached at key checkpoints in each test.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false, // each spec is independent, but we keep the demo site load light
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', { resultsDir: 'allure-results', detail: true, suiteTitle: true }],
  ],
  use: {
    baseURL: 'https://demowebshop.tricentis.com',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'on',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
