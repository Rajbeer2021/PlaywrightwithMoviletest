
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
test('TC01 - Verify login page @smoke @sanity @regression', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.expectVisible();
  await expect(loginPage.usernameInput).toBeVisible();
  await expect(loginPage.passwordInput).toBeVisible();
  await expect(loginPage.loginButton).toBeVisible();
});

// TC02 - Login with Valid Credentials
test('TC02 - Login with valid credentials @smoke @sanity @regression', async ({ page }) => {
  await login(page);

  const dashboardPage = new DashboardPage(page);
  await expect(dashboardPage.dashboardHeader).toBeVisible();
});

// TC03 - Login with Invalid Credentials
test('TC03 - Login with invalid credentials @smoke @sanity @regression', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.login('Adminsss', 'admin123sss');
  await expect(loginPage.invalidCredentialsMessage).toBeVisible();
});

// TC04 - Logout Successfully
test('TC04 - Logout successfully @sanity @regression', async ({ page }) => {
  await login(page);

  const dashboardPage = new DashboardPage(page);
  await dashboardPage.logout();

  const loginPage = new LoginPage(page);
  await expect(page).toHaveURL(/auth\/login/);
  await expect(loginPage.usernameInput).toBeVisible();
  await expect(loginPage.passwordInput).toBeVisible();
});
