import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  readonly productName: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly successBar: Locator;

  constructor(page: Page) {
    super(page);
    // Scope everything to the product-essential block: search-result / category
    // pages also contain "add to cart" buttons, so scoping avoids strict-mode
    // ambiguity on the detail page itself (there's only one here, but this
    // keeps the locators robust if the page layout is reused elsewhere).
    const essential = page.locator('.product-essential');
    this.productName = essential.locator('.product-name h1');
    this.quantityInput = essential.locator('.qty-input, input[id^="product_enteredquantity_"]').first();
    this.addToCartButton = essential.locator('.add-to-cart-button').first();
    this.successBar = page.locator('.bar-notification.success, #bar-notification.success');
  }

  async getProductName(): Promise<string> {
    return (await this.productName.innerText()).trim();
  }

  async setQuantity(qty: number) {
    await this.quantityInput.fill(String(qty));
  }

  async addToCart() {
    await this.addToCartButton.click();
    // demowebshop shows a sliding "The product has been added to your shopping cart" bar
    await expect(this.successBar).toBeVisible({ timeout: 15_000 });
    await expect(this.successBar).toContainText(/added to your shopping cart/i);
  }
}
