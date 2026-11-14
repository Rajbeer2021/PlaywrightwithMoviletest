
//const { test, expect } = require('./fixtures/android-test');
//const { test, expect } = require('./fixtures/desktop-test');

const { test, expect } = require('./fixtures/test');

const USERNAME = 'Admin';
const PASSWORD = 'admin123';

const usernameInput = page => page.locator('input[name="username"]');
const passwordInput = page => page.locator('input[name="password"]');
const loginButton = page => page.getByRole('button', { name: 'Login' });

// Reusable Login form submission
async function submitLogin(page) {
  const password = passwordInput(page);

  await expect(password).toBeVisible();
  await password.press('Enter');
}

// Reusable Login
async function login(page) {
  await page.goto('/web/index.php/auth/login');

  await usernameInput(page).fill(USERNAME);
  await passwordInput(page).fill(PASSWORD);

  // Submit form using Enter instead of pointer click
  await submitLogin(page);

  await expect(page).toHaveURL(/dashboard\/index/);
}

// TC01 - Verify Login Page
test('TC01 - Verify login page @smoke @sanity @regression', async ({ page }) => {
  await page.goto('/web/index.php/auth/login');

  await expect(usernameInput(page)).toBeVisible();
  await expect(passwordInput(page)).toBeVisible();
  await expect(loginButton(page)).toBeVisible();
});

// TC02 - Login with Valid Credentials
test('TC02 - Login with valid credentials @smoke @sanity @regression', async ({ page }) => {
  await login(page);

  await expect(
    page.locator('h6').filter({ hasText: 'Dashboard' })
  ).toBeVisible();
});

// TC03 - Login with Invalid Credentials
test('TC03 - Login with invalid credentials @smoke @sanity @regression', async ({ page }) => {
  await page.goto('/web/index.php/auth/login');

  await usernameInput(page).fill('Adminsss');
  await passwordInput(page).fill('admin123sss');

  // Submit using keyboard to avoid overlapping demo credentials panel
  await submitLogin(page);

  await expect(
    page.getByText('Invalid credentials')
  ).toBeVisible();
});

// TC04 - Logout Successfully
test('TC04 - Logout successfully @sanity @regression', async ({ page }) => {
  await login(page);

  await page.locator('.oxd-userdropdown-tab').click();

  await page.getByText('Logout', { exact: true }).click();

  await expect(page).toHaveURL(/auth\/login/);
  await expect(usernameInput(page)).toBeVisible();
  await expect(passwordInput(page)).toBeVisible();
});
