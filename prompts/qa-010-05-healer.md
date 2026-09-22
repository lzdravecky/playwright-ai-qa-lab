# QA-010 AI Workflow — Healer Prompt

## Context

An intentional application change has caused existing human-written Playwright tests to fail.

The application change is correct and must not be reverted.

## Prompt

Use the Playwright Healer agent to investigate and heal the failing tests in:

`tests/products.spec.ts`

Run and inspect this test suite, determine why the tests fail, and update only the Playwright test automation where necessary.

Do not modify QA Shop.

Use the application and available Playwright tooling to determine the cause of the failures. Do not assume the existing test implementation is correct.

After healing, rerun `tests/products.spec.ts` against Chromium to verify the fix.

Do not make unrelated refactoring or cleanup changes.
