// @ts-check
import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  timeout: 30 * 60 * 1000, // 30 minutes
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  // :white_check_mark: HTML + Allure reporter
  reporter: [
    ['html', { open: 'never' }],
     ['allure-playwright']
  ],
  use: {
    headless: false,
    slowMo: 100,
    viewport: null,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});