import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import { existsSync } from 'fs';

dotenv.config({ path: '.env.test', override: true });
if (existsSync('.env.test.local')) {
  dotenv.config({ path: '.env.test.local', override: true });
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */


const STORAGE_STATE = 'playwright/.auth/user.json';
const isCI = process.env.CI === 'true';

export default defineConfig({
  // Runs once before all tests to spin up the DB/Backend in Docker and seed initial data
  globalSetup: './tests/global-setup.ts',
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: isCI,
  /* Do not retry failing tests */
  retries: isCI ? 1 : 0,
  /* Force a single worker to avoid database concurrency issues in PostgreSQL */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['list'], ['html', { open: 'never' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:5173',

    /* Reporting Artifacts: Retain traces and videos for debugging failed tests or retries in CI. Screenshots captured only on failure. */
    trace: 'retain-on-failure-and-retries',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure-and-retries'
  },

  projects: [
    {
      // The setup project handles authentication before the main test suites run
      name: 'setup',
      testMatch: '**/auth-setup.ts',
    },
    {
      // Main browser project that depends on setup to inherit the authenticated storage state
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE,
      },
      dependencies: ['setup'],
    },
  ],

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  // ], 

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !isCI,
  },
});
