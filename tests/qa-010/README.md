# QA-010 — Discount Code Tests

Source of truth:

- `specs/qa-010-final-requirement.md`
- `specs/qa-010-discount-code-reviewed.md`

The final requirement resolves the reviewed plan's open questions, including:

- promo controls are available when the cart contains a product
- empty promo input disables `Apply`
- `SAVE10` applies a 10% discount to the merchandise subtotal
- promo codes are case-insensitive
- successful application disables both promo controls
- invalid codes display `Invalid promo code` and leave the cart total unchanged
- only one promo code can be applied
- the created order must use the discounted final total

## Running the Tests

Run the QA-010 suite against Chromium:

```sh
npx playwright test tests/qa-010/qa-010-discount-code.spec.ts --project=chromium
```

Run the complete Chromium suite:

```sh
npx playwright test --project=chromium
```

## Coverage

The QA-010 suite verifies:

- promo controls are displayed when the cart contains a product
- empty promo input keeps the Apply button disabled
- `SAVE10` applies a 10% discount
- promo codes are case-insensitive
- invalid promo codes display the required error message
- invalid promo codes do not change the cart total
- discount calculation works with multiple products
- promo codes cannot be stacked
- promo controls are disabled after successful application
- the created order stores the discounted final total

## Created Order Verification

The checkout scenario verifies the feature across both UI and API layers.

The test:

1. adds a product through the UI
2. applies `SAVE10`
3. verifies the discounted totals in the cart
4. completes checkout through the UI
5. waits for the `POST /api/orders` response
6. retrieves the created order through `GET /api/orders/:id`
7. verifies that the stored backend total matches the discounted total displayed in the UI

This provides end-to-end verification that the promotion is not only displayed correctly in the cart but is also persisted correctly in the created order.

## Parallel Execution and Test Isolation

The first AI-generated version of the QA-010 suite exposed a test-isolation problem in QA Shop.

When the 10 QA-010 tests were executed normally with four Playwright workers, all 10 failed. Running the same tests with a single worker resulted in all 10 passing.

The initial workaround was to serialize the QA-010 suite with:

```ts
test.describe.configure({ mode: 'serial' })
```

Further testing showed that this did not solve the underlying problem. When the complete Chromium project was executed with four workers, QA-010 tests could still interfere with existing cart tests.

The root cause was in QA Shop: the backend stored the cart and applied promo code in shared global variables. All browser contexts and Playwright workers therefore operated on the same cart.

QA Shop was updated to isolate cart state per client session. After the backend fix, the temporary serial configuration was removed from QA-010.

Final verification:

- QA-010: 10/10 tests passed with 4 workers
- full Chromium project: 30/30 tests passed with 4 workers
- no global reduction of the Playwright worker count was required

This became an important part of the AI-assisted testing experiment: the generated tests exposed a real concurrency and test-isolation issue, while human investigation identified and fixed the root cause instead of permanently hiding it by disabling parallel execution.

## AI-Assisted Workflow

QA-010 was used as an experiment in AI-assisted test development.

The workflow was:

1. create a human test-design baseline
2. provide the requirement to the Playwright Planner agent
3. review the AI-generated test plan
4. clarify missing and ambiguous requirements
5. provide the reviewed requirement to the Generator agent
6. review and simplify the generated Playwright implementation
7. execute the generated suite in parallel
8. investigate the test-isolation failures exposed by parallel execution
9. fix the root cause in QA Shop
10. remove the temporary serialization workaround
11. verify the final suite with normal parallel execution

The prompts used during this process are stored in the `prompts/` directory, while the human baseline and reviewed requirements are stored in `specs/`.
