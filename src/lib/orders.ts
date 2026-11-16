import type { OrderResource } from '@/client'
import { v1OrdersPay, v1OrdersStore } from '@/client/sdk.gen.ts'
import type { CartItem } from '@/stores/cart'

/** First readable message from an API error body (`message`, or the first validation error). */
function errorMessage(error: unknown, fallback: string) {
  if (error && typeof error === 'object') {
    const { message, errors } = error as { message?: string, errors?: Record<string, string[]> }
    const first = errors && Object.values(errors)[0]?.[0]
    if (first) return first
    if (message) return message
  }
  return fallback
}

/**
 * Checkout: `POST /v1/orders` with the cart, then `POST /v1/orders/{uuid}/pay`.
 * Resolves with the paid order; rejects with an Error whose message is safe to show.
 */
export async function placeOrder(email: string, items: CartItem[]): Promise<OrderResource> {
  const created = await v1OrdersStore({
    body: { email, items: items.map(i => ({ product_id: i.productId, quantity: i.quantity })) },
  })
  if (!created.data) throw new Error(errorMessage(created.error, 'We couldn\'t create your order. Please try again.'))

  const paid = await v1OrdersPay({ path: { order: created.data.data.uuid } })
  if (!paid.data) throw new Error(errorMessage(paid.error, 'Payment failed. Please try again.'))
  return paid.data.data
}
