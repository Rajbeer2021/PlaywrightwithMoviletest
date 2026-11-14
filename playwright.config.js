
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({

  testDir: './tests',
  timeout: 60000,
  retries: 0,
  reporter: 'html',

  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com',

    browserName: 'chromium',
    channel: 'chrome',
    headless: false,

    // Open Chrome in maximized mode
    launchOptions: {
      args: ['--start-maximized'],
    },

    // Use actual Chrome window dimensions
    viewport: null,

    screenshot: 'on',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'Desktop Chrome',
    },
  ],
});
