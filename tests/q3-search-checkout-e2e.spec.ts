import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { randomEmail } from '../utils/testData';

/**
 * Q3 — Product Search -> full checkout E2E (25 marks)
 * Search -> verify the product is in the results -> open it -> increase the
 * quantity -> add to cart -> tick the "I agree" terms checkbox -> checkout ->
 * complete the order -> see the order details.
 * Independent: uses guest checkout, so it needs no state from Q1/Q2.
 */
test.describe('Q3 - Search to Checkout (E2E)', () => {
  test('searches, adds a product to cart, and completes the order', async ({ page }, testInfo) => {
    const homePage = new HomePage(page);
    const searchResultsPage = new SearchResultsPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // "Laptop" is a simple product (no mandatory options), so add-to-cart is deterministic.
    const searchTerm = 'Laptop';
    const quantity = 3;
    let productName = '';

    await test.step('Search for a product', async () => {
      await homePage.open();
      await homePage.search(searchTerm);
    });

    await test.step('Verify the correct product appears in the search results', async () => {
      await searchResultsPage.expectResultsContain(searchTerm);
      await searchResultsPage.attachScreenshot(testInfo, 'search-results');
    });

    await test.step('Open the product', async () => {
      await searchResultsPage.openProduct(searchTerm);
      productName = await productPage.getProductName();
      expect(productName.toLowerCase()).toContain(searchTerm.toLowerCase());
    });

    await test.step('Increase the quantity and add it to the cart', async () => {
      await productPage.setQuantity(quantity);
      await productPage.addToCart();
      await productPage.attachScreenshot(testInfo, 'product-added-to-cart');
    });

    await test.step('Open the cart, verify it, and tick the agree-to-terms checkbox', async () => {
      await cartPage.open();
      await cartPage.expectProductInCart(productName, quantity);
      await cartPage.acceptTerms();
      await expect(cartPage.termsOfServiceCheckbox).toBeChecked();
      await cartPage.attachScreenshot(testInfo, 'cart-terms-accepted');
    });

    await test.step('Checkout as guest and fill the billing address', async () => {
      await cartPage.proceedToCheckout();
      await checkoutPage.proceedAsGuest();
      await checkoutPage.fillBillingAddress({
        firstName: 'QA',
        lastName: 'Automation',
        email: randomEmail(),
        country: 'United States',
        state: 'New York',
        city: 'New York',
        address1: '123 QA Automation Street',
        zip: '10001',
        phone: '5551234567',
      });
    });

    await test.step('Choose shipping method, payment method and confirm the order', async () => {
      await checkoutPage.continueShippingAddress();
      await checkoutPage.selectShippingMethod();
      await checkoutPage.selectPaymentMethod();
      await checkoutPage.continuePaymentInfo();
      await checkoutPage.attachScreenshot(testInfo, 'checkout-confirm-order-step');
      await checkoutPage.confirmOrder();
    });

    await test.step('Verify the order is confirmed', async () => {
      await checkoutPage.expectOrderConfirmed();
      await checkoutPage.attachScreenshot(testInfo, 'order-confirmation');
    });

    await test.step('See the order details', async () => {
      await checkoutPage.openOrderDetails();
      await checkoutPage.attachScreenshot(testInfo, 'order-details');
    });
  });
});
