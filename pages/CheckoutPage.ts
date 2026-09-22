import { Locator, Page } from '@playwright/test'

export class CheckoutPage {
  readonly page: Page
  readonly placeOrderButton: Locator
  readonly orderConfirmation: Locator
  readonly orderErrorValidation: Locator

  constructor(page: Page) {
    this.page = page
    this.placeOrderButton = page.getByRole('button', { name: 'Place order' })
    this.orderConfirmation = page.getByRole('heading', {
      name: 'Order confirmed',
    })
    this.orderErrorValidation = page.getByText('Full name and email are required.', { exact: true })
  }

  async fillCustomerInformation(name: string, email: string) {
    await this.page.getByLabel('Full name').fill(name)
    await this.page.getByLabel('Email').fill(email)
  }
}
