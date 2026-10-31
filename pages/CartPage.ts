import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartRows: Locator;
  readonly productNameCells: Locator;
  readonly quantityInputs: Locator;
  readonly updateCartButton: Locator;
  readonly termsOfServiceCheckbox: Locator;
  readonly checkoutButton: Locator;
  readonly checkoutValidationError: Locator;

  constructor(page: Page) {
    super(page);
    this.cartRows = page.locator('.cart-item-row, table.cart tbody tr');
    this.productNameCells = page.locator('.product-name');
    this.quantityInputs = page.locator('.qty-input');
    this.updateCartButton = page.locator('input[name="updatecart"]');
    this.termsOfServiceCheckbox = page.locator('#termsofservice');
    this.checkoutButton = page.locator('#checkout, button[name="checkout"]');
    this.checkoutValidationError = page.locator('#terms-of-service-warning-box, .message-error');
  }

  async open() {
    await this.goto('/cart');
  }

  /** Finds the cart row for a product and asserts its quantity input matches. */
  async expectProductInCart(productName: string, expectedQty: number) {
    const row = this.page.locator('.cart-item-row', { hasText: productName });
    await expect(row).toBeVisible();
    const qtyInput = row.locator('.qty-input');
    await expect(qtyInput).toHaveValue(String(expectedQty));
  }

  async updateQuantity(productName: string, qty: number) {
    const row = this.page.locator('.cart-item-row', { hasText: productName });
    await row.locator('.qty-input').fill(String(qty));
    await this.updateCartButton.click();
  }

  async acceptTerms() {
    await this.termsOfServiceCheckbox.check();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async acceptTermsAndCheckout() {
    await this.acceptTerms();
    await this.proceedToCheckout();
  }
}
