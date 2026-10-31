import { Page, TestInfo } from '@playwright/test';

/**
 * Shared behaviour for every page object.
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string = '/') {
    await this.page.goto(path);
  }

  /**
   * Takes a screenshot and attaches it to the running test's report.
   * Because `use.screenshot` is set to "on" in playwright.config.ts every
   * step already gets a screenshot in the HTML/Allure report, but calling
   * this at key checkpoints (e.g. "after login", "cart before checkout")
   * makes the report easier to read and satisfies the
   * "attach screenshots in the report" requirement explicitly.
   */
  async attachScreenshot(testInfo: TestInfo, name: string) {
    const buffer = await this.page.screenshot({ fullPage: true });
    await testInfo.attach(name, { body: buffer, contentType: 'image/png' });
  }

  async title(): Promise<string> {
    return this.page.title();
  }
}
