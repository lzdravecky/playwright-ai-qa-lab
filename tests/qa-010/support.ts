import { expect, Page } from '@playwright/test'
import { ProductsPage } from '../../pages/ProductsPage'

export async function openPromoCart(page: Page, productsPage: ProductsPage, products: string[]) {
  await page.goto('/')
  await expect(productsPage.cartButton).toHaveText('Cart (0)')
  for (const product of products) await productsPage.addProductToCart(product)
  await expect(productsPage.cartButton).toHaveText(`Cart (${products.length})`)
  await productsPage.cartButton.click()
}

export async function expectCartItem(productsPage: ProductsPage, name: string, price: number) {
  const item = productsPage.cartContent.getByRole('paragraph').filter({ hasText: name })
  await expect(item).toHaveCount(1)
  await expect(item).toBeVisible()
  await expect(item).toContainText(`€${price.toFixed(2)}`)
}

export async function expectDiscountedTotals(productsPage: ProductsPage, productPrices: number[]) {
  const subtotalCents = productPrices.reduce((sum, price) => sum + Math.round(price * 100), 0)
  const discountCents = subtotalCents / 10
  const totalCents = subtotalCents - discountCents
  await expect(productsPage.cartSubtotal).toBeVisible()
  await expect(productsPage.cartDiscount).toBeVisible()
  await expect(productsPage.cartTotal).toBeVisible()
  await expect(productsPage.cartSubtotal).toHaveText(`Subtotal: €${(subtotalCents / 100).toFixed(2)}`)
  await expect(productsPage.cartDiscount).toHaveText(
    new RegExp(`^Discount:\\s*-?€${(discountCents / 100).toFixed(2).replace('.', '\\.')}$`),
  )
  await expect(productsPage.cartTotal).toHaveText(`Total: €${(totalCents / 100).toFixed(2)}`)
}
