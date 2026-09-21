import { test, expect, request } from '@playwright/test'

type Product = {
  id: number
  name: string
  price: number
}

test.describe('Products API', { tag: '@api' }, () => {
  test('returns all products', async ({ request }) => {
    const response = await request.get('/api/products')

    expect(response.status()).toBe(200)

    const body = await response.json()

    expect(body).toHaveLength(4)
    expect(body).toContainEqual({
      id: 1,
      name: 'Mechanical Keyboard',
      price: 89.9,
    })
    expect(body).toContainEqual({
      id: 3,
      name: 'USB-C Dock',
      price: 119,
    })
  })

  const products = [
    { id: 1, name: 'Mechanical Keyboard', price: 89.9 },
    { id: 2, name: 'Wireless Mouse', price: 39.9 },
    { id: 3, name: 'USB-C Dock', price: 119 },
    { id: 4, name: '27-inch Monitor', price: 249 },
  ]

  for (const testCase of products) {
    test(`return product by "${testCase.id}"`, async ({ request }) => {
      const response = await request.get(`/api/products/${testCase.id}`)

      expect(response.status()).toBe(200)

      const body: Product = await response.json()

      expect(body).toEqual(testCase)
    })
  }

  test('returns 404 for unknown product', async ({ request }) => {
    const response = await request.get('/api/products/999')

    expect(response.status()).toBe(404)

    const body = await response.json()

    expect(body.error).toBe('Product not found')
  })

  test('creates order', async ({ request }) => {
    const response = await request.post('/api/orders', {
      data: {
        customer: {
          name: 'Test User',
          email: 'test@example.com',
        },
        items: [
          {
            productId: 1,
            quantity: 1,
          },
        ],
      },
    })

    expect(response.status()).toBe(201)

    const body = await response.json()
    expect(body.status).toBe('confirmed')
    expect(body.customer.name).toBe('Test User')
  })

  test('returns 400 when customer information is missing', async ({
    request,
  }) => {
    const response = await request.post('/api/orders', {
      data: {
        customer: {
          name: '',
          email: '',
        },
        items: [
          {
            productId: 1,
            quantity: 1,
          },
        ],
      },
    })

    expect(response.status()).toBe(400)

    const body = await response.json()
    expect(body.error).toBe('Full name and email are required.')
  })
})

test.describe('Cart API', () => {
  test.beforeEach(async ({ request }) => {
    const response = await request.delete('/api/cart')

    expect(response.ok()).toBeTruthy()
  })

  test('adds product to cart', async ({ request }) => {
    const response = await request.post('/api/cart/items', {
      data: {
        productId: 1,
        quantity: 2,
      },
    })

    expect(response.status()).toBe(201)

    const body = await response.json()
    expect(body.items).toHaveLength(1)
    expect(body.items[0].name).toBe('Mechanical Keyboard')
    expect(body.items[0].quantity).toBe(2)
    expect(body.total).toBe(179.8)
  })
})
