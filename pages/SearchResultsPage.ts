import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {
  readonly productItems: Locator;
  readonly productTitles: Locator;

  constructor(page: Page) {
    super(page);
    this.productItems = page.locator('.product-item');
    this.productTitles = page.locator('.product-item .product-title a');
  }

  async expectResultsContain(searchTerm: string) {
    await expect(this.productItems.first()).toBeVisible();
    const count = await this.productTitles.count();
    expect(count).toBeGreaterThan(0);

    let foundMatch = false;
    for (let i = 0; i < count; i++) {
      const text = (await this.productTitles.nth(i).innerText()).toLowerCase();
      if (text.includes(searchTerm.toLowerCase())) {
        foundMatch = true;
        break;
      }
    }
    expect(foundMatch).toBeTruthy();
  }

  /** Opens the first product whose title contains the given text. */
  async openProduct(titleContains: string) {
    await this.productTitles.filter({ hasText: titleContains }).first().click();
  }

  async openFirstProduct() {
    await this.productTitles.first().click();
  }
}
