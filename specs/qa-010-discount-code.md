# QA-010 — Discount code test plan

## Application Overview

## Scope and status

Requirement: As a customer, I want to apply a promotional code in the cart so that I can receive a discount on my order.
This is a forward-looking plan for an unimplemented feature. Scenarios below are planned acceptance checks, not executed results. Current app exploration establishes navigation and fixtures only; missing promo controls are expected at this stage.

## Acceptance criteria

- AC1: Cart contains a "Promo code" input and "Apply" button.
- AC2: SAVE10 gives a 10% discount.
- AC3: Promo codes are case-insensitive.
- AC4: Invalid code displays "Invalid promo code".
- AC5: Only one promo code can be applied to an order.
- AC6: Cart displays subtotal, discount and final total after a valid code is applied.
- AC7: The discounted final total is used when the order is created.

## Observed application context

Explored with planner_setup_page using tests/seed.spec.ts and browser_snapshot at http://localhost:3000/. Products page contains search, product links/navigation, four product cards and Add-to-cart buttons: Mechanical Keyboard €89.90, Wireless Mouse €39.90, USB-C Dock €119.00, 27-inch Monitor €249.00. Adding a product increments the Cart count. Cart opens on the product page with item name/price, Total, Close cart and Checkout. Current cart has no promo controls. Checkout requests Full name and Email and offers Place order. Submitting synthetic local customer data produced Order confirmed / Thanks for your order; no order amount was visible. This observation does not establish future promo behavior.

## Execution conventions

Every scenario and every data row starts blank/fresh and is independent. Use isolated browser contexts and controlled test data; do not inherit the exploratory cart/order. Product prices above are fixture prerequisites, not permanent business requirements. Use only confirmed-invalid test data for the invalid-code case. Numeric examples avoid fractional-cent rounding. Proposed test file paths are future automation locations only; no test code is created by this plan. Success and failure conditions are explicit in each scenario. Blocked checks must remain distinct from failed checks.

## Ambiguities and missing requirements — do not invent expected outcomes

1. Second-code policy: only SAVE10 is defined. Reapplying it must not stack discounts, but rejecting/replacing another valid code, removal, editing, and retaining the original code after a failed second attempt are unspecified. Supply a second valid fixture and choose the policy before designing distinct-valid-code replacement/rejection assertions. The AC5 invariant remains at most one active promo and no stacking.
2. Blank input, whitespace-only input, trimming around SAVE10, punctuation, maximum length and non-ASCII handling are unspecified. Clarify whether these are invalid promo submissions or separate input-validation cases, and their messages. Do not presume an empty input must show Invalid promo code.
3. Empty-cart eligibility and whether promo controls appear/are enabled on an empty cart are unspecified. After clarification, start a fresh empty cart, inspect controls and submit SAVE10; expected acceptance/rejection and totals are pending.
4. Discount base and rounding: clarify shipping/tax/fees, exclusions, eligibility/minimum spend, currency precision, rounding mode and line-level versus order-level rounding. For a fractional-cent subtotal fixture, apply SAVE10 and compare only against the subsequently agreed rule. No rounding rule or extra eligible promotion is invented here.
5. Lifecycle: persistence on closing/reopening cart, navigation, refresh/new session, after order creation, and across orders is unspecified. Likewise clarify recalculation or invalidation if contents change after application; current observed cart exposes no quantity/removal controls. These lifecycle cases need agreed outcomes before becoming acceptance tests.
6. Feedback: valid-code success text, applied-code indicator, error placement/clearing, disabled states and processing/failure/retry behavior are unspecified. Their UI design is not asserted beyond the explicit labels/error and required amounts.
7. AC7 evidence dependency: the observed confirmation has no total. Agree an authoritative created-order inspection interface and its total/unit field, plus isolation/reset needs for repeatable tests. Do not add a required confirmation total or invent an API schema. Until evidence exists, the order-total assertion is blocked.
8. Optional extensions requiring product decisions: simultaneous Apply requests, server/network errors and promo changes while checkout is open. Specify state/error outcomes before asserting them; no unstated service behavior is included.

## Coverage and limitations

AC1 → 01; AC2 → 02, 03, 05, 06; AC3 → 03, 06; AC4 → 04; AC5 → 06 (distinct second valid code requires clarification); AC6 → 02, 03, 05; AC7 → 07 (authoritative evidence required). Boundary/negative coverage uses invalid nonempty input, case variations, multi-item arithmetic and repeated application. Undefined boundaries above are explicitly deferred, not silently assigned expected behavior.

## Test Scenarios

### 1. QA-010 — Defined acceptance behavior

**Seed:** `tests/seed.spec.ts`

#### 1.1. QA-010-01 — Cart exposes promo controls (AC1)

**File:** `tests/qa-010/promo-controls.spec.ts`

**Steps:**

1. Start from a new, isolated browser context with empty cart, no applied promo and no previous order in this scenario. Open http://localhost:3000/ using tests/seed.spec.ts. - expect: Products page is available. Each scenario and each parameterized data row runs independently from this fresh state.
2. Click "Add Mechanical Keyboard to cart", then open "Cart (1)". - expect: Cart contains one Mechanical Keyboard priced at €89.90. If fixtures have changed, restore the documented product data before executing these numeric checks.
3. Locate the "Promo code" input and "Apply" button in the cart; enter SAVE10 in the input. - expect: The cart contains an editable "Promo code" input and an "Apply" button. Success: both required controls are present and usable. Failure: either is absent or cannot accept/submit a code. This case does not prescribe behavior before Apply is clicked.

#### 1.2. QA-010-02 — SAVE10 discounts a single-item cart by exactly 10% (AC2, AC6)

**File:** `tests/qa-010/valid-promo.spec.ts`

**Steps:**

1. Start from a new, isolated browser context with empty cart, no applied promo and no previous order in this scenario. Open http://localhost:3000/ using tests/seed.spec.ts. - expect: Products page is available. Each scenario and each parameterized data row runs independently from this fresh state.
2. Click "Add Mechanical Keyboard to cart", then open "Cart (1)". - expect: Cart contains one Mechanical Keyboard priced at €89.90. If fixtures have changed, restore the documented product data before executing these numeric checks.
3. Enter SAVE10 in "Promo code" and click "Apply". - expect: Subtotal is €89.90, discount is €8.99, and final total is €80.91; the three amounts are distinguishable in the cart.
4. Compare displayed amounts with independently calculated €89.90 × 10% and €89.90 − €8.99. - expect: Success: subtotal €89.90, discount €8.99, final total €80.91 are displayed after application. Failure: missing/indistinguishable amounts, wrong rate, changed subtotal, or inconsistent final total. No exact success-message wording or discount-sign formatting is specified.

#### 1.3. QA-010-03 — All letter-case variants are accepted independently (AC2, AC3, AC6)

**File:** `tests/qa-010/case-insensitive-promo.spec.ts`

**Steps:**

1. Start from a new, isolated browser context with empty cart, no applied promo and no previous order in this scenario. Open http://localhost:3000/ using tests/seed.spec.ts. - expect: Products page is available. Each scenario and each parameterized data row runs independently from this fresh state.
2. Click "Add Mechanical Keyboard to cart", then open "Cart (1)". - expect: Cart contains one Mechanical Keyboard priced at €89.90. If fixtures have changed, restore the documented product data before executing these numeric checks.
3. Run separately from a fresh state for each code: SAVE10, save10, Save10, SaVe10. Enter the row value in "Promo code" and click "Apply". - expect: Each value produces subtotal €89.90, discount €8.99 and final total €80.91. Success: every row has identical 10% arithmetic. Failure: any variant is rejected or yields different amounts.

#### 1.4. QA-010-04 — Invalid code displays the required error (AC4)

**File:** `tests/qa-010/invalid-promo.spec.ts`

**Steps:**

1. Start from a new, isolated browser context with empty cart, no applied promo and no previous order in this scenario. Open http://localhost:3000/ using tests/seed.spec.ts. - expect: Products page is available. Each scenario and each parameterized data row runs independently from this fresh state.
2. Click "Add Mechanical Keyboard to cart", then open "Cart (1)". - expect: Cart contains one Mechanical Keyboard priced at €89.90. If fixtures have changed, restore the documented product data before executing these numeric checks.
3. Enter a nonempty code confirmed absent from the test promotion data, e.g. NOT_A_PROMO_QA010, and click "Apply". - expect: Visible error text is exactly "Invalid promo code". The confirmed-invalid value grants no promotional discount; merchandise amount remains €89.90. Success: required error and no discount. Failure: wrong/missing error or an invalid code gives a discount. Do not infer error location, styling, duration, or zero-discount display requirements.

#### 1.5. QA-010-05 — Discount covers a multi-item cart (AC2, AC6)

**File:** `tests/qa-010/multi-item-discount.spec.ts`

**Steps:**

1. Start from a new, isolated browser context with empty cart, no applied promo and no previous order in this scenario. Open http://localhost:3000/ using tests/seed.spec.ts. - expect: Products page is available. Each scenario and each parameterized data row runs independently from this fresh state.
2. Click "Add Mechanical Keyboard to cart" and "Add Wireless Mouse to cart"; open the cart. - expect: Cart contains the €89.90 keyboard and €39.90 mouse; combined merchandise subtotal is €129.80.
3. Enter SAVE10 in "Promo code" and click "Apply". - expect: Subtotal €129.80, discount €12.98 and final total €116.82 are displayed. Success: one 10% discount covers the combined subtotal. Failure: discount applies to only one item, applies repeatedly, or totals are wrong. Fixtures contain no separate shipping/tax amounts; additional charge treatment requires clarification.

#### 1.6. QA-010-06 — Repeated application cannot stack discounts (AC2, AC3, AC5)

**File:** `tests/qa-010/no-stacking.spec.ts`

**Steps:**

1. Start from a new, isolated browser context with empty cart, no applied promo and no previous order in this scenario. Open http://localhost:3000/ using tests/seed.spec.ts. - expect: Products page is available. Each scenario and each parameterized data row runs independently from this fresh state.
2. Click "Add Mechanical Keyboard to cart", then open "Cart (1)". - expect: Cart contains one Mechanical Keyboard priced at €89.90. If fixtures have changed, restore the documented product data before executing these numeric checks.
3. Enter SAVE10 in "Promo code" and click "Apply". - expect: Subtotal is €89.90, discount is €8.99, and final total is €80.91; the three amounts are distinguishable in the cart.
4. If promo submission remains available, submit SAVE10 again, then submit save10. If controls are disabled/removed after the first application, record that prevention and inspect totals without forcing hidden controls. - expect: At most one promo is applied. Repeated/case-varied submission must not create additional discounts: with SAVE10 still active and the cart unchanged, discount remains €8.99 and final total €80.91. Success: only one discount is active and no stacking occurs. Failure: multiple active promos or repeated percentage deductions. No specific rejection message, disabled-control design, or reapplication message is required. Unexpected clearing of the existing promo needs product clarification; do not invent that policy.

#### 1.7. QA-010-07 — Created order uses the discounted total (AC7; evidence dependency)

**File:** `tests/qa-010/discounted-order-total.spec.ts`

**Steps:**

1. Start from a new, isolated browser context with empty cart, no applied promo and no previous order in this scenario. Open http://localhost:3000/ using tests/seed.spec.ts. - expect: Products page is available. Each scenario and each parameterized data row runs independently from this fresh state.
2. Click "Add Mechanical Keyboard to cart", then open "Cart (1)". - expect: Cart contains one Mechanical Keyboard priced at €89.90. If fixtures have changed, restore the documented product data before executing these numeric checks.
3. Enter SAVE10 in "Promo code" and click "Apply". - expect: Subtotal is €89.90, discount is €8.99, and final total is €80.91; the three amounts are distinguishable in the cart.
4. Before submission, arrange read-only evidence of the authoritative created-order total tied to this test order (an approved order API/record, or equivalent test instrumentation). Do not guess an endpoint or payload field. Then click "Checkout", fill "Full name" with "QA Promo Customer" and "Email" with "qa.promo.customer@example.test", and click "Place order" once. - expect: The existing flow reaches "Order confirmed". The evidence source identifies the order created by this scenario. If no authoritative amount can be observed, mark the AC7 assertion BLOCKED rather than passing it from the confirmation text.
5. Inspect the created order's authoritative final total and compare it with the cart's €80.91, converting minor/major currency units according to the agreed evidence contract. - expect: Success: created-order final total equals €80.91 and the discounted cart total. Failure: order uses €89.90 or any incorrect amount. A request payload alone or an amountless success message does not prove the created order stored/used the discount. Confirmation-page amount display is not required by QA-010.
