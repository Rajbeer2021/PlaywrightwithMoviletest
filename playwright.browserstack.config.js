
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({

  testDir: './tests',

  timeout: 60000,
  retries: 0,

  reporter: [
    ['list'],
    ['html', {
      outputFolder: 'browserstack-report',
      open: 'never'
    }]
  ],

  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com',
    headless: true,
    screenshot: 'on',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },

});
