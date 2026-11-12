import { expect, test } from '@playwright/test'

test('TEMPORARY: verify direct failure status and Pages report', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Run the temporary failure check only in Chromium')

  await page.goto('/')

  // Deliberately fail to verify the test step stays red while GitHub Pages still deploys the report.
  expect(1).toBe(2)
})
