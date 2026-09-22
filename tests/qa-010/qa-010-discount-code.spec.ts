// spec: specs/qa-010-discount-code-reviewed.md
// requirement: specs/qa-010-final-requirement.md
// seed: tests/seed.spec.ts
import { randomUUID } from 'node:crypto'
import { expect } from '@playwright/test'
import { test } from '../../fixtures/testFixtures'
import { openPromoCart, expectCartItem, expectDiscountedTotals } from './support'

test.describe('QA-010 - Discount code', () => {
  test('QA-010-01 - Cart exposes promo controls', async ({ cleanCart, page, productsPage }) => {
    // 1. Add one Mechanical Keyboard and open the cart.
    await openPromoCart(page, productsPage, ['Mechanical Keyboard'])
    // 2. Locate the Promo code input and Apply button; empty input disables Apply.
    await expect(productsPage.promoCodeInput).toBeVisible()
    await expect(productsPage.applyPromoButton).toBeVisible()
    await expect(productsPage.promoCodeInput).toHaveValue('')
    await expect(productsPage.applyPromoButton).toBeDisabled()
  })

  test('QA-010-02 - SAVE10 calculation and displayed totals', async ({ cleanCart, page, productsPage }) => {
    // 1. Add the selected products and open the cart.
    await openPromoCart(page, productsPage, ['Mechanical Keyboard'])
    // 2. Confirm the cart contains the products at their documented prices.
    await expectCartItem(productsPage, 'Mechanical Keyboard', 89.9)

    // 3. Enter SAVE10 in Promo code and click Apply.
    await productsPage.applyPromoCode('SAVE10')
    // 4. Compare subtotal, 10% discount and final total with independently calculated amounts.
    await expectDiscountedTotals(productsPage, [89.9])
  })

  for (const code of ['SAVE10', 'save10', 'Save10', 'SaVe10']) {
    test(`QA-010-03 - Case-insensitive promo codes (${code})`, async ({ cleanCart, page, productsPage }) => {
      await openPromoCart(page, productsPage, ['Mechanical Keyboard'])
      await productsPage.applyPromoCode(code)
      await expectDiscountedTotals(productsPage, [89.9])
    })
  }

  test('QA-010-04 - Invalid code displays the required message', async ({ cleanCart, page, productsPage }) => {
    await openPromoCart(page, productsPage, ['Mechanical Keyboard'])
    const originalTotal = await productsPage.cartTotal.innerText()
    await productsPage.applyPromoCode('INVALID10')
    await expect(productsPage.promoError).toHaveText('Invalid promo code')
    await expect(productsPage.cartTotal).toHaveText(originalTotal)
  })

  test('QA-010-05 - Multi-item discount calculation', async ({ cleanCart, page, productsPage }) => {
    // 1. Add the selected products and open the cart.
    await openPromoCart(page, productsPage, ['Mechanical Keyboard', 'Wireless Mouse'])
    // 2. Confirm the cart contains the products at their documented prices.
    await expectCartItem(productsPage, 'Mechanical Keyboard', 89.9)
    await expectCartItem(productsPage, 'Wireless Mouse', 39.9)
    // 3. Enter SAVE10 in Promo code and click Apply.
    await productsPage.applyPromoCode('SAVE10')
    // 4. Compare subtotal, 10% discount and final total with independently calculated amounts.
    await expectDiscountedTotals(productsPage, [89.9, 39.9])
  })

  test('QA-010-06 - Only one promo can apply; no stacking', async ({ cleanCart, page, productsPage }) => {
    // 1. Add one Mechanical Keyboard and open the cart.
    await openPromoCart(page, productsPage, ['Mechanical Keyboard'])
    await expectCartItem(productsPage, 'Mechanical Keyboard', 89.9)
    // 2. Apply SAVE10 and verify subtotal, discount and final total.
    await productsPage.applyPromoCode('SAVE10')
    await expectDiscountedTotals(productsPage, [89.9])
    // 3. Verify the UI prevents another submission by disabling both promo controls.
    await expect(productsPage.promoCodeInput).toBeDisabled()
    await expect(productsPage.applyPromoButton).toBeDisabled()
  })

  test('QA-010-07 - Created order uses discounted total', async ({
    cleanCart,
    page,
    productsPage,
    checkoutPage,
    request,
  }) => {
    // 1. Add one Mechanical Keyboard and open the cart.
    await openPromoCart(page, productsPage, ['Mechanical Keyboard'])
    await expectCartItem(productsPage, 'Mechanical Keyboard', 89.9)
    // 2. Apply SAVE10 and verify the cart subtotal, discount and final total.
    await productsPage.applyPromoCode('SAVE10')
    await expectDiscountedTotals(productsPage, [89.9])
    const displayedTotal = Number(
      (await productsPage.cartTotal.innerText()).replace('Total:', '').replace('€', '').trim(),
    )
    // 3. Checkout with a unique synthetic customer email and click Place order once.
    const email = 'qa-promo-' + randomUUID() + '@example.test'
    await productsPage.checkoutButton.click()
    await checkoutPage.fillCustomerInformation('QA Promo Customer', email)
    const createdResponsePromise = page.waitForResponse(
      (response) => new URL(response.url()).pathname === '/api/orders' && response.request().method() === 'POST',
    )
    await checkoutPage.placeOrderButton.click()
    // 4. Identify this created order through its server response ID and unique email.
    const createdResponse = await createdResponsePromise
    expect(createdResponse.status()).toBe(201)
    const createdOrder = await createdResponse.json()
    expect(createdOrder.id).toEqual(expect.any(Number))
    expect(createdOrder.customer.email).toBe(email)
    await expect(checkoutPage.orderConfirmation).toBeVisible()
    // 5. Read the authoritative stored order and compare its major-EUR total with €80.91 and the cart.
    const storedResponse = await request.get('/api/orders/' + createdOrder.id)
    expect(storedResponse.status()).toBe(200)
    const storedOrder = await storedResponse.json()
    expect(storedOrder.id).toBe(createdOrder.id)
    expect(storedOrder.customer.email).toBe(email)
    expect(storedOrder.total).toBeCloseTo(80.91, 2)
    expect(storedOrder.total).toBeCloseTo(displayedTotal, 2)
  })
})
