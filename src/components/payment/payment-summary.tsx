import { ChevronUpIcon, CircleHelpIcon } from 'lucide-react'
import { Fragment, useState } from 'react'

import { CartItem } from '@/components/cart/cart-item'
import type { CartLine } from '@/components/cart/types'
import { StarRating } from '@/components/product/star-rating'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

import type { LegalLink } from './types'

function InlineLink({ link }: { link: LegalLink }) {
  return <a href={link.href} className="text-attention hover:underline">{link.label}</a>
}

/** "By clicking "Continue" I acknowledge…" with the site terms and each seller's policy. */
function PaymentLegal({ terms, privacy, cookies, sellerPolicies }: {
  terms: LegalLink
  privacy: LegalLink
  cookies: LegalLink
  sellerPolicies: LegalLink[]
}) {
  return (
    <p className="type-caption text-muted-foreground">
      By clicking &ldquo;Continue&rdquo; I acknowledge I have read and accepted the
      {' '}
      <InlineLink link={terms} />
      {' '}
      including the
      {' '}
      <InlineLink link={privacy} />
      {' '}
      and
      {' '}
      <InlineLink link={cookies} />
      .
      {sellerPolicies.length > 0 && ' I also have read and accepted '}
      {sellerPolicies.map((link, i) => (
        <Fragment key={link.href + link.label}>
          {i > 0 && ', '}
          <InlineLink link={link} />
        </Fragment>
      ))}
    </p>
  )
}

/**
 * Payment page order summary: cart lines, sub-total, service fee, total + cashback, Continue and the legal note.
 * Tablet/desktop: a plain panel. Phone: pinned to the bottom of the screen showing only the totals;
 * the "Cart information" bar expands it to fill the screen with the lines.
 */
function PaymentSummary({
  lines,
  onQuantityChange,
  onRemove,
  onWishlist,
  subtotal,
  serviceFee = '--',
  total,
  cashback,
  sellers,
  continueDisabled,
  onContinue,
  legal,
  reviews,
  className,
}: {
  lines: CartLine[]
  onQuantityChange?: (line: CartLine, quantity: number) => void
  onRemove?: (line: CartLine) => void
  onWishlist?: (line: CartLine) => void
  subtotal: string
  serviceFee?: string
  total: string
  cashback?: string
  /** Seller names for "Payment collected on behalf of …". */
  sellers: string[]
  continueDisabled?: boolean
  onContinue?: () => void
  legal: React.ComponentProps<typeof PaymentLegal>
  reviews?: { rating: number, label: string, href: string }
  className?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <section
      aria-label="Cart information"
      data-open={open || undefined}
      className={cn(
        'flex flex-col bg-surface-deep',
        // Phone: pinned under the content while closed, full screen under the header while open.
        'max-sm:sticky max-sm:bottom-0 max-sm:z-30 max-sm:data-open:fixed max-sm:data-open:inset-x-0 max-sm:data-open:top-header-mobile max-sm:data-open:bottom-0',
        className,
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between bg-background px-5 py-3.5 type-label outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset sm:hidden"
      >
        Cart information
        <ChevronUpIcon className={cn('size-5 transition-transform', open && 'rotate-180')} aria-hidden />
      </button>

      <div className={cn('flex flex-col gap-2 overflow-y-auto sm:px-5 sm:pt-5', open ? 'max-sm:min-h-0 max-sm:flex-1' : 'max-sm:hidden')}>
        {lines.map((line, i) => (
          <Fragment key={line.id}>
            {i > 0 && <Separator className="sm:hidden" />}
            <CartItem
              line={line}
              onQuantityChange={onQuantityChange}
              onRemove={onRemove}
              onWishlist={onWishlist}
              className="bg-transparent max-sm:px-2"
            />
          </Fragment>
        ))}
      </div>

      <Separator className={cn('mt-3 max-sm:mt-0', !open && 'max-sm:hidden')} />

      <dl className={cn('flex flex-col gap-1 px-5 pt-4 type-body sm:px-7.5 sm:pt-6', open ? 'max-sm:pb-4' : 'max-sm:bg-background')}>
        <div className={cn('flex items-center justify-between gap-4', !open && 'max-sm:hidden')}>
          <dt>Sub-total</dt>
          <dd className="font-bold">{subtotal}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="flex items-center gap-1">
            Service fee
            <CircleHelpIcon className="size-4" aria-label="Calculated when you choose a payment method" />
          </dt>
          <dd className="flex items-center gap-1 font-bold">
            {serviceFee}
            <CircleHelpIcon className="size-4" aria-hidden />
          </dd>
        </div>
      </dl>

      <div className="flex flex-col gap-4 px-5 pt-4 pb-5 max-sm:bg-background sm:px-7.5 sm:pt-6 sm:pb-7.5">
        <div className="flex items-start justify-between gap-4">
          <p className="type-h3 font-bold">Total:</p>
          <div className="flex flex-col items-end">
            <p className="type-h1">{total}</p>
            {cashback && (
              <p className="type-label text-cashback">
                Cashback:
                {' '}
                {cashback}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {sellers.length > 0 && (
            <p className="type-body">
              Payment collected on behalf of
              {' '}
              {sellers.join(', ')}
            </p>
          )}
          <Button variant="buy" className="w-full" disabled={continueDisabled} onClick={onContinue}>Continue</Button>
        </div>

        <PaymentLegal {...legal} />

        {reviews && (
          <a href={reviews.href} className="flex items-center justify-center gap-3 pt-2 type-label hover:text-attention max-sm:hidden">
            <StarRating value={reviews.rating} size="md" />
            {reviews.label}
          </a>
        )}
      </div>
    </section>
  )
}

export { PaymentLegal, PaymentSummary }
