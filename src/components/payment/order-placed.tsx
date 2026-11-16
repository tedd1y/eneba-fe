import { CircleCheckIcon, Gamepad2Icon, MessageSquareWarningIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * "Thank you for your order": controller with a tick, order number and "View order details".
 * With `statusText` (an order that isn't paid), it says so instead and hides the details button.
 */
function OrderPlaced({ orderNumber, statusText, onViewDetails, className }: {
  orderNumber: string
  /** e.g. "is still pending payment"; replaces "has been placed successfully". */
  statusText?: string
  onViewDetails?: () => void
  className?: string
}) {
  return (
    <section className={cn('flex flex-col items-center gap-3 text-center', className)}>
      <span className="relative mb-3 inline-flex" aria-hidden>
        <Gamepad2Icon className="size-16 stroke-[1.5]" />
        {!statusText && <CircleCheckIcon className="absolute -right-3 bottom-0 size-8 fill-positive stroke-surface-deep stroke-[2.5]" />}
      </span>
      <h1 className="type-h2">{statusText ? 'Your order isn\'t ready yet' : 'Thank you for your order'}</h1>
      <p className="type-body text-muted-foreground">
        Your order
        {' '}
        <strong className="font-bold text-foreground">
          #
          {orderNumber}
        </strong>
        {' '}
        {statusText ?? 'has been placed successfully'}
      </p>
      {!statusText && <Button variant="buy" className="mt-10 w-full max-w-70" onClick={onViewDetails}>View order details</Button>}
    </section>
  )
}

/** "Having issues?" help strip with a "Create ticket" button. */
function HavingIssues({ ticketHref = '#', className }: { ticketHref?: string, className?: string }) {
  return (
    <section className={cn('flex items-center gap-5', className)}>
      <MessageSquareWarningIcon className="size-9 shrink-0 fill-attention stroke-attention-foreground" aria-hidden />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <h2 className="type-label">Having issues?</h2>
        <p className="type-caption">We are eager to help you! Create the ticket, describe the details and we&apos;ll do our best to solve it.</p>
      </div>
      <Button variant="secondary" nativeButton={false} render={<a href={ticketHref} />} className="shrink-0 max-sm:px-2.5">Create ticket</Button>
    </section>
  )
}

export { HavingIssues, OrderPlaced }
