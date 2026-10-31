import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly validationSummary: Locator;
  readonly inlineErrors: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('#Email');
    this.passwordInput = page.locator('#Password');
    this.loginButton = page.locator('.login-button');
    // The error box is nested (.message-error > .validation-summary-errors), so take the first match.
    this.validationSummary = page.locator('.message-error, .validation-summary-errors').first();
    this.inlineErrors = page.locator('.field-validation-error');
  }

  async open() {
    await this.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /** Asserts an error is shown and the browser is still on the login page (i.e. not authenticated). */
  async expectLoginFailed() {
    await expect(this.page).toHaveURL(/login/);
    await expect(this.validationSummary.or(this.inlineErrors.first()).first()).toBeVisible();
  }

  async getErrorText(): Promise<string> {
    if (await this.validationSummary.isVisible()) {
      return (await this.validationSummary.innerText()).trim();
    }
    return (await this.inlineErrors.first().innerText()).trim();
  }
}