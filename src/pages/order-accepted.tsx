import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams } from 'react-router'

import type { OrderItemResource, OrderResource, ProductResource } from '@/client'
import { v1OrdersShowOptions, v1ProductsIndexOptions } from '@/client/@tanstack/react-query.gen.ts'
import { v1OrdersShow } from '@/client/sdk.gen.ts'
import { NotFound } from '@/components/layout/not-found'
import type { DeliveryItem } from '@/components/payment/types'
import { NotFoundError } from '@/lib/errors'

import { CheckoutHeader } from '@/components/cart/checkout-header'
import { HavingIssues, OrderPlaced } from '@/components/payment/order-placed'
import { ProductDelivery } from '@/components/payment/product-delivery'
import { SurveyBanner } from '@/components/payment/survey-banner'
import { ProductCard } from '@/components/product/product-card'
import { Button } from '@/components/ui/button'
import { checkoutSteps, picks } from '@/showcase/cart-data'

const PICKS_PAGE = 5
/** Dummy recommendations: the cart picks twice, so "Load more" has something to load. */
const recommendations = [...picks, ...picks]

/** "You may also like": product cards plus "Load more". */
function AlsoLike() {
  const [visible, setVisible] = useState(PICKS_PAGE)

  return (
    <section aria-labelledby="also-like" className="flex flex-col gap-7.5 bg-surface-deep px-5 py-7.5 md:px-10">
      <h2 id="also-like" className="type-h3 font-bold">You may also like</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
        {recommendations.slice(0, visible).map((p, i) => (
          // Dummy list repeats titles, so the index keeps keys unique.
          <ProductCard key={`${i}-${p.title}`} product={p} />
        ))}
      </div>
      {visible < recommendations.length && (
        <Button variant="secondary" className="self-center" onClick={() => setVisible(v => v + PICKS_PAGE)}>Load more</Button>
      )}
    </section>
  )
}

/** Placeholder keys until the API delivers real ones: stable per order line and unit. */
function dummyKeys(uuid: string, line: number, quantity: number) {
  const hex = uuid.replace(/-/g, '').toUpperCase()
  return Array.from({ length: quantity }, (_, unit) => {
    const start = ((line * 7 + unit * 5) % (hex.length - 15))
    const chunk = hex.slice(start, start + 15)
    return `${chunk.slice(0, 5)}-${chunk.slice(5, 10)}-${chunk.slice(10, 15)}`
  })
}

/** API order line → the card's shape. Notes, Enebium, seller and keys aren't in the API yet (dummy). */
function toDeliveryItem(order: OrderResource, item: OrderItemResource, index: number, product?: ProductResource): DeliveryItem {
  return {
    id: `${item.product_id ?? 'removed'}-${index}`,
    title: item.title,
    image: product?.image_url || undefined,
    cover: 'bg-linear-to-br from-surface-tile to-primary',
    region: item.region,
    platform: item.platform,
    productType: product?.type.label ?? 'Digital key',
    enebium: 0,
    quantity: item.quantity,
    keys: dummyKeys(order.uuid, index, item.quantity),
    seller: { name: 'NextLevel', initials: 'NL', positivePercent: '99.92 %', ratings: '6225k+' },
  }
}

/** What to say for orders that can't show keys yet. Paid / completed orders return undefined. */
const statusText: Partial<Record<OrderResource['status']['value'], string>> = {
  pending: 'is still waiting for payment',
  failed: 'could not be paid',
  cancelled: 'has been cancelled',
}

/**
 * Step 3 of checkout, `/payment/accept/:uuid`. Opens on "Thank you for your order";
 * "View order details" swaps to "Get your product" (one card per product, keys behind a confirmation).
 * The order comes from `/v1/orders/{uuid}` (box art from `/v1/products`); keys, notes, Enebium,
 * sellers, recommendations and the survey are still dummy. Unknown orders show the 404 page.
 */
export function OrderAccepted() {
  const { uuid = '' } = useParams()
  const [showDetails, setShowDetails] = useState(false)

  const { data, error } = useQuery({
    ...v1OrdersShowOptions({ path: { order: uuid } }),
    // Keep the HTTP status so a 404 shows the not-found page (same as the product page).
    queryFn: async ({ signal }) => {
      const { data, error, response } = await v1OrdersShow({ path: { order: uuid }, signal })
      if (response?.status === 404) throw new NotFoundError(`No order "${uuid}"`)
      if (error || !data) throw error ?? new Error('Empty response')
      return data
    },
    retry: (count, err) => !(err instanceof NotFoundError) && count < 1,
    enabled: uuid !== '',
  })
  const order = data?.data

  const productIds = (order?.items ?? []).flatMap(i => (i.product_id === null ? [] : [i.product_id]))
  const { data: products } = useQuery({
    ...v1ProductsIndexOptions({ query: { 'ids[]': productIds, 'per_page': 40 } }),
    enabled: productIds.length > 0,
  })
  const productById = new Map((products?.data ?? []).map(p => [p.id, p]))

  if (error instanceof NotFoundError) return <NotFound />

  const deliveryItems = order
    ? order.items.map((item, i) => toDeliveryItem(order, item, i, item.product_id === null ? undefined : productById.get(item.product_id)))
    : []

  return (
    <>
      <CheckoutHeader steps={checkoutSteps} current={2} className="sticky top-0 z-40" />
      <main className="page-container page-main pb-block-lg" aria-busy={!order || undefined}>
        {!order
          ? null
          : showDetails
            ? (
              // Phone: panels run edge to edge, like the reference.
                <div className="flex flex-col gap-5 max-md:-mx-4">
                  <h1 className="mb-4 text-center type-h1">Get your product</h1>
                  {deliveryItems.map(item => <ProductDelivery key={item.id} item={item} />)}
                  <div className="flex flex-col gap-5 md:ml-25">
                    <AlsoLike />
                    <SurveyBanner />
                  </div>
                </div>
              )
            : (
                <div className="mx-auto flex max-w-140 flex-col gap-17.5 pt-10">
                  <OrderPlaced
                    orderNumber={order.number}
                    statusText={statusText[order.status.value]}
                    onViewDetails={() => {
                      setShowDetails(true)
                      window.scrollTo({ top: 0 })
                    }}
                  />
                  <HavingIssues />
                </div>
              )}
      </main>
    </>
  )
}
