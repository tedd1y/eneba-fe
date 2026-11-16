import { useState } from 'react'

import { formatMoney } from '@/lib/money'
import { CartItem, CartList } from '@/components/cart/cart-item'
import { CartSummary, DiscountCode } from '@/components/cart/cart-summary'
import { CheckoutHeader } from '@/components/cart/checkout-header'
import { DeliveryForm } from '@/components/cart/delivery-form'
import { DonationPanel } from '@/components/cart/donation-panel'
import { InspiredPicks } from '@/components/cart/inspired-picks'
import {
  checkoutSteps,
  consents,
  discountCodes,
  donationAmounts,
  donationTotals,
  picks,
} from '@/showcase/cart-data'
import { useCartStore } from '@/stores/cart'
import { toCartLine, useCartProducts } from '@/stores/use-cart-products'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Cart page. Lines, quantities and prices come from the cart store + API; donation, discount codes,
 * consents, seller and picks are still dummy (no API yet). Desktop: cart + donation | delivery + summary.
 */
function CartPage() {
  const { lines, count, subtotal, cashback, currency, isLoading } = useCartProducts()
  const setQuantity = useCartStore(s => s.setQuantity)
  const remove = useCartStore(s => s.remove)
  const [email, setEmail] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [remember, setRemember] = useState(false)
  const [donation, setDonation] = useState<string | null>(null)
  const [code, setCode] = useState<string>()
  const [consentValue, setConsentValue] = useState<Record<string, boolean>>({ reviews: true, offers: true })
  const [status, setStatus] = useState('')

  const discount = code ? Math.round(subtotal * discountCodes[code] / 100) : 0
  const donationCents = donation ? Number(donation) : 0
  const total = subtotal - discount + donationCents
  const emailError = emailTouched && !EMAIL_RE.test(email) ? 'Enter a valid email address' : undefined

  const rows = [
    { label: `${count} ${count === 1 ? 'product' : 'products'}`, value: formatMoney(subtotal, currency) },
    ...(discount ? [{ label: `Discount (${code})`, value: `-${formatMoney(discount, currency)}` }] : []),
    ...(donationCents ? [{ label: 'Donation', value: formatMoney(donationCents, currency) }] : []),
    { label: 'Service fee', value: '--', hint: 'Calculated at payment' },
  ]

  return (
    <div className="flex flex-col gap-8">
      <p className="type-caption text-muted-foreground" aria-live="polite">
        Status:
        {' '}
        <span className="text-attention">{status || 'Try changing quantities, a donation or code SAVE10'}</span>
      </p>

      {/* Desktop: two independent columns. Phone: wrappers dissolve (contents) and `order` stacks cart → delivery → summary → donation. */}
      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[1fr_var(--spacing-buy-box)] lg:items-start">
        <div className="contents lg:flex lg:flex-col lg:gap-5">
          <CartList>
            {isLoading && <p className="type-body text-muted-foreground" aria-live="polite">Loading your cart…</p>}
            {lines.map(line => (
              <CartItem
                key={line.productId}
                line={toCartLine(line)}
                onQuantityChange={(_, q) => setQuantity(line.productId, q)}
                onRemove={() => {
                  remove(line.productId)
                  setStatus(`Removed ${line.product.title}`)
                }}
                onWishlist={() => setStatus(`Moved ${line.product.title} to wishlist`)}
              />
            ))}
          </CartList>
          <DonationPanel
            text="Add a donation and express your support to Ukraine. We'll add 100% of your contribution to our initial pledge."
            amounts={donationAmounts}
            value={donation}
            onValueChange={setDonation}
            totals={[
              { label: 'Eneba', value: formatMoney(donationTotals.eneba + donationCents) },
              { label: 'Community', value: formatMoney(donationTotals.community + donationCents) },
            ]}
            total={{ label: 'Total donated:', value: formatMoney(donationTotals.eneba + donationTotals.community + donationCents * 2) }}
            className="max-lg:order-last"
          />
        </div>

        <div className="contents lg:flex lg:flex-col lg:gap-5">
          <DeliveryForm
            email={email}
            onEmailChange={(v) => {
              setEmail(v)
              setEmailTouched(false)
            }}
            remember={remember}
            onRememberChange={setRemember}
            error={emailError}
          />

          <CartSummary
            rows={rows}
            total={formatMoney(total, currency)}
            cashback={cashback ? formatMoney(cashback, currency) : undefined}
            consents={consents}
            consentValue={consentValue}
            onConsentChange={(id, checked) => setConsentValue(v => ({ ...v, [id]: checked }))}
            checkoutDisabled={count === 0}
            onCheckout={() => {
              setEmailTouched(true)
              setStatus(EMAIL_RE.test(email) ? `Checkout: ${formatMoney(total, currency)} to ${email}` : 'Email is required to checkout')
            }}
            discount={(
              <DiscountCode
                applied={code}
                onApply={(value) => {
                  const key = value.toUpperCase()
                  if (!(key in discountCodes)) return 'This code is not valid'
                  setCode(key)
                  setStatus(`Applied ${key}: -${discountCodes[key]}%`)
                }}
              />
            )}
            reviews={{ rating: 4.5, label: 'See our reviews', href: '#' }}
          />
        </div>
      </div>

      <InspiredPicks products={picks} onAddToCart={p => setStatus(`Added ${p.title} to cart`)} />
    </div>
  )
}

export function Cart() {
  return (
    <>
      {/* Checkout flow uses its own header, pinned to the top like the site header. */}
      <CheckoutHeader steps={checkoutSteps} current={0} className="sticky top-0 z-40" />
      <main className="page-container page-main pb-block-lg">
        <CartPage />
      </main>
    </>
  )
}
