import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { CategoryPage } from '../pages/CategoryPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { randomCustomer } from '../utils/testData';

/**
 * Q2 — Register + Add Product to Cart (15 marks)
 * Register a new customer -> log in -> navigate to a product category ->
 * select a product -> add it to the shopping cart -> verify the correct
 * product and quantity appear in the cart.
 * Fully independent: creates its own unique customer, doesn't rely on Q1/Q3.
 */
test.describe('Q2 - Register and Add Product to Cart', () => {
  test('registers a new customer, logs in, and adds a product to the cart', async ({ page }, testInfo) => {
    const homePage = new HomePage(page);
    const registerPage = new RegisterPage(page);
    const loginPage = new LoginPage(page);
    const categoryPage = new CategoryPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    const customer = randomCustomer();
    const quantity = 2;

    await test.step('Register a new customer', async () => {
      await registerPage.open();
      await registerPage.register(customer);
      await registerPage.expectRegistrationSucceeded();
      await registerPage.attachScreenshot(testInfo, 'registration-success');
    });

    await test.step('Log in with the new customer', async () => {
      // demowebshop auto-logs-in right after registration; log out first so
      // this step genuinely exercises the login form per the task wording.
      await homePage.open();
      if (await homePage.isLoggedIn()) {
        await homePage.logoutLink.click();
      }
      await loginPage.open();
      await loginPage.login(customer.email, customer.password);
      await expect(page).toHaveURL(/tricentis\.com\/?$/);
      expect(await homePage.isLoggedIn()).toBeTruthy();
    });

    let productName = '';

    await test.step('Navigate to a product category and select a product', async () => {
      await homePage.openCategory('Books');
      await categoryPage.expectHasProducts();
      productName = await categoryPage.openFirstProduct();
      await expect(page.locator('.product-essential')).toBeVisible();
    });

    await test.step('Add the product to the shopping cart', async () => {
      await productPage.setQuantity(quantity);
      await productPage.addToCart();
      await productPage.attachScreenshot(testInfo, 'product-added-to-cart');
    });

    await test.step('Verify the correct product and quantity appear in the cart', async () => {
      await cartPage.open();
      await cartPage.expectProductInCart(productName, quantity);
      await cartPage.attachScreenshot(testInfo, 'cart-contents-verified');
    });
  });
});
