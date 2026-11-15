import { BadgeCheckIcon, CircleHelpIcon, InfoIcon, ShieldCheckIcon, StarIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { BuyActions } from './buy-box'
import { PriceTag } from './price-tag'
import type { Offer, Seller } from './types'

function SellerInfo({ seller }: { seller: Seller }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-tile type-caption font-bold" aria-hidden>
        {seller.initials}
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="flex items-center gap-1 type-body">
          <span className="truncate">{seller.name}</span>
          {seller.verified && <BadgeCheckIcon className="size-4 shrink-0 fill-positive text-surface-deep" aria-label="Verified seller" />}
        </p>
        {seller.rating && (
          <p className="flex items-center gap-1 type-caption text-muted-foreground">
            <StarIcon className="size-3.5 fill-rating text-rating" aria-hidden />
            <span className="font-bold text-foreground">
              {seller.rating.score}
              {' '}
              {seller.rating.label}
            </span>
            rating
            <CircleHelpIcon className="size-3.5" aria-hidden />
          </p>
        )}
        {seller.note && (
          <p className="flex items-center gap-1 type-caption text-muted-foreground">
            <ShieldCheckIcon className="size-3.5 text-positive" aria-hidden />
            {seller.note}
            <InfoIcon className="size-3.5" aria-hidden />
          </p>
        )}
      </div>
    </div>
  )
}

/**
 * One seller offer. Desktop: seller · price · "Buy now" on one line.
 * Phone: seller over price, then the full PayPal / cart / Buy now row.
 */
function OfferRow({
  offer,
  buyLabel = 'Buy now',
  onBuy,
  className,
}: {
  offer: Offer
  buyLabel?: string
  onBuy?: (offer: Offer) => void
  className?: string
}) {
  return (
    <li className={cn('flex flex-col gap-4 bg-surface-deep p-5 md:flex-row md:items-center', className)}>
      <SellerInfo seller={offer.seller} />
      <PriceTag {...offer} className="max-md:items-start max-md:text-left md:ml-auto" />
      <Button variant="secondary" className="px-3 max-md:hidden" onClick={() => onBuy?.(offer)}>{buyLabel}</Button>
      <BuyActions layout="row" buyLabel={buyLabel} onBuy={() => onBuy?.(offer)} className="md:hidden" />
    </li>
  )
}

/**
 * Titled list of offers with "Load N more offers". Shows `initialCount`, then reveals `step` per click.
 * `highlightCount` renders the "11 other offers" style title with the number in mint.
 */
function OfferList({
  title,
  offers,
  highlightCount = false,
  initialCount = offers.length,
  step = 8,
  onBuy,
  id,
  className,
}: {
  title: string
  offers: Offer[]
  highlightCount?: boolean
  initialCount?: number
  step?: number
  onBuy?: (offer: Offer) => void
  id?: string
  className?: string
}) {
  const [visible, setVisible] = useState(initialCount)
  const remaining = offers.length - visible

  return (
    <section id={id} className={cn('flex scroll-mt-24 flex-col gap-4', className)}>
      <h2 className="flex items-center gap-1.5 type-h3 font-bold">
        {highlightCount && <span className="text-positive">{offers.length}</span>}
        {title}
        <InfoIcon className="size-4 text-muted-foreground" aria-hidden />
      </h2>
      <ul className="flex flex-col gap-2">
        {offers.slice(0, visible).map(offer => <OfferRow key={offer.id} offer={offer} onBuy={onBuy} />)}
      </ul>
      {remaining > 0 && (
        <Button variant="secondary" className="self-center" onClick={() => setVisible(v => v + step)}>
          Load
          {' '}
          {Math.min(step, remaining)}
          {' '}
          more offers
        </Button>
      )}
    </section>
  )
}

export { OfferList, OfferRow, SellerInfo }
