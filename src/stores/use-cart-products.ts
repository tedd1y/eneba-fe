import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'

import type { ProductResource } from '@/client'
import { v1ProductsIndexOptions } from '@/client/@tanstack/react-query.gen.ts'
import type { CartLine } from '@/components/cart/types'
import { formatMoney } from '@/lib/money'
import { type CartItem, MAX_CART_ITEMS, useCartStore } from '@/stores/cart'

export type PricedCartLine = CartItem & {
  product: ProductResource
  /** unit price × quantity, in cents */
  lineTotal: number
  /** cashback × quantity, in cents */
  lineCashback: number
}

/**
 * Prices the cart from the API in one `/v1/products?ids[]=…` request. The cart is capped at
 * MAX_CART_ITEMS, so every product fits on one page. Products the API leaves out
 * (inactive / unknown) are removed from the cart once a fresh response confirms they're gone.
 */
export function useCartProducts() {
  const items = useCartStore(s => s.items)
  const prune = useCartStore(s => s.prune)

  // Sorted so reordering the cart never changes the query key.
  const ids = useMemo(() => items.map(i => i.productId).sort((a, b) => a - b), [items])

  const query = useQuery({
    ...v1ProductsIndexOptions({ query: { 'ids[]': ids, 'per_page': MAX_CART_ITEMS } }),
    enabled: ids.length > 0,
    // Keep showing the old prices while a newly added product is fetched.
    placeholderData: keepPreviousData,
  })

  const products = query.data?.data
  const isFresh = query.isSuccess && !query.isPlaceholderData

  useEffect(() => {
    if (!isFresh || !products) return
    const returned = new Set(products.map(p => p.id))
    const missing = ids.filter(id => !returned.has(id))
    if (missing.length > 0) prune(missing)
  }, [isFresh, products, ids, prune])

  return useMemo(() => {
    const byId = new Map((products ?? []).map(p => [p.id, p]))
    const lines: PricedCartLine[] = []
    for (const item of items) {
      const product = byId.get(item.productId)
      if (!product) continue
      lines.push({
        ...item,
        product,
        lineTotal: product.price.amount * item.quantity,
        lineCashback: (product.cashback?.amount ?? 0) * item.quantity,
      })
    }

    return {
      lines,
      count: items.reduce((n, i) => n + i.quantity, 0),
      subtotal: lines.reduce((sum, l) => sum + l.lineTotal, 0),
      cashback: lines.reduce((sum, l) => sum + l.lineCashback, 0),
      currency: lines[0]?.product.currency ?? 'EUR',
      /** True until the first prices arrive for a non-empty cart. */
      isLoading: ids.length > 0 && !products,
      isError: query.isError,
    }
  }, [items, products, ids.length, query.isError])
}

/** API has no sellers yet; every line shows this placeholder. */
const DUMMY_SELLER = { name: 'NextLevel', initials: 'NL' }

/** Priced line → the display shape <CartItem> renders. `id` is the product id as a string. */
export function toCartLine(line: PricedCartLine): CartLine {
  const { product } = line
  return {
    id: String(product.id),
    title: product.title,
    seller: DUMMY_SELLER,
    image: product.image_url || undefined,
    cover: 'bg-linear-to-br from-surface-tile to-primary',
    price: formatMoney(line.lineTotal, product.currency),
    cashback: line.lineCashback ? formatMoney(line.lineCashback, product.currency) : undefined,
    quantity: line.quantity,
    note: 'Digital product',
  }
}
