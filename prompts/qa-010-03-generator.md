# QA-010 — Generator Prompt

Use the Playwright Test Generator agent to implement automated tests for QA-010.

Use these files as the source of truth:

- `specs/qa-010-final-requirement.md`
- `specs/qa-010-discount-code-reviewed.md`

The QA Shop implementation is now complete and available at the configured baseURL.

Use the Playwright Test MCP browser tools to inspect and interact with the running application before generating tests.

Generate the QA-010 tests based on the final requirement and reviewed test plan.

## Instructions

- Do not modify the QA Shop application.
- Do not modify the requirement or planning files.
- Reuse the existing Playwright framework, Page Objects, fixtures, and conventions where appropriate.
- Prefer user-facing/accessible locators.
- Keep UI verification in UI tests.
- Verify the created order's discounted final total through the API/backend, as specified in the final requirement.
- Do not add tests for scenarios explicitly listed as out of scope.
- Do not invent unspecified behavior.
- Run the generated tests and fix issues in the test implementation if necessary.
- If a test fails because the application does not satisfy the requirement, report it as a product issue instead of changing the expected result to make the test pass.
