
//const { test, expect } = require('../fixtures/android-test');
//const { test, expect } = require('../fixtures/desktop-test');

const { test, expect } = require('../fixtures/test');
const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');

const USERNAME = 'Admin';
const PASSWORD = 'admin123';

async function login(page) {
  const loginPage = new LoginPage(page);
  await loginPage.login(USERNAME, PASSWORD);
  await expect(page).toHaveURL(/dashboard\/index/);
}

// TC01 - Verify Login Page
test('TC011 - Verify login page @smoke @sanity @regression', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.expectVisible();
  await expect(loginPage.usernameInput).toBeVisible();
  await expect(loginPage.passwordInput).toBeVisible();
  await expect(loginPage.loginButton).toBeVisible();
});

// TC02 - Login with Valid Credentials
test('TC022 - Login with valid credentials @smoke @sanity @regression', async ({ page }) => {
  await login(page);

  const dashboardPage = new DashboardPage(page);
  await expect(dashboardPage.dashboardHeader).toBeVisible();
});

