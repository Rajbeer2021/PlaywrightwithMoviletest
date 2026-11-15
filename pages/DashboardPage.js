class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardHeader = page.locator('h6').filter({ hasText: 'Dashboard' });
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.logoutLink = page.getByText('Logout', { exact: true });
  }

  async logout() {
    await this.userDropdown.click();
    await this.logoutLink.click();
  }
}

module.exports = DashboardPage;
