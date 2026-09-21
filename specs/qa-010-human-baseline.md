# QA-010 — Human QA Baseline

## Purpose

This test analysis was created manually before reviewing any AI-generated test plan.

The AI Planner output was intentionally not available during this analysis to keep the Human vs AI comparison independent.

## Human Test Analysis

### UI

1. Verify the cart contains a `Promo code` input and an `Apply` button.

2. Verify the behavior of `Apply` when no promo code is entered.
   - Expected behavior is not defined by the requirement and requires clarification.

3. Add a product to the cart, apply `SAVE10`, and verify that a 10% discount is applied.

4. Verify that promo codes are case-insensitive, for example by applying `save10`.

5. Add a product, apply an invalid promo code, and verify that the operation fails and displays:
   `Invalid promo code`

6. Add a product, apply a valid promo code, then attempt to apply another promo code.
   - Verify that only one promo code can be applied.
   - Exact rejection behavior and message require clarification.

7. Add a product, apply `SAVE10`, and verify:
   - subtotal
   - discount
   - final total

### API / Network

8. Complete an order after applying `SAVE10` and verify that the discounted final total is used when the order is created.

## Requirement Gaps Identified During Human Analysis

- Can a promo code be applied to an empty cart?
- Should `Apply` be disabled when the promo input is empty?
- What happens when a second promo code is applied?
- What message, if any, should be displayed in that situation?
- Where, if anywhere, should the discounted total be shown after checkout?