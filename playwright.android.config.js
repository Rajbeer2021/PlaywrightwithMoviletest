
const { defineConfig } = require('@playwright/test');

process.env.BROWSER_TARGET = 'android';

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60000,
  retries: 0,
  outputDir: './reports/test-results',
  reporter: [
    ['list'],
    ['html', { outputFolder: './reports/playwright-report', open: 'never' }],
  ],

  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com',
    browserName: 'chromium',
    channel: 'chrome',
    screenshot: 'on',
    trace: 'retain-on-failure',
  },
});
