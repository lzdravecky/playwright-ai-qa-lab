import { expect, test } from '@playwright/test'

test('TEMPORARY: verify failed regression report deployment', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Run the temporary failure check only in Chromium')

  await page.goto('/')

  // Deliberate assertion failure to verify screenshots, traces and GitHub Pages deployment.
  expect(1).toBe(2)
})
