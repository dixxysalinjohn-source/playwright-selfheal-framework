const { test, expect } = require('../Fixtures/fixtures');
const { LoginPage } = require('../Pages/loginpage_ai_generated.js');
const loginData = require('../TestData/datalogin.json');

test.describe('LoginPage - valid and invalid login', () => {
  test('logs in with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginData.valid.username, loginData.valid.password);

    await expect(page).toHaveURL(/\/dashboard\/index$/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test.only('shows an error with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginData.invalid.username, loginData.invalid.password);

    await expect(page.getByText('Invalid credentials', { exact: true })).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login$/);
  });
});
