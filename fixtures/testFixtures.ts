import { test as base } from '@playwright/test'
import { ProductsPage } from '../pages/ProductsPage'
import { CheckoutPage } from '../pages/CheckoutPage'

type MyFixtures = {
    productsPage: ProductsPage
    checkoutPage: CheckoutPage
    cleanCart: void
}

export const test = base.extend<MyFixtures>({
    productsPage: async ({ page }, use) => {
        const productsPage = new ProductsPage(page)

        await use(productsPage)
    },

    checkoutPage: async ({ page }, use) => {
        const checkoutPage = new CheckoutPage(page)

        await use(checkoutPage)
    },

    cleanCart: async ({ request }, use) => {
        const response = await request.delete('/api/cart')

        if (!response.ok()) {
            throw new Error('Failed to reset cart')
        }

        await use()
    }
})

