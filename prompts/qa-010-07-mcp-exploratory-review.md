# QA-010 AI Workflow — Playwright MCP Exploratory Review

## Experiment

After completing the Planner, Generator, and Healer workflows, Playwright MCP was used directly for exploratory testing.

Unlike the previous AI workflows, no Playwright Test Agent was used.

Codex acted as the AI client and used the standalone `@playwright/mcp` server to interact directly with the running QA Shop application through a browser.

The exploratory scope was intentionally limited to:

- Cart
- promo code
- checkout

The AI was instructed not to:

- read the existing Playwright tests
- use the automated suite as a test plan
- modify application or test code
- generate automated tests

The goal was to evaluate Playwright MCP as an AI browser interface for independent exploratory testing rather than test generation or test repair.

## Exploratory Prompt

The AI was instructed to explore the application as a user would, including normal flows and reasonable edge cases.

It was allowed to inspect:

- browser-visible state
- accessibility information
- network activity
- console output

The final report had to distinguish reproduced findings from risks or observations that had not actually been reproduced.

## MCP Exploration

The exploratory session exercised:

- empty cart behavior
- multiple products
- repeated product additions
- closing and reopening the cart
- cart state across page reload
- invalid promo code
- valid `SAVE10` promo code
- discount recalculation after changing cart contents
- empty checkout fields
- whitespace-only customer name
- malformed email
- successful checkout
- double-click submission
- reopening checkout after order confirmation

The AI used the browser and network information directly instead of deriving scenarios from the existing automated tests.

## Behaviors That Worked Correctly

The exploratory session confirmed several expected behaviors:

- repeated product additions increased quantity and cart count
- `SAVE10` correctly applied a 10% discount
- discount totals recalculated after another product was added
- cart contents and the applied discount survived page reload
- an invalid promo code was rejected without changing the total
- empty checkout fields were rejected
- a whitespace-only customer name was rejected
- malformed email input triggered validation
- a normal single-click checkout returned HTTP 201 and displayed order confirmation

## Findings

### 1. Duplicate order submission

**MCP result: REPRODUCED**

The AI double-clicked the `Place order` button.

Network inspection showed two separate:

```text
POST /api/orders
```

requests.

Both returned:

```text
201 Created
```

and created different order IDs with identical customer, cart, promo, and total information.

This indicates that sufficiently rapid repeated submission can result in multiple orders being created.

### Human verification

The finding was independently checked manually after the MCP session.

Three manual attempts were made to reproduce the behavior by clicking the `Place order` button twice as quickly as possible.

The duplicate order could not be reproduced manually.

**Human verdict: MCP-reproduced finding, not independently reproduced manually.**

The finding is therefore retained as a valid automated observation with concrete network evidence, but it is not classified as independently human-confirmed.

The difference may be timing-related: Playwright's programmatic `dblclick()` can generate repeated interaction faster and more consistently than manual mouse input.

No application fix was implemented as part of this experiment.

---

### 2. Purchased items remain in the cart after successful checkout

**MCP result: REPRODUCED**

After successful checkout, the purchased products remained in the cart.

The checkout flow could be opened again and another order could be submitted using the same cart contents.

**Human verdict: NOT INDEPENDENTLY VERIFIED**

This behavior may be intentional or may represent missing post-order cart cleanup depending on product requirements.

It is therefore documented as a reproduced MCP observation rather than automatically classified as a defect.

---

### 3. Promo input loses its displayed value after reload

**MCP result: REPRODUCED**

After applying `SAVE10` and reloading the application:

- the discount remained applied
- the promo input remained disabled
- the promo input displayed no promo code

**Human verdict: NOT INDEPENDENTLY VERIFIED**

The underlying promotion state persisted correctly, but the displayed UI state was inconsistent with that persisted state.

Whether the promo code must remain visible after reload is requirements-dependent.

---

### 4. Previous order confirmation remains visible during another checkout

**MCP result: REPRODUCED**

After completing an order and reopening checkout, the previous `Order confirmed` state remained visible together with the new checkout form.

**Human verdict: NOT INDEPENDENTLY VERIFIED**

This is retained as a reproduced usability/state-management observation.

---

### 5. Empty-cart Checkout is enabled without feedback

**MCP result: REPRODUCED**

The Checkout button was available when the cart was empty.

Clicking it produced no visible result or explanation.

**Human verdict: USABILITY OBSERVATION**

This does not necessarily violate an existing requirement, but disabling the action or providing feedback would produce clearer user behavior.

---

## Requirements-Dependent Observations

The exploratory session also noted that:

- cart items cannot be removed or decreased
- an applied promo cannot be removed
- checkout does not display an order summary
- order confirmation does not display an order ID or total

These were not classified as defects because no requirement established that these capabilities must exist.

This distinction is important: missing functionality should not automatically be reported as a bug without a supporting requirement.

## Untested Risks

The AI explicitly identified several areas that it had not verified:

- promo whitespace normalization
- additional promo normalization behavior
- multiple-tab state consistency
- network-failure recovery

These were correctly reported as untested risks rather than reproduced defects.

## Human Review

**Verdict: KEEP**

The MCP exploratory session provided useful results beyond the existing scripted automation.

The strongest finding was the duplicate-order scenario. The AI independently exercised a rapid double submission, inspected the resulting network traffic, and identified two successful order creations.

Human review did not blindly accept this as a confirmed application defect. Independent manual reproduction was attempted three times and was unsuccessful, so the final classification preserves both pieces of evidence:

- reproduced programmatically through Playwright MCP
- not reproduced manually

The remaining findings are retained as exploratory observations and potential candidates for future requirements or automated coverage rather than automatically expanding the current regression suite.

No additional automated tests or application fixes were added solely because the AI suggested them.

## Conclusion

This experiment demonstrated a different use of AI from the earlier Playwright Test Agent workflows.

The project used:

```text
Planner
    requirement → browser exploration → proposed test plan

Generator
    reviewed requirement → generated Playwright automation

Healer
    failing existing tests → browser investigation → targeted automation repair

Playwright MCP exploratory testing
    broad testing mission → direct browser interaction → independent observations and findings
```

For the exploratory experiment, Codex acted as the AI client while `@playwright/mcp` provided direct browser interaction.

The workflow was:

```text
exploratory mission
        ↓
Codex
        ↓
Playwright MCP
        ↓
live browser / QA Shop
        ↓
exploration + network inspection
        ↓
AI findings
        ↓
human QA review
        ↓
independent verification where appropriate
```

The important result was not simply that AI could operate the browser. The experiment demonstrated that AI-generated exploratory findings still require normal QA judgment: evidence must be reviewed, requirements must be considered, reproduced behavior must be distinguished from speculation, and automated findings do not automatically become defects or regression tests.
