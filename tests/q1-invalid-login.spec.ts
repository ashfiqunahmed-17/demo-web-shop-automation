import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { randomEmail } from '../utils/testData';

/**
 * Q1 — Invalid Login (10 marks)
 * Attempt to log in with an invalid email/password combination, verify the
 * appropriate error message is displayed and the user is NOT logged in.
 * Fully independent: only navigates to /login, no state from other specs.
 */
test.describe('Q1 - Invalid Login', () => {
  test('shows a validation error and does not authenticate for bad credentials', async ({ page }, testInfo) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    await test.step('Open the login page', async () => {
      await loginPage.open();
      await expect(page).toHaveURL(/login/);
    });

    await test.step('Submit an invalid email/password combination', async () => {
      // Random, never-registered email guarantees this is genuinely invalid.
      await loginPage.login(randomEmail(), 'WrongPassword!123');
    });

    await test.step('Verify the error message is displayed', async () => {
      await loginPage.expectLoginFailed();
      const errorText = await loginPage.getErrorText();
      expect(errorText.length).toBeGreaterThan(0);
      await loginPage.attachScreenshot(testInfo, 'login-error-message');
    });

    await test.step('Verify the user is not logged in', async () => {
      await homePage.open();
      expect(await homePage.isLoggedIn()).toBeFalsy();
      await homePage.attachScreenshot(testInfo, 'homepage-still-logged-out');
    });
  });
});
