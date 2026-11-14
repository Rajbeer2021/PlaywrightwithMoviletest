
const { test: base, expect } = require('@playwright/test');
const { _android: android } = require('playwright');

const DEVICE_SERIAL = 'emulator-5554';
// Physical Vivo:
// const DEVICE_SERIAL = '3085302478000CV';

const BASE_URL = 'https://opensource-demo.orangehrmlive.com';

const test = base.extend({

  androidDevice: [
    async ({}, use) => {
      const devices = await android.devices();

      const device = devices.find(
        d => d.serial() === DEVICE_SERIAL
      );

      if (!device) {
        throw new Error(`Android device not found: ${DEVICE_SERIAL}`);
      }

      console.log('Connected Android device:', device.serial());
      console.log('Device model:', device.model());

      try {
        await use(device);
      } finally {
        await device.close();
      }
    },
    { scope: 'worker' }
  ],

  context: async ({ androidDevice }, use) => {
    const context = await androidDevice.launchBrowser({
      baseURL: BASE_URL,
      viewport: { width: 393, height: 852 },
    });

    try {
      await use(context);
    } finally {
      await context.close();
    }
  },

  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
  },

});

module.exports = { test, expect };
