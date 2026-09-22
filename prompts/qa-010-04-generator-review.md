# QA-010 — Generator Human Review / Correction Prompt

Apply the following human QA review corrections to the generated QA-010 Playwright tests.

The goal is to improve the generated test implementation without changing the QA-010 product requirements or application behavior.

## File Structure

Consolidate the QA-010 tests into:

`tests/qa-010/qa-010-discount-code.spec.ts`

Keep:

`tests/qa-010/support.ts`

Delete the individual QA-010 spec files that are replaced by the consolidated spec.

Do not modify `pages/ProductsPage.ts` or `tests/qa-010/support.ts`.

## QA-010-01 — Promo Controls

Simplify this test.

After `openPromoCart(...)`, verify only:

- Promo code input is visible.
- Apply button is visible.
- Promo code input is empty.
- Apply button is disabled.

Remove:

- `expectCartItem`
- entering `SAVE10`
- checking the entered promo-code value

Those behaviors belong to other scenarios.

## QA-010-02 — SAVE10 Calculation and Displayed Totals

Keep the generated behavior unchanged.

## QA-010-03 — Case-Insensitive Promo Codes

Replace the four duplicated case-insensitive spec files with one parameterized implementation covering:

- `SAVE10`
- `save10`
- `Save10`
- `SaVe10`

For each variant:

- open the cart
- apply the promo code
- verify the discounted totals

Remove `expectCartItem` from these cases because product price/arithmetic verification is already covered by QA-010-02.

## QA-010-04 — Invalid Promo Code

Simplify this test to verify only the requirement.

Use this behavior:

1. Open the cart.
2. Capture the current cart total using `innerText()`.
3. Apply `INVALID10`.
4. Verify the exact error message:
   `Invalid promo code`
5. Verify the cart total remains equal to the captured original total.

Remove:

- `expectCartItem`
- duplicate hardcoded total assertions
- conditional assertions using `isVisible()`

Do not invent requirements for whether subtotal or discount rows should be visible after an invalid code.

## QA-010-05 — Multi-Item Discount Calculation

Keep the generated behavior unchanged.

## QA-010-06 — Only One Promo Code

Keep:

- successful application of `SAVE10`
- first discounted-total verification
- promo input disabled after successful application
- Apply button disabled after successful application

Remove the second duplicate `expectDiscountedTotals(...)` assertion after checking the disabled controls.

Do not bypass the UI to attempt another promo code.

## QA-010-07 — Created Order Uses Discounted Total

Keep the generated behavior unchanged.

The test should continue to:

- complete checkout through the UI
- capture the POST `/api/orders` response
- identify the created order
- retrieve the authoritative stored order through the API
- compare the stored total with the expected discounted total
- compare the stored total with the total displayed in the cart

## Test Isolation

The raw generated QA-010 suite exposed a shared-state isolation problem.

Observed results:

- normal run with 4 workers: 10 tests failed
- diagnostic run with `--workers=1`: 10 tests passed

The QA Shop uses a shared global in-memory cart, so the existing `cleanCart` fixture cannot provide isolation when QA-010 tests execute concurrently against the same backend state.

Fix this only at the QA-010 suite level.

Add:

`test.describe.configure({ mode: 'serial' })`

inside the QA-010 describe block.

Do not change the global Playwright worker configuration.

Do not solve this by globally setting `workers: 1`.

## Constraints

Do not modify:

- the QA Shop application
- QA-010 requirement files
- QA-010 planning files
- `tests/seed.spec.ts`
- Playwright configuration
- fixtures
- CI configuration
- formatting configuration
- unrelated files

Keep `pages/ProductsPage.ts` unchanged.

Keep `tests/qa-010/support.ts` unchanged.

Run Prettier on the changed files.

Run the consolidated QA-010 suite in Chromium using the normal Playwright worker configuration.

Do not force `--workers=1`.

Report:

- files created
- files modified
- files deleted
- exact test command used
- test result

Do not commit or push changes.
