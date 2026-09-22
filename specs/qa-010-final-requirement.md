# QA-010 — Discount Code — Final Requirement

## User Story

As a customer, I want to apply a promotional code in the cart so that I can receive a discount on my order.

## Acceptance Criteria

1. Promo controls are available when the cart contains at least one product.

2. The cart contains:
   - `Promo code` input
   - `Apply` button

3. `Apply` is disabled when the promo-code input is empty.

4. Promo code `SAVE10` applies a 10% discount to the merchandise subtotal.

5. Promo codes are case-insensitive.
   - For example, `SAVE10`, `save10`, `Save10`, and other letter-case variants represent the same promo code.

6. An invalid promo code:
   - displays exactly `Invalid promo code`
   - does not apply a discount
   - leaves the cart totals unchanged

7. After a valid promo code is applied, the cart displays:
   - subtotal
   - discount
   - final total

8. Only one promo code can be applied to an order.
   - After a promo code is successfully applied, the promo-code input and `Apply` button are disabled.
   - Another promo code therefore cannot be applied to the same order.

9. The discounted final total must be used when the order is created.

## Verification Strategy

### UI

Verify through the browser:

- promo controls
- disabled `Apply` for empty input
- valid `SAVE10`
- case-insensitive promo code
- invalid promo-code feedback
- subtotal, discount and final total
- multi-item discount calculation
- prevention of applying another promo code

### API / Backend

The created order's final total must be verified using an authoritative API/backend representation of the created order.

The existing `Order confirmed` UI does not display the order amount and therefore is not sufficient evidence for this acceptance criterion.

## Out of Scope

The following are intentionally outside the scope of QA-010:

- whitespace/trimming rules
- punctuation and non-ASCII promo-code validation
- maximum promo-code length
- shipping and tax discount rules
- complex rounding rules
- promo persistence across refresh or browser sessions
- promo reuse across separate orders
- concurrency
- network/server failure behavior
