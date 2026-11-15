import { BadgePercentIcon, GlobeLockIcon, InfoIcon, ShieldCheckIcon, ShoppingCartIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

import { PriceTag } from './price-tag'
import type { FeaturedOffer } from './types'

/** Express checkout + "Buy now" + add-to-cart. `layout="row"` puts all three on one line (phone offer rows). */
function BuyActions({
  buyLabel = 'Buy now',
  expressLabel = 'PayPal',
  onBuy,
  onExpress,
  onAddToCart,
  layout = 'stack',
  className,
}: {
  buyLabel?: string
  expressLabel?: string
  onBuy?: () => void
  onExpress?: () => void
  onAddToCart?: () => void
  layout?: 'stack' | 'row'
  className?: string
}) {
  const express = (
    <Button variant="light" className={cn('type-h3 font-extrabold italic', layout === 'row' ? 'flex-1' : 'w-full')} onClick={onExpress}>
      {expressLabel}
    </Button>
  )
  const cart = (
    <Button variant="secondary" size="icon" aria-label="Add to cart" onClick={onAddToCart} className="w-12">
      <ShoppingCartIcon />
    </Button>
  )
  const buy = (
    <Button variant="buy" className="flex-1" onClick={onBuy}>
      {buyLabel}
    </Button>
  )

  if (layout === 'row') {
    return (
      <div className={cn('flex gap-2', className)}>
        {express}
        {cart}
        {buy}
      </div>
    )
  }
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {express}
      <div className="flex gap-4">
        {buy}
        {cart}
      </div>
    </div>
  )
}

/** Right-column card with the cheapest offer: price block, buy actions, "+11 offers from €29.99". */
function FeaturedOfferPanel({
  offer,
  label = 'Featured offer',
  offersHref = '#offers',
  onBuy,
  onExpress,
  onAddToCart,
  className,
}: {
  offer: FeaturedOffer
  label?: string
  offersHref?: string
  onBuy?: () => void
  onExpress?: () => void
  onAddToCart?: () => void
  className?: string
}) {
  return (
    <section aria-label={label} className={cn('bg-surface-tile', className)}>
      <div className="flex flex-col gap-6 p-5">
        <div className="flex flex-col gap-3">
          <p className="type-caption font-bold text-attention uppercase">{label}</p>
          <div className="flex flex-col gap-1">
            <PriceTag
              {...offer}
              size="lg"
              align="start"
              suffix={offer.priceNotFinal && (
                <span className="flex items-center gap-1 type-body font-normal text-muted-foreground">
                  Price is not final
                  <InfoIcon className="size-4" aria-hidden />
                </span>
              )}
            />
            {offer.promotionNote && <p className="type-caption text-muted-foreground">{offer.promotionNote}</p>}
          </div>
        </div>
        <BuyActions onBuy={onBuy} onExpress={onExpress} onAddToCart={onAddToCart} />
      </div>
      {offer.otherOffers && (
        <>
          <Separator />
          <a href={offersHref} className="block p-4 text-center type-body text-attention hover:underline">
            +
            {offer.otherOffers.count}
            {' '}
            offers from
            {' '}
            {offer.otherOffers.from}
          </a>
        </>
      )}
    </section>
  )
}

/** "Safe Checkout Guaranteed": accepted payment methods, trust score, guarantees. */
function CheckoutTrustPanel({
  paymentMethods,
  trustScore,
  className,
}: {
  paymentMethods: string[]
  trustScore?: string
  className?: string
}) {
  return (
    <section aria-labelledby="checkout-trust" className={cn('flex flex-col gap-4 bg-surface-tile p-5', className)}>
      <div className="flex flex-col gap-1">
        <h2 id="checkout-trust" className="type-label">Safe Checkout Guaranteed</h2>
        <p className="type-caption text-muted-foreground">Trusted Payment Methods</p>
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {paymentMethods.map(method => (
          <li key={method}>
            <Badge className="h-7 bg-light px-2 type-caption font-bold text-light-foreground">{method}</Badge>
          </li>
        ))}
      </ul>
      {trustScore && (
        <>
          <Separator />
          <div className="flex flex-col gap-1">
            <p className="type-caption text-muted-foreground">Data Encryption &amp; Protection</p>
            <p className="flex items-center gap-2 type-label">
              <ShieldCheckIcon className="size-5 text-positive" aria-hidden />
              Trust score
              {' '}
              {trustScore}
            </p>
          </div>
        </>
      )}
      <Separator />
      <p className="flex items-center gap-2 type-caption font-semibold text-positive uppercase">
        <GlobeLockIcon className="size-6 text-foreground" aria-hidden />
        Safe checkout guaranteed
      </p>
    </section>
  )
}

/** "Looking for good deals?" newsletter nudge. */
function DealsSignup({
  title = 'Looking for good deals?',
  text = 'Get them delivered to your inbox',
  actionLabel = 'Subscribe',
  onSubscribe,
  className,
}: {
  title?: string
  text?: string
  actionLabel?: string
  onSubscribe?: () => void
  className?: string
}) {
  return (
    <section className={cn('flex gap-3 bg-surface-tile p-5', className)}>
      <BadgePercentIcon className="size-6 shrink-0 text-cashback" aria-hidden />
      <div className="flex flex-col gap-1">
        <h2 className="type-label">{title}</h2>
        <p className="type-body text-muted-foreground">{text}</p>
        <Button variant="buy" size="sm" className="mt-2 w-fit px-8" onClick={onSubscribe}>{actionLabel}</Button>
      </div>
    </section>
  )
}

export { BuyActions, CheckoutTrustPanel, DealsSignup, FeaturedOfferPanel }
