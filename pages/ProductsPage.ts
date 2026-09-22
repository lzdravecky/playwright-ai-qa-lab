import { Locator, Page } from '@playwright/test'

export class ProductsPage {
  readonly page: Page
  readonly products: Locator
  readonly statusMessage: Locator
  readonly cartButton: Locator
  readonly cartContent: Locator
  readonly checkoutButton: Locator
  readonly heading: Locator
  readonly promoCodeInput: Locator
  readonly applyPromoButton: Locator
  readonly promoError: Locator
  readonly cartSubtotal: Locator
  readonly cartDiscount: Locator
  readonly cartTotal: Locator

  constructor(page: Page) {
    this.page = page
    this.products = page.getByTestId('product-card')
    this.statusMessage = page.locator('#status')
    this.cartButton = page.getByRole('button', { name: /Cart/ })
    this.cartContent = page.getByRole('region', { name: 'Your cart' })
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' })
    this.heading = page.getByRole('heading', { name: 'Products' })
    this.promoCodeInput = this.cartContent.getByRole('textbox', { name: 'Promo code', exact: true })
    this.applyPromoButton = this.cartContent.getByRole('button', { name: 'Apply', exact: true })
    this.promoError = this.cartContent.getByRole('alert')
    this.cartSubtotal = this.cartContent.getByText(/^Subtotal:/)
    this.cartDiscount = this.cartContent.getByText(/^Discount:/)
    this.cartTotal = this.cartContent.getByText(/^Total:/)
  }

  async searchFor(product: string) {
    await this.page.getByRole('searchbox', { name: 'Find products', exact: true }).fill(product)
  }

  async addProductToCart(product: string) {
    await this.page.getByRole('button', { name: `Add ${product} to cart` }).click()
  }

  async applyPromoCode(code: string) {
    await this.promoCodeInput.fill(code)
    await this.applyPromoButton.click()
  }
}
