import { useState } from 'react'
import { Navigate } from 'react-router'

import { CartLimitNotice } from '@/components/cart/cart-limit-notice'
import { CheckoutHeader } from '@/components/cart/checkout-header'
import { PaymentMethodList } from '@/components/payment/payment-method-list'
import { PaymentSummary } from '@/components/payment/payment-summary'
import { formatMoney } from '@/lib/money'
import { checkoutSteps } from '@/showcase/cart-data'
import { paymentLegal, paymentMethods } from '@/showcase/payment-data'
import { CART_LIMIT_MESSAGE, MAX_CART_ITEMS, maxQuantityFor, useCartStore } from '@/stores/cart'
import { toCartLine, useCartProducts } from '@/stores/use-cart-products'

/**
 * Payment step. The order comes from the cart store, priced by the API (same as the cart page),
 * and quantity changes / removals update the real cart. Payment methods, sellers and Continue are
 * still dummy (no payments API). An empty cart sends you back to /cart.
 * Desktop: methods | summary. Tablet: summary under the methods. Phone: summary pinned to the bottom.
 */
function PaymentPage() {
  const [method, setMethod] = useState<string | null>(null)
  const { lines, count, subtotal, cashback, currency, isLoading } = useCartProducts()
  const items = useCartStore(s => s.items)
  const setQuantity = useCartStore(s => s.setQuantity)
  const remove = useCartStore(s => s.remove)

  if (count === 0) return <Navigate to="/cart" replace />

  const cartLines = lines.map(toCartLine)
  const sellers = [...new Set(cartLines.map(l => l.seller.name))]

  return (
    <div className="mx-auto grid w-full max-w-checkout items-start sm:gap-7.5 lg:grid-cols-[1fr_var(--spacing-payment-summary)]">
      <PaymentMethodList methods={paymentMethods} value={method} onValueChange={setMethod} />
      <PaymentSummary
        lines={cartLines}
        status={(
          <>
            {count >= MAX_CART_ITEMS && <CartLimitNotice className="max-sm:px-5">{CART_LIMIT_MESSAGE}</CartLimitNotice>}
            {isLoading && <p className="type-body text-muted-foreground max-sm:px-5" aria-live="polite">Loading your cart…</p>}
          </>
        )}
        getMaxQuantity={line => maxQuantityFor(items, Number(line.id))}
        onQuantityChange={(line, quantity) => setQuantity(Number(line.id), quantity)}
        onRemove={line => remove(Number(line.id))}
        subtotal={formatMoney(subtotal, currency)}
        total={formatMoney(subtotal, currency)}
        cashback={cashback ? formatMoney(cashback, currency) : undefined}
        sellers={sellers}
        continueDisabled={!method || isLoading}
        legal={{
          ...paymentLegal,
          sellerPolicies: sellers.map(name => ({ label: `${name}'s T/C & Refund Policy`, href: '#' })),
        }}
        reviews={{ rating: 4.5, label: 'See our reviews', href: '#' }}
        className="sm:max-lg:mt-17.5"
      />
    </div>
  )
}

export function Payment() {
  return (
    <>
      <CheckoutHeader steps={checkoutSteps} current={1} backHref="/cart" className="sticky top-0 z-40" />
      <main className="page-container max-sm:px-0 sm:page-main sm:pb-block-lg">
        <PaymentPage />
      </main>
    </>
  )
}
