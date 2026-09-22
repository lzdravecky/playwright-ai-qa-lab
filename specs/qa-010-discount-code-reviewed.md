# QA-010 - Discount code: reviewed test plan

## Scope and status

As a customer, I want to apply a promotional code in the cart so that I can receive a discount on my order.

The feature is not implemented. These are planned acceptance checks, not executed results. This revision incorporates human QA feedback and preserves the original browser discoveries. No tests or application code are included.

## Acceptance criteria

- AC1: Cart contains a "Promo code" input and "Apply" button.
- AC2: SAVE10 gives a 10% discount.
- AC3: Promo codes are case-insensitive.
- AC4: Invalid code displays "Invalid promo code".
- AC5: Only one promo code can be applied to an order.
- AC6: Cart displays subtotal, discount and final total after a valid code is applied.
- AC7: The discounted final total is used when the order is created.

## Existing browser-grounded context

The original exploration used `planner_setup_page`, `tests/seed.spec.ts` and `browser_snapshot` at `http://localhost:3000/`. The Products page has search, product links/navigation and four product cards with Add-to-cart buttons:

| Product             | Observed price |
| ------------------- | -------------: |
| Mechanical Keyboard |      EUR 89.90 |
| Wireless Mouse      |      EUR 39.90 |
| USB-C Dock          |     EUR 119.00 |
| 27-inch Monitor     |     EUR 249.00 |

Adding a product increments the Cart count. The cart opens on the product page and shows item name/price, Total, Close cart and Checkout. Promo controls are currently absent. Checkout requests Full name and Email and provides Place order. A submission with synthetic local customer data reached "Order confirmed" / "Thanks for your order"; the confirmation did not display an order amount. These observations establish navigation and fixtures, not future promo behavior.

## Execution conventions

Every scenario and data case starts from a fresh isolated browser context, an empty cart, no applied promo and no order created by that case. Open `http://localhost:3000/` using `tests/seed.spec.ts`. Cases are independent and can run in any order. Confirm the documented product prices before executing arithmetic assertions; changed fixtures require corresponding agreed test data. Missing promo controls before implementation are a readiness limitation, not an executed failure report.

For the standard single-item setup, click "Add Mechanical Keyboard to cart", then open "Cart (1)" and verify one keyboard priced at EUR 89.90. Each scenario below explicitly builds its own cart. Use confirmed-invalid promotion data for the negative case. Record blocked checks separately from failures.

## Clarifications and dependencies

1. **Repeated/second code:** Define behavior when SAVE10 is applied again (including a case variant), and when a different valid promo is submitted. AC5 requires no stacking, but does not specify rejection, replacement, retaining/clearing the existing code, or whether further submission remains available. Provide a second valid code and its defined discount to complete the distinct-code case. Feedback and effects of an invalid second submission on an existing promo also need definition; AC4 still supplies the invalid-code message.
2. **Empty cart:** Should promo controls appear or be enabled, and should SAVE10 be accepted in an empty cart? Expected behavior remains open; no empty-cart pass/fail policy is assigned.
3. **UI feedback:** Success text, an applied-code indicator, error placement/clearing and control states are undefined. Assert only the required controls, exact invalid-code message and required amounts. Clarify any feedback to be tested for repeated/second-code application.
4. **Created-order evidence:** Identify the authoritative API or equivalent backend record/instrumentation exposing the created order's final total, currency units and reliable correlation to this test's order. The exact interface remains a dependency. A client request payload or confirmation text alone is insufficient. AC7 is blocked until this evidence is available.

Detailed input-format boundaries, rounding, tax, shipping, complex discount-base rules, promo lifecycle/persistence, concurrency, network failures and similar robustness scenarios are outside this project's scope.

## Test scenarios

### QA-010-01 - Cart exposes promo controls

**Coverage:** AC1. **Layer:** UI.

**Starting state:** Fresh state as defined above.

1. Add one Mechanical Keyboard and open the cart.
2. Locate the "Promo code" input and "Apply" button.
3. Enter SAVE10 in the input.

**Expected / success:** Both controls are present in the cart and the input accepts the code. Submission is exercised in QA-010-02.

**Failure:** Either required control is absent or the input cannot be edited. No behavior before clicking Apply is prescribed.

### QA-010-02 - SAVE10 calculation and displayed totals

**Coverage:** AC2, AC6. **Layer:** UI. QA-010-05 is the multi-item data variant of this scenario.

**Starting state:** Fresh state separately for each row.

| Case      | Products to add, one each           |   Subtotal | Discount (10%) | Final total |
| --------- | ----------------------------------- | ---------: | -------------: | ----------: |
| QA-010-02 | Mechanical Keyboard                 |  EUR 89.90 |       EUR 8.99 |   EUR 80.91 |
| QA-010-05 | Mechanical Keyboard, Wireless Mouse | EUR 129.80 |      EUR 12.98 |  EUR 116.82 |

1. Add the products in the selected row and open the cart.
2. Confirm the cart contains those products at their documented prices.
3. Enter SAVE10 in "Promo code" and click "Apply".
4. Compare displayed subtotal, discount and final total with the row, independently calculating discount as subtotal multiplied by 10% and final total as subtotal minus discount.

**Expected / success:** All three amounts are displayed and distinguishable, and match the row. QA-010-05 verifies the combined value of both products receives one 10% discount.

**Failure:** An amount is missing or indistinguishable, the arithmetic is incorrect, or only one product contributes to the multi-item discount. No exact success message or discount-sign formatting is asserted.

### QA-010-03 - Case-insensitive promo codes

**Coverage:** AC2, AC3, AC6. **Layer:** UI.

**Starting state:** Fresh state separately for each value: `SAVE10`, `save10`, `Save10`, `SaVe10`.

1. Add one Mechanical Keyboard and open the cart.
2. Enter the selected value in "Promo code" and click "Apply".
3. Inspect subtotal, discount and final total.

**Expected / success:** Every value produces subtotal EUR 89.90, discount EUR 8.99 and final total EUR 80.91.

**Failure:** A tested case variant is rejected or produces different amounts.

### QA-010-04 - Invalid code displays the required message

**Coverage:** AC4. **Layer:** UI.

**Starting state:** Fresh state and a nonempty code confirmed invalid in the test promotion data.

1. Add one Mechanical Keyboard and open the cart.
2. Enter the confirmed-invalid code in "Promo code" and click "Apply".
3. Inspect the visible feedback.

**Expected / success:** The UI displays the exact text "Invalid promo code".

**Failure:** The required message is absent or its text differs. No additional expectations are assigned to input clearing, control states, error placement, duration or totals presentation after this submission.

### QA-010-06 - Only one promo can apply; no stacking

**Coverage:** AC5. **Layer:** UI, supplemented by authoritative backend evidence if needed to establish applied promotions.

**Starting state:** Fresh state separately for each second-submission variant: SAVE10 again, `save10`, a different valid code, and a confirmed-invalid code. The different-valid-code variant requires a defined fixture and discount.

1. Add one Mechanical Keyboard and open the cart.
2. Apply SAVE10 and verify subtotal EUR 89.90, discount EUR 8.99 and final total EUR 80.91.
3. If the UI permits another submission, enter the selected second code and click "Apply". If it prevents further submission, record that behavior without forcing hidden controls.
4. Inspect the resulting applied promotion(s) and amounts using available UI or agreed authoritative evidence.

**Defined expected / success:** At most one promo applies to the order; no stacked or compounded promo discounts occur. If SAVE10 remains the sole applied promo and the cart is unchanged, its discount is EUR 8.99 and final total EUR 80.91. If an invalid second code is submitted, AC4 requires "Invalid promo code".

**Failure:** Multiple promos apply or repeated submission adds a further discount.

**Requires clarification:** The permitted second-submission interaction and resulting selection, totals and feedback depend on the policy in clarification 1. Do not assert rejection, replacement, retention, clearing or a new message. Report the no-stacking invariant separately from these blocked policy checks. The distinct-valid-code variant cannot be completed until its fixture and policy are defined.

### QA-010-07 - Created order uses discounted total

**Coverage:** AC7. **Layer:** Authoritative API/backend verification, with the existing UI flow used to create the order.

**Starting state:** Fresh state plus the agreed authoritative order-total interface, units and order-correlation mechanism from dependency 4. If unavailable, mark this verification blocked.

1. Add one Mechanical Keyboard and open the cart.
2. Apply SAVE10 and verify the cart's subtotal EUR 89.90, discount EUR 8.99 and final total EUR 80.91.
3. Click "Checkout", enter "QA Promo Customer" in "Full name" and a unique synthetic test email in "Email", then click "Place order" once.
4. Identify this created order through the agreed correlation mechanism. The observed UI flow reaches "Order confirmed", but that text does not prove the amount.
5. Read the created order's authoritative final total through the agreed API or equivalent backend evidence. Interpret its currency units according to that interface and compare with EUR 80.91 and the discounted cart total.

**Expected / success:** The identified created order uses a final total of EUR 80.91, matching the discounted cart total.

**Failure:** The authoritative created-order total is EUR 89.90 or another incorrect amount.

**Blocked:** The authoritative amount cannot be retrieved or reliably linked to this order. Do not pass from a request payload or amountless confirmation. No confirmation-page total display is required, and no endpoint or schema is invented.

## Coverage summary

| Acceptance criterion      | Planned scenario(s)                                          |
| ------------------------- | ------------------------------------------------------------ |
| AC1 - Promo controls      | QA-010-01                                                    |
| AC2 - 10% discount        | QA-010-02, QA-010-03, QA-010-05 data variant                 |
| AC3 - Case-insensitive    | QA-010-03                                                    |
| AC4 - Invalid message     | QA-010-04; applicable second-submission variant in QA-010-06 |
| AC5 - One promo only      | QA-010-06; second-code policy partly blocked                 |
| AC6 - Cart amounts        | QA-010-02, QA-010-03, QA-010-05 data variant                 |
| AC7 - Created-order total | QA-010-07; authoritative interface dependency                |
