import { ChevronDownIcon, CircleHelpIcon, TicketPercentIcon } from 'lucide-react'
import { useState } from 'react'

import { StarRating } from '@/components/product/star-rating'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

import type { SummaryRow } from './types'

export type Consent = { id: string, label: string }

/** "Got discount code?" — collapsible code field. `onApply` returns an error message or nothing. */
function DiscountCode({
  onApply,
  applied,
  className,
}: {
  onApply: (code: string) => string | void
  /** Currently applied code, shown instead of the field. */
  applied?: string
  className?: string
}) {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string>()

  return (
    <Collapsible className={className}>
      <CollapsibleTrigger className="group/discount flex w-full items-center gap-3 px-5 py-5 text-left type-body outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset sm:px-8">
        <TicketPercentIcon className="size-5" aria-hidden />
        <span className="flex-1">{applied ? `Discount code: ${applied}` : 'Got discount code?'}</span>
        <ChevronDownIcon className="size-5 transition-transform group-data-panel-open/discount:rotate-180" aria-hidden />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-5 pb-5 sm:px-8">
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            const message = onApply(code.trim())
            setError(message || undefined)
            if (!message) setCode('')
          }}
        >
          <div className="flex gap-2">
            <Input
              variant="inset"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Enter code"
              aria-label="Discount code"
              aria-invalid={error ? true : undefined}
              className="h-10"
            />
            <Button type="submit" variant="secondary" disabled={!code.trim()}>Apply</Button>
          </div>
          {error && <p className="type-caption text-destructive">{error}</p>}
        </form>
      </CollapsibleContent>
    </Collapsible>
  )
}

/**
 * Order summary: checkout button, line rows, total + cashback, marketing consents,
 * discount code and the reviews link. Desktop shows the button on top; phone under the consents.
 */
function CartSummary({
  rows,
  total,
  cashback,
  consents,
  consentValue,
  onConsentChange,
  checkoutLabel = 'Proceed to checkout',
  checkoutDisabled,
  onCheckout,
  privacyHref = '#',
  discount,
  reviews,
  className,
}: {
  rows: SummaryRow[]
  total: string
  cashback?: string
  consents: Consent[]
  consentValue: Record<string, boolean>
  onConsentChange: (id: string, checked: boolean) => void
  checkoutLabel?: string
  checkoutDisabled?: boolean
  onCheckout?: () => void
  privacyHref?: string
  /** DiscountCode element (or anything) shown under the consents. */
  discount?: React.ReactNode
  reviews?: { rating: number, label: string, href: string }
  className?: string
}) {
  const checkout = (
    <Button variant="buy" className="w-full" disabled={checkoutDisabled} onClick={onCheckout}>
      {checkoutLabel}
    </Button>
  )

  return (
    <section aria-labelledby="cart-summary" className={cn('flex flex-col bg-surface-deep', className)}>
      <div className="flex flex-col gap-4 px-5 pt-5 pb-4 sm:px-8 sm:pt-8">
        <h2 id="cart-summary" className="type-h3 font-bold">Summary</h2>
        <div className="max-lg:hidden">{checkout}</div>
        <dl className="flex flex-col gap-1 type-body">
          {rows.map(row => (
            <div key={row.label} className="flex items-center justify-between gap-4">
              <dt className="flex items-center gap-1">
                {row.label}
                {row.hint && <CircleHelpIcon className="size-4 text-muted-foreground" aria-label={row.hint} />}
              </dt>
              <dd className="font-bold">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <Separator />

      <div className="flex flex-col gap-4 px-5 py-5 sm:px-8">
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

        <div className="flex flex-col gap-3">
          {consents.map(consent => (
            <label key={consent.id} className="flex items-start gap-3 type-caption text-muted-foreground">
              <Checkbox
                checked={consentValue[consent.id] ?? false}
                onCheckedChange={checked => onConsentChange(consent.id, checked === true)}
                className="mt-0.5"
              />
              {consent.label}
            </label>
          ))}
          <p className="type-caption text-muted-foreground">
            You can unsubscribe whenever you want. Visit
            {' '}
            <a href={privacyHref} className="text-attention hover:underline">Eneba Privacy Notice</a>
            {' '}
            for more information.
          </p>
        </div>

        <div className="lg:hidden">{checkout}</div>
      </div>

      {discount && (
        <>
          <Separator />
          {discount}
        </>
      )}

      {reviews && (
        <a href={reviews.href} className="flex items-center justify-center gap-3 px-5 pt-2 pb-8 type-label hover:text-attention">
          <StarRating value={reviews.rating} size="md" />
          {reviews.label}
        </a>
      )}
    </section>
  )
}

export { CartSummary, DiscountCode }
