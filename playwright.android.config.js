
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60000,
  retries: 0,
  reporter: 'html',

  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com',
    screenshot: 'on',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'Android Chrome',
      testMatch: '**/orangehrm.spec.js',
    },
  ],
});
