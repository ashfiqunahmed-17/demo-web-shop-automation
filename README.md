# Demo Web Shop Automation & API Testing

- **UI (Part A):** Playwright + Page Object Model against <https://demowebshop.tricentis.com/>
- **GitHub workflow & docs (Part B):** branch per question, merged into `main` (see below)
- **API (Part C):** Postman collection run with Newman against <https://jsonplaceholder.typicode.com/users>

## Tech stack

Playwright Test (TypeScript) · Page Object Model · Allure (`allure-playwright`, `newman-reporter-allure`, Allure CLI) · Playwright HTML reporter · Postman + Newman · GitHub Actions

## Project structure

```
pages/        Page Objects (Base, Home, Login, Register, Category, SearchResults, Product, Cart, Checkout)
tests/        q1-invalid-login · q2-register-add-to-cart · q3-search-checkout-e2e
utils/        unique test-data generators
api-tests/    Postman collection + README
scripts/      run.js (runs a suite, then always builds the reports)
.github/      CI workflow
```

## Setup

Prerequisites: **Node.js 18+** and **Java 8+** (required by the Allure CLI).

```bash
git clone <your-repo-url>
cd demo-web-shop-automation
npm install
npx playwright install chromium
```

## Run the scenarios

| What | Command |
|---|---|
| Q1 only | `npm run test:q1` |
| Q2 only | `npm run test:q2` |
| Q3 only | `npm run test:q3` |
| All three UI scenarios in sequence | `npm test` |
| API suite only | `npm run test:api` |
| UI + API together | `npm run test:all` |
| Watch the browser | `npm run test:headed` |

Each scenario creates its own data (unique customer email, guest checkout), so they run independently or together in any order.

## Reports (generated after **every** run)

Each command above builds the reports automatically, even when a test fails.

| Report | Open with |
|---|---|
| Allure (UI + API results, with screenshots) | `npm run report:allure:open` |
| Playwright HTML (UI) | `npm run report:html` |
| Newman HTML (API) | open `api-tests/reports/newman-report.html` |

Screenshots: Playwright takes a screenshot for every test (`screenshot: 'on'`), and each test also attaches named checkpoint screenshots (e.g. `login-error-message`, `cart-terms-accepted`, `order-confirmation`) through `BasePage.attachScreenshot()`. They show up in both the Allure and HTML reports.

Regenerate Allure from existing results: `npm run report:allure:generate`.

## Scenarios

- **Q1 – Invalid login:** wrong credentials → error message shown, still on the login page, not logged in.
- **Q2 – Register + add to cart:** register → log out/in → open a category → open a product → quantity 2 → add to cart → verify product name and quantity in the cart.
- **Q3 – Search to order (E2E):** search → verify result → open product → quantity 3 → add to cart → tick "I agree" → checkout (guest) → billing, shipping method, payment → confirm → order confirmation → order details page.

## API suite

See [`api-tests/README.md`](api-tests/README.md).

## Git workflow (Part B)

- `main` holds the merged, working code.
- One branch per question, merged into `main` with a merge commit:
  `feature/q1-invalid-login`, `feature/q2-register-add-to-cart`, `feature/q3-search-checkout-e2e`, `feature/api-tests`, plus `docs/readme-and-ci`.
- Small, descriptive commits (one page object or one test per commit).

CI (`.github/workflows/tests.yml`) runs `npm run test:all` on every push/PR to `main` and uploads the reports as artifacts.

## Troubleshooting

- *Allure report fails to generate:* install Java (`java -version` should work).
- *A locator stops matching after a site change:* locators live only in `pages/*.ts`; `npx playwright codegen https://demowebshop.tricentis.com` shows the current DOM.
