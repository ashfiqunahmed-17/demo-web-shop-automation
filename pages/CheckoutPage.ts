import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface BillingAddress {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  state?: string;
  city: string;
  address1: string;
  zip: string;
  phone: string;
}

/**
 * demowebshop uses a one-page checkout: sections are revealed one at a time
 * (Billing -> [Shipping address, only if "ship to same address" is unticked]
 * -> Shipping method -> Payment method -> Payment info -> Confirm order).
 * Each step has its own "Continue" button, so every step waits for ITS button.
 */
export class CheckoutPage extends BasePage {
  readonly checkoutAsGuestButton: Locator;
  readonly billingContinue: Locator;
  readonly shippingMethodContinue: Locator;
  readonly paymentMethodContinue: Locator;
  readonly paymentInfoContinue: Locator;
  readonly confirmOrderButton: Locator;
  readonly orderCompletedMessage: Locator;
  readonly orderDetailsLink: Locator;

  constructor(page: Page) {
    super(page);
    this.checkoutAsGuestButton = page.locator('.checkout-as-guest-button, input[value="Checkout as Guest"]').first();
    this.billingContinue = page.locator('.new-address-next-step-button:visible').first();
    this.shippingMethodContinue = page.locator('.shipping-method-next-step-button');
    this.paymentMethodContinue = page.locator('.payment-method-next-step-button');
    this.paymentInfoContinue = page.locator('.payment-info-next-step-button');
    this.confirmOrderButton = page.locator('.confirm-order-next-step-button');
    this.orderCompletedMessage = page.getByText(/Your order has been successfully processed/i);
    this.orderDetailsLink = page.getByRole('link', { name: /order details/i });
  }

  /** Cart -> "Checkout as Guest" screen -> one-page checkout. */
  async proceedAsGuest() {
    await this.page.waitForURL(/checkoutasguest|onepagecheckout/);
    if (/checkoutasguest/.test(this.page.url())) {
      await this.checkoutAsGuestButton.click();
    }
    await expect(this.page).toHaveURL(/onepagecheckout/);
  }

  async fillBillingAddress(a: BillingAddress) {
    await this.page.locator('#BillingNewAddress_FirstName').fill(a.firstName);
    await this.page.locator('#BillingNewAddress_LastName').fill(a.lastName);
    await this.page.locator('#BillingNewAddress_Email').fill(a.email);
    await this.page.locator('#BillingNewAddress_CountryId').selectOption({ label: a.country });

    if (a.state) {
      // The state list is loaded by AJAX after the country is chosen.
      const stateSelect = this.page.locator('#BillingNewAddress_StateProvinceId');
      await expect.poll(async () => stateSelect.locator('option').count()).toBeGreaterThan(1);
      await stateSelect.selectOption({ label: a.state });
    }

    await this.page.locator('#BillingNewAddress_City').fill(a.city);
    await this.page.locator('#BillingNewAddress_Address1').fill(a.address1);
    await this.page.locator('#BillingNewAddress_ZipPostalCode').fill(a.zip);
    await this.page.locator('#BillingNewAddress_PhoneNumber').fill(a.phone);
    await this.billingContinue.click();
  }

    /** Step 2 on this site: shipping address (already set to the billing address just entered). */
  async continueShippingAddress() {
    await expect(this.page.getByText(/Select a shipping address from your address book/i)).toBeVisible();
    await this.billingContinue.click();
  }

  async selectShippingMethod() {
    const firstOption = this.page.locator('input[name="shippingoption"]').first();
    await firstOption.check();
    await this.shippingMethodContinue.click();
  }

  async selectPaymentMethod() {
    const firstOption = this.page.locator('input[name="paymentmethod"]').first();
    await firstOption.check();
    await this.paymentMethodContinue.click();
  }

  /** Default payment method (Cash On Delivery) only shows an info text, so just continue. */
  async continuePaymentInfo() {
    await this.paymentInfoContinue.click();
  }

  async confirmOrder() {
    await expect(this.confirmOrderButton).toBeVisible();
    await this.confirmOrderButton.click();
  }

  async expectOrderConfirmed() {
    await expect(this.page).toHaveURL(/checkout\/completed/);
    await expect(this.orderCompletedMessage).toBeVisible();
  }

  async getOrderNumberText(): Promise<string> {
    return (await this.page.locator('.order-completed .details').innerText()).trim();
  }

  /** "Click here for order details." -> the order details page. */
  async openOrderDetails() {
    await this.orderDetailsLink.click();
    await expect(this.page).toHaveURL(/orderdetails\/\d+/);
    await expect(
      this.page.locator('.order-details-page').or(this.page.getByText(/Order Information/i)).first()
    ).toBeVisible();
  }
}
