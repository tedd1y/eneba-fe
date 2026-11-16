import { useState } from 'react'

import { CheckoutHeader } from '@/components/cart/checkout-header'
import { PaymentMethodList } from '@/components/payment/payment-method-list'
import { PaymentSummary } from '@/components/payment/payment-summary'
import { formatMoney } from '@/lib/money'
import { checkoutSteps } from '@/showcase/cart-data'
import { paymentLegal, paymentMethods, paymentSeed } from '@/showcase/payment-data'

/**
 * Payment step: pick a method, review the order, Continue. All dummy for now (no payments API):
 * quantities and removals only change local state, and Continue just needs a method chosen.
 * Desktop: methods | summary. Tablet: summary under the methods. Phone: summary pinned to the bottom.
 */
function PaymentPage() {
  const [method, setMethod] = useState<string | null>(null)
  const [seed, setSeed] = useState(paymentSeed)

  const subtotal = seed.reduce((sum, s) => sum + s.unitPrice * s.quantity, 0)
  const cashback = seed.reduce((sum, s) => sum + s.cashback * s.quantity, 0)
  const sellers = [...new Set(seed.map(s => s.seller.name))]

  const lines = seed.map(s => ({
    id: s.id,
    title: s.title,
    seller: s.seller,
    cover: s.cover,
    price: formatMoney(s.unitPrice * s.quantity),
    cashback: formatMoney(s.cashback * s.quantity),
    quantity: s.quantity,
    note: 'Digital product',
  }))

  return (
    <div className="mx-auto grid w-full max-w-checkout items-start sm:gap-7.5 lg:grid-cols-[1fr_var(--spacing-payment-summary)]">
      <PaymentMethodList methods={paymentMethods} value={method} onValueChange={setMethod} />
      <PaymentSummary
        lines={lines}
        onQuantityChange={(line, quantity) => setSeed(list => list.map(s => (s.id === line.id ? { ...s, quantity } : s)))}
        onRemove={line => setSeed(list => list.filter(s => s.id !== line.id))}
        onWishlist={() => {}}
        subtotal={formatMoney(subtotal)}
        total={formatMoney(subtotal)}
        cashback={cashback ? formatMoney(cashback) : undefined}
        sellers={sellers}
        continueDisabled={!method || seed.length === 0}
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
