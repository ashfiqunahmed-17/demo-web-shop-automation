import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CategoryPage extends BasePage {
  readonly productItems: Locator;
  readonly productTitles: Locator;

  constructor(page: Page) {
    super(page);
    this.productItems = page.locator('.product-item');
    this.productTitles = page.locator('.product-item .product-title a');
  }

  async expectHasProducts() {
    await expect(this.productItems.first()).toBeVisible();
  }

  async openFirstProduct(): Promise<string> {
    const name = (await this.productTitles.first().innerText()).trim();
    await this.productTitles.first().click();
    return name;
  }

  async openProduct(titleContains: string) {
    await this.productTitles.filter({ hasText: titleContains }).first().click();
  }
}
