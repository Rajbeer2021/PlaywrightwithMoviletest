
const target = (process.env.BROWSER_TARGET || 'desktop').toLowerCase();

let test;
let expect;

switch (target) {
  case 'desktop':
    ({ test, expect } = require('@playwright/test'));
    break;

  case 'android':
    ({ test, expect } = require('./android-test'));
    break;

  default:
    throw new Error(
      `Invalid BROWSER_TARGET: ${target}. Use desktop or android.`
    );
}

module.exports = { test, expect };
