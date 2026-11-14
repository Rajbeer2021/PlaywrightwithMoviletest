
const { defineConfig } = require('@playwright/test');

const isCI = !!process.env.CI;

module.exports = defineConfig({

  testDir: './tests',
  timeout: 60000,
  retries: 0,
  outputDir: 'reports/test-results',
  reporter: [['html', { outputFolder: 'reports/playwright-report', open: 'never' }]],

  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com',

    browserName: 'chromium',
    channel: 'chrome',
    headless: isCI,

    // Open Chrome in maximized mode for local runs; use safer CI flags in GitHub Actions.
    launchOptions: {
      args: isCI
        ? ['--no-sandbox', '--disable-dev-shm-usage']
        : ['--start-maximized'],
    },

    // Use actual Chrome window dimensions only for local headed runs.
    viewport: isCI ? { width: 1280, height: 720 } : null,

    screenshot: 'on',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'Desktop Chrome',
    },
  ],
});
