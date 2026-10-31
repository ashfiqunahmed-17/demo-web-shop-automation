/**
 * Single entry point for every run:  node scripts/run.js <q1|q2|q3|ui|api|all> [extra args]
 *  - cleans old results so each report reflects only the current run
 *  - runs the requested suite(s); a failing suite does NOT stop the report from being built
 *  - always generates the combined Allure report (allure-report/) after the run
 *  - HTML reports: playwright-report/ (UI) and api-tests/reports/newman-report.html (API)
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const target = (process.argv[2] || 'all').toLowerCase();
const extra = process.argv.slice(3).join(' ');
const root = path.resolve(__dirname, '..');
const UI_RESULTS = 'allure-results';

const specs = {
  q1: 'tests/q1-invalid-login.spec.ts',
  q2: 'tests/q2-register-add-to-cart.spec.ts',
  q3: 'tests/q3-search-checkout-e2e.spec.ts',
};

const run = (cmd) => {
  console.log(`\n> ${cmd}\n`);
  return spawnSync(cmd, { cwd: root, stdio: 'inherit', shell: true }).status ?? 1;
};

const rm = (p) => fs.rmSync(path.join(root, p), { recursive: true, force: true });

if (!['q1', 'q2', 'q3', 'ui', 'api', 'all'].includes(target)) {
  console.error('Usage: node scripts/run.js <q1|q2|q3|ui|api|all> [extra args]');
  process.exit(2);
}

[UI_RESULTS, 'allure-report'].forEach(rm);

let failed = false;

if (specs[target]) {
  failed = run(`npx playwright test ${specs[target]} ${extra}`) !== 0;
} else if (target === 'ui') {
  failed = run(`npx playwright test ${extra}`) !== 0;
}

if (target === 'api' || target === 'all') {
  fs.mkdirSync(path.join(root, 'api-tests/reports'), { recursive: true });
  const apiExtra = target === 'api' ? extra : '';
  const apiFailed =
    run(
      'npx newman run api-tests/DemoShopAPI.postman_collection.json ' +
        '-r cli,html,allure ' +
        `--reporter-html-export api-tests/reports/newman-report.html ${apiExtra}`
    ) !== 0;
  failed = failed || apiFailed;
}

// ---- Allure report (UI + API results combined) ----
// Playwright and newman-reporter-allure both write into ./allure-results (UI first, then API),
// so one Allure report covers whatever was just run.
if (fs.existsSync(path.join(root, UI_RESULTS))) {
  const genFailed = run(`npx allure generate ${UI_RESULTS} --clean -o allure-report`) !== 0;
  if (genFailed) {
    console.warn('\n[!] Allure report generation failed. Allure CLI needs Java (JDK 8+) installed.');
  } else {
    console.log('\nAllure report ready:  npm run report:allure:open');
  }
}
console.log('Playwright HTML report:  npm run report:html');
console.log('Newman HTML report:      api-tests/reports/newman-report.html');

process.exit(failed ? 1 : 0);
