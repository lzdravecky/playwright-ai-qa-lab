# QA-010 AI Workflow — Healer Review

## Experiment

An intentional application change was introduced in QA Shop:

- product search label changed from `Search products` to `Find products`
- the application change was considered correct
- existing Playwright automation was intentionally left unchanged

The Healer was not told what changed, which tests would fail, or which locator was affected.

## Baseline

Before using the Healer, the existing human-written Products suite was executed against Chromium:

```sh
npx playwright test tests/products.spec.ts --project=chromium
```

Result:

- 10 tests executed
- 8 passed
- 2 failed

Both failures timed out while attempting to locate the product search input.

The shared Page Object still used:

```ts
await this.page.getByLabel('Search products').fill(product)
```

No test automation was changed before starting the Healer experiment.

## Healer Prompt

The Healer received the following task:

> Use the Playwright Healer agent to investigate and heal the failing tests in:
>
> `tests/products.spec.ts`
>
> Run and inspect this test suite, determine why the tests fail, and update only the Playwright test automation where necessary.
>
> Do not modify QA Shop.
>
> Use the application and available Playwright tooling to determine the cause of the failures. Do not assume the existing test implementation is correct.
>
> After healing, rerun `tests/products.spec.ts` against Chromium to verify the fix.
>
> Do not make unrelated refactoring or cleanup changes.

The prompt intentionally did not reveal the changed label or the expected solution.

## Healer Investigation

The Playwright Healer:

1. executed the existing Products suite
2. reproduced the result of 8 passing and 2 failing tests
3. identified that both failures originated from the shared search locator in `ProductsPage`
4. inspected the live application
5. identified that the search field was now accessible as `Find products`
6. verified that the search functionality and existing assertions still behaved correctly
7. updated only the affected locator in the shared Page Object
8. reran the Products suite against Chromium

The Healer did not modify QA Shop and did not perform unrelated refactoring.

## Healer Change

The original locator:

```ts
await this.page.getByLabel('Search products').fill(product)
```

was changed to:

```ts
await this.page.getByRole('searchbox', { name: 'Find products', exact: true }).fill(product)
```

## Human Review

**Verdict: KEEP**

The change is limited to the actual cause of the failures and is implemented in the shared Page Object rather than duplicated across the affected tests.

Both the original `getByLabel()` approach and the new `getByRole()` approach are valid semantic, user-facing locator strategies. The Healer's change should therefore not be interpreted as replacing an inherently bad locator strategy.

The important result is that the Healer did not receive the solution in the prompt. It reproduced the failures, inspected the current application, identified the changed accessible name, updated the shared automation layer, and avoided unrelated modifications.

The use of `getByRole('searchbox', { name: 'Find products', exact: true })` is appropriate for the current UI and was accepted without further modification.

## Healer Verification

After applying the change, the Healer reran:

```sh
npx playwright test tests/products.spec.ts --project=chromium
```

Result:

- 10 passed
- 0 failed

## Final Human Verification

After reviewing and accepting the Healer's change, the complete Chromium project was executed independently:

```sh
npx playwright test --project=chromium
```

Result:

- 30 passed
- 0 failed

This confirmed that the targeted automated repair did not introduce regressions elsewhere in the Playwright suite.

## Conclusion

The experiment demonstrates a complete automated test-healing workflow:

**application change → existing tests fail → Healer reproduces failure → live application inspection → targeted Page Object repair → focused verification → human review → full regression verification**

The Healer was used as a repair tool rather than as a replacement for human review. Its change was inspected before being accepted, and the final regression suite remained the responsibility of the human reviewer.

The final result was a one-line targeted Page Object change, 10/10 passing tests in the affected Products suite, and 30/30 passing tests in the complete Chromium regression suite.
