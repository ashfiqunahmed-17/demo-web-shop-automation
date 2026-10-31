#!/usr/bin/env bash
# Builds the Part B history: main + one branch per question, each merged into main,
# with small incremental commits. Run ONCE from the project root, in a folder without .git.
#   bash scripts/setup-git-history.sh
# Commits use YOUR git identity:  git config --global user.name "..." ; git config --global user.email "..."
set -euo pipefail

[ -d .git ] && { echo "A .git folder already exists - run this in a fresh copy."; exit 1; }
git config user.name  >/dev/null || { echo "Set git user.name first.";  exit 1; }
git config user.email >/dev/null || { echo "Set git user.email first."; exit 1; }

git init -q -b main

c() { local msg="$1"; shift; git add -- "$@"; git commit -q -m "$msg"; echo "  commit: $msg"; }
merge() { git checkout -q main; git merge -q --no-ff "$1" -m "$2"; echo "merged $1 -> main"; }

echo "== main: project foundation =="
c "chore: initialise Node/TypeScript project"                 package.json package-lock.json tsconfig.json .gitignore
c "chore: configure Playwright with HTML and Allure reporters" playwright.config.ts
c "feat: add BasePage with screenshot attachment helper"      pages/BasePage.ts
c "feat: add unique test-data generators"                     utils/testData.ts
c "chore: add run script that always builds the reports"      scripts/run.js scripts/setup-git-history.sh

echo "== Q1 =="
git checkout -q -b feature/q1-invalid-login
c "feat: add HomePage page object"                            pages/HomePage.ts
c "feat: add LoginPage page object"                           pages/LoginPage.ts
c "test: Q1 invalid login scenario"                           tests/q1-invalid-login.spec.ts
merge feature/q1-invalid-login "Merge Q1: invalid login"

echo "== Q2 =="
git checkout -q -b feature/q2-register-add-to-cart
c "feat: add RegisterPage page object"                        pages/RegisterPage.ts
c "feat: add CategoryPage and ProductPage page objects"       pages/CategoryPage.ts pages/ProductPage.ts
c "feat: add CartPage page object"                            pages/CartPage.ts
c "test: Q2 register, login and add product to cart"          tests/q2-register-add-to-cart.spec.ts
merge feature/q2-register-add-to-cart "Merge Q2: register and add to cart"

echo "== Q3 =="
git checkout -q -b feature/q3-search-checkout-e2e
c "feat: add SearchResultsPage page object"                   pages/SearchResultsPage.ts
c "feat: add CheckoutPage page object (one-page checkout)"    pages/CheckoutPage.ts
c "test: Q3 search to order confirmation E2E"                 tests/q3-search-checkout-e2e.spec.ts
merge feature/q3-search-checkout-e2e "Merge Q3: search to checkout E2E"

echo "== API =="
git checkout -q -b feature/api-tests
c "test: Postman collection for GET users and PUT user"       api-tests/DemoShopAPI.postman_collection.json
c "docs: how to run the API suite with Newman"                api-tests/README.md
merge feature/api-tests "Merge API tests (Part C)"

echo "== Docs and CI =="
git checkout -q -b docs/readme-and-ci
c "ci: GitHub Actions workflow running UI and API suites"     .github/workflows/tests.yml
c "docs: project README with setup, run and report steps"     README.md
merge docs/readme-and-ci "Merge README and CI"

echo; git status --short; echo "(nothing listed above = every file committed)"; echo
git log --oneline --graph --decorate | head -40
echo
echo "Next: create an EMPTY PUBLIC repo on GitHub, then:"
echo "  git remote add origin https://github.com/<you>/<repo>.git"
echo "  git push -u origin --all"
