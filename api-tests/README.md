# API automation (Part C) — jsonplaceholder `/users`

Collection: `DemoShopAPI.postman_collection.json` (runs from the command line with Newman, no Postman app needed).

## What it does

| # | Request | Checks |
|---|---|---|
| 1 | `GET /users` | status 200 · non-empty array · user objects · every user has `id`, `name`, `email` · saves one random user's id in `{{userId}}` (and the full user in `{{originalUser}}`) |
| 2 | `PUT /users/{{userId}}` | body = the original user with **only** `name`, `email`, `company.name` replaced by dynamic (timestamp-based) values · status 200 · returned `id` equals the saved variable · `phone` not empty · returned `name` equals the updated name (email and company.name are checked too) |

Every request asserts the status code.

## Run

From the repo root (Newman and the reporters are devDependencies, so `npm install` is enough):

```bash
npm run test:api
```

This runs the collection and then builds the reports:

- CLI output
- HTML report: `api-tests/reports/newman-report.html`
- Allure report: `allure-report/` (open with `npm run report:allure:open`)

Plain Newman, without reports:

```bash
npx newman run api-tests/DemoShopAPI.postman_collection.json
```

Optional: import the JSON into Postman (File → Import) and run it with the Collection Runner (GET first, then PUT).
