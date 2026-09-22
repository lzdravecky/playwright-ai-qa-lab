import { Locator, Page } from '@playwright/test'

export class ProductsPage {
  readonly page: Page
  readonly products: Locator
  readonly statusMessage: Locator
  readonly cartButton: Locator
  readonly cartContent: Locator
  readonly checkoutButton: Locator
  readonly heading: Locator

  constructor(page: Page) {
    this.page = page
    this.products = page.getByTestId('product-card')
    this.statusMessage = page.locator('#status')
    this.cartButton = page.getByRole('button', { name: /Cart/ })
    this.cartContent = page.getByRole('region', { name: 'Your cart' })
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' })
    this.heading = page.getByRole('heading', { name: 'Products' })
  }

  async searchFor(product: string) {
    await this.page.getByLabel('Search products').fill(product)
  }

  async addProductToCart(product: string) {
    await this.page.getByRole('button', { name: `Add ${product} to cart` }).click()
  }
}
