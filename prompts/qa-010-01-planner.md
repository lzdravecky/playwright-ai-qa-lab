# QA-010 — AI Planner Prompt

Use the playwright_test_planner agent to create a test plan for the following requirement.

## Requirement

QA-010 – Discount code

As a customer, I want to apply a promotional code in the cart so that I can receive a discount on my order.

Acceptance criteria:

1. Cart contains a `Promo code` input and `Apply` button.
2. Code `SAVE10` gives a 10% discount.
3. Promo codes are case-insensitive.
4. Invalid code displays `Invalid promo code`.
5. Only one promo code can be applied to an order.
6. Cart displays subtotal, discount and final total after a valid code is applied.
7. The discounted final total is used when the order is created.

## Instructions

Use the Playwright Test MCP browser tools to inspect and interact with the running application before creating the test plan.

Base the test plan on the requirement and on behavior that can be observed through the application.

Identify ambiguities or missing behavior in the requirement instead of inventing expected behavior.

Include appropriate UI, calculation, validation, and order-creation scenarios.

Do not generate Playwright test code yet.

Save the resulting test plan to the `specs` directory.
