# Playwright AI QA Lab

Portfolio QA automation project built with **Playwright + TypeScript** against a small e-commerce application, [QA Shop](https://github.com/lzdravecky/qa-shop).

The project demonstrates practical UI/API automation, framework design, CI, test isolation, and AI-assisted QA workflows — with human review of AI-generated output.

## Tech Stack

**Playwright · TypeScript · Node.js · GitHub Actions · Prettier · Husky · Playwright Test Agents · Playwright MCP · Codex**

## What's Covered

The suite covers several layers of testing:

- **UI:** products, search, cart, checkout, promo codes
- **API:** direct REST API validation
- **Network:** request/response validation and mocked failures
- **Cross-browser:** Chromium, Firefox and WebKit
- **Framework:** Page Objects, custom fixtures and reusable helpers
- **CI:** GitHub Actions with formatting checks, browser setup, tests and HTML report artifacts

The suite is intentionally kept compact. The goal is to demonstrate different testing techniques and QA decisions rather than create a large number of repetitive tests.

## Project Structure

```text
├── .github/workflows/     # GitHub Actions
├── fixtures/              # Custom Playwright fixtures
├── pages/                 # Page Objects
├── prompts/               # AI experiments and human reviews
├── specs/                 # Requirements and test plans
├── tests/
│   ├── api/               # API tests
│   ├── qa-010/            # Discount-code feature
│   └── products.spec.ts   # Product, cart and checkout tests
├── playwright.config.ts
└── tsconfig.json
```

## Test Design

The framework uses Page Objects for reusable UI interactions while keeping assertions and test intent in the specs.

Custom fixtures provide reusable dependencies such as:

```text
productsPage
checkoutPage
cleanCart
```

Tests use semantic Playwright locators where possible (`getByRole`, `getByLabel`, test IDs) and include examples of:

- request payload validation
- response validation
- API testing
- network interception and mocked server errors
- `test.step()` for structured flows
- UI + API verification within the same scenario

### QA-010 — Discount Code

QA-010 is a dedicated feature exercise covering:

- `SAVE10` discount calculation
- case-insensitive promo codes
- invalid-code validation
- multi-item totals
- prevention of promo stacking
- verification of the persisted order total through the backend API

The final scenario combines browser interaction with API verification to confirm that the total stored by the backend matches the discounted total shown to the user.

## AI-Assisted QA

The project also explores how AI can assist a QA workflow without replacing human review.

```text
Planner     → requirement → proposed test plan
Generator   → reviewed requirement → Playwright tests
Healer      → failing tests → investigation → targeted repair
MCP         → exploratory mission → direct browser exploration
                                      ↓
                                Human QA review
```

### Planner & Generator

A discount-code requirement was given to Playwright Test Agents.

The generated plan and tests were reviewed before being accepted. Human review removed duplication, parameterized suitable scenarios, refined coverage and separated UI verification from backend/API verification.

The reviewed requirements and plans are available under `specs/`, with AI prompts and review artifacts under `prompts/`.

### Healer

An intentional application change broke the product-search tests.

The Healer investigated the live application, identified the changed accessible name and repaired the shared Page Object locator. The change was then reviewed and verified with a full Chromium regression.

### Playwright MCP Exploratory Testing

Codex was also connected directly to the standalone `@playwright/mcp` server and given an exploratory testing mission without access to the existing automated tests.

The AI explored cart, promo and checkout behavior through the browser and network layer.

One interesting finding was a rapid double submission that produced two successful order requests. Manual reproduction was attempted three times without reproducing it, so the result was deliberately recorded as an **MCP-reproduced observation rather than a human-confirmed defect**.

The full experiment and human assessment are documented in `prompts/qa-010-07-mcp-exploratory-review.md`.

## Test Isolation

Parallel execution exposed a shared-state problem in the QA Shop backend.

The tests passed with one worker but interfered with each other when executed in parallel because cart state was originally global.

Instead of keeping the affected tests serial, the application was changed to isolate cart state by session.

```text
Before: shared global cart → parallel test interference
After:  session-based cart → 30/30 Chromium tests passing in parallel
```

This allowed the serial workaround to be removed and preserved independent tests.

## CI

GitHub Actions runs the complete suite on pushes and pull requests to `main`.

```text
Checkout test repository + QA Shop
        ↓
npm ci
        ↓
Prettier check
        ↓
Install Playwright browsers
        ↓
Run tests
        ↓
Upload HTML report
```

The suite contains **30 logical tests** across three browser projects:

```text
30 tests × Chromium / Firefox / WebKit = 90 CI test executions
```

CI uses one worker for predictable execution, while parallel execution is also verified locally.

## Run Locally

Clone both repositories as sibling directories:

```text
Projects/
├── playwright-ai-qa-lab/
└── qa-shop/
```

Install QA Shop:

```bash
git clone https://github.com/lzdravecky/qa-shop.git
cd qa-shop
npm ci
```

Install the Playwright project:

```bash
cd ..
git clone https://github.com/lzdravecky/playwright-ai-qa-lab.git
cd playwright-ai-qa-lab

npm ci
npx playwright install
```

Run all tests:

```bash
npx playwright test
```

QA Shop is started automatically by Playwright's `webServer` configuration.

Useful commands:

```bash
# Chromium only
npx playwright test --project=chromium

# Smoke tests
npx playwright test --grep @smoke

# HTML report
npx playwright show-report

# Formatting
npm run format:check
```

## Approach

This is intentionally a small test framework rather than a large demo suite.

The focus is on **test design, maintainability, isolation, API/UI coverage, CI and practical use of AI in QA**. Additional abstraction or test cases are added only when they demonstrate something useful rather than simply increasing the size of the project.
