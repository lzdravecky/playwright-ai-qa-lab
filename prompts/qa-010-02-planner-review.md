# QA-010 — Planner Human Review Prompt

Review and revise the existing QA-010 test plan based on the human QA review below.

Keep the original test plan unchanged and save the revised version as a separate file:

`specs/qa-010-discount-code-reviewed.md`

## Human QA Review

### Requirement ambiguities

1. Promo controls on an empty cart:
   - Clarification is needed whether promo controls should be available when the cart is empty.

2. Empty promo-code input:
   - Clarification is needed whether `Apply` should be disabled when no promo code is entered.

3. Second promo-code application:
   - The requirement states that only one promo code can be applied.
   - Clarification is needed about the expected behavior after a promo code has already been successfully applied.
   - Do not invent a rejection message or other behavior.

4. Created-order total:
   - The existing `Order confirmed` UI does not display the order amount.
   - Verifying that the discounted final total is actually used when the order is created therefore requires authoritative API/backend evidence.

### Scenario review

1. Promo controls:
   - KEEP.

2. SAVE10 with one product and displayed totals:
   - KEEP.

3. Case-insensitive promo codes:
   - KEEP.

4. Invalid promo code:
   - KEEP.
   - The requirement already defines the exact expected message as `Invalid promo code`.
   - Do not invent additional invalid-code behavior.

5. Multi-item discount:
   - KEEP.
   - This is useful for verifying that the 10% discount is calculated from the complete merchandise subtotal.
   - It may later be parameterized or combined with the single-item calculation scenario.

6. Only one promo code:
   - KEEP, but mark the exact second-application behavior as requiring clarification.
   - Do not invent how the application rejects or handles a second promo code.

7. Created order uses discounted total:
   - KEEP, but move the authoritative verification to API/backend.
   - UI confirmation alone is not sufficient evidence because it does not display the order amount.

## Scope

Remove or avoid scenarios that go beyond the current QA-010 requirement, including:

- whitespace/trimming behavior
- punctuation and non-ASCII promo-code validation
- maximum promo-code length
- shipping and tax discount rules
- complex rounding rules
- promo persistence across refresh or browser sessions
- promo reuse across separate orders
- concurrency
- network/server failure behavior

Do not generate Playwright test code.

Do not modify the application.

Do not modify the original AI-generated test plan.

Create only the revised reviewed test plan.
