import { expect } from '@playwright/test'
import { test } from '../fixtures/testFixtures'

test.describe('Products', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test(
    'displays Products page',
    { tag: '@smoke' },
    async ({ page, productsPage }) => {
      await expect(page).toHaveTitle(/QA Shop/)
      await expect(productsPage.heading).toBeVisible()
    },
  )

  test('filters products by search', async ({ productsPage }) => {
    await productsPage.searchFor('keyboard')

    await expect(productsPage.products).toHaveCount(1)
    await expect(productsPage.products).toContainText('Mechanical Keyboard')
  })

  test('searches for unknown product', async ({ productsPage }) => {
    await productsPage.searchFor('Playstation')

    await expect(productsPage.products).toHaveCount(0)
    await expect(productsPage.statusMessage).toHaveText('0 products found')
  })
})

test.describe('Cart flow', () => {
  test.describe.configure({ mode: 'serial' })

  test.beforeEach(async ({ cleanCart, page }) => {
    await page.goto('/')
  })

  test.describe('Cart', () => {
    test(
      'adds product to cart',
      { tag: '@smoke' },
      async ({ productsPage }) => {
        await productsPage.addProductToCart('Mechanical Keyboard')
        await expect(productsPage.cartButton).toHaveText('Cart (1)')
        await productsPage.cartButton.click()

        await expect(productsPage.cartContent).toContainText(
          'Mechanical Keyboard',
        )
      },
    )

    test('adds multiple products to cart', async ({ productsPage }) => {
      await productsPage.addProductToCart('Mechanical Keyboard')
      await productsPage.addProductToCart('Wireless Mouse')
      await expect(productsPage.cartButton).toHaveText('Cart (2)')
      await productsPage.cartButton.click()

      await expect(productsPage.cartContent).toContainText(
        'Mechanical Keyboard',
      )
      await expect(productsPage.cartContent).toContainText('Wireless Mouse')
    })

    test('sends correct request when adding product to cart', async ({
      page,
      productsPage,
    }) => {
      const requestPromise = page.waitForRequest(
        (request) =>
          request.url().includes('/api/cart/items') &&
          request.method() === 'POST',
      )

      await productsPage.addProductToCart('Mechanical Keyboard')

      const request = await requestPromise
      const requestBody = request.postDataJSON()
      expect(requestBody).toEqual({
        productId: 1,
        quantity: 1,
      })
    })

    test('shows error when adding product to cart fails', async ({
      page,
      productsPage,
    }) => {
      await page.route('**/api/cart/items', async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Cart service unavailable',
          }),
        })
      })

      await productsPage.addProductToCart('Mechanical Keyboard')

      await expect(productsPage.statusMessage).toHaveText(
        'Cart service unavailable',
      )
    })

    test('receives successful response when adding product to cart', async ({
      page,
      productsPage,
    }) => {
      const responsePromise = page.waitForResponse(
        (response) =>
          response.url().includes('/api/cart/items') &&
          response.request().method() === 'POST',
      )

      await productsPage.addProductToCart('Mechanical Keyboard')

      const response = await responsePromise
      const responseBody = await response.json()

      expect(response.status()).toBe(201)
      expect(responseBody.items).toHaveLength(1)
      expect(responseBody.items[0].name).toBe('Mechanical Keyboard')
    })
  })

  test.describe('Checkout', () => {
    test('shows validation errors when checkout information is missing', async ({
      productsPage,
      checkoutPage,
    }) => {
      await productsPage.addProductToCart('Mechanical Keyboard')
      await productsPage.cartButton.click()
      await productsPage.checkoutButton.click()
      await checkoutPage.placeOrderButton.click()

      await expect(checkoutPage.orderErrorValidation).toBeVisible()
    })

    test('confirms order with valid customer information', async ({
      productsPage,
      checkoutPage,
    }) => {
      await test.step('Add product to cart', async () => {
        await productsPage.addProductToCart('Mechanical Keyboard')
        await productsPage.cartButton.click()
      })
      await test.step('Complete checkout', async () => {
        await productsPage.checkoutButton.click()

        await checkoutPage.fillCustomerInformation(
          'Test User',
          'test@example.com',
        )
        await checkoutPage.placeOrderButton.click()
      })
      await test.step('Verify order confirmation', async () => {
        await expect(checkoutPage.orderConfirmation).toBeVisible()
      })
    })
  })
})
