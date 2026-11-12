import { expect, test } from '@playwright/test'

test('TEMPORARY: verify direct CI failure and Pages deployment', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Run the failure verification only in Chromium')

  await page.goto('/')

  // Intentional failure to verify the regression step is red while the report deploys.
  expect(1).toBe(2)
})
