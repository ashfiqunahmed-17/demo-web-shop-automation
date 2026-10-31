import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly loginLink: Locator;
  readonly registerLink: Locator;
  readonly logoutLink: Locator;
  readonly searchBox: Locator;
  readonly searchButton: Locator;
  readonly miniCartQuantity: Locator;
  readonly shoppingCartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.loginLink = page.locator('.header-links').getByRole('link', { name: 'Log in' });
    this.registerLink = page.locator('.header-links').getByRole('link', { name: 'Register' });
    this.logoutLink = page.locator('.header-links').getByRole('link', { name: 'Log out' });
    this.searchBox = page.locator('#small-searchterms');
    this.searchButton = page.locator('.search-box-button');
    this.miniCartQuantity = page.locator('.cart-qty');
    this.shoppingCartLink = page.locator('.header-links').getByRole('link', { name: /Shopping cart/i });
  }

  async open() {
    await this.goto('/');
  }

  async goToLogin() {
    await this.loginLink.click();
  }

  async goToRegister() {
    await this.registerLink.click();
  }

  /** Navigate via the top category menu, e.g. "Books", "Computers", "Electronics". */
  async openCategory(categoryName: string) {
    await this.page.locator('#top-menu, .top-menu').getByRole('link', { name: categoryName, exact: true }).click();
  }

  async search(term: string) {
    await this.searchBox.fill(term);
    await this.searchButton.click();
  }

  async openCart() {
    await this.shoppingCartLink.click();
  }

  async isLoggedIn(): Promise<boolean> {
    return this.logoutLink.isVisible().catch(() => false);
  }
}
