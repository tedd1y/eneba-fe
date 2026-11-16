import { CheckIcon, ShoppingCartIcon, XIcon } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'

/**
 * "Added to cart" confirmation: cart icon with a tick, item count,
 * "Continue shopping" (closes) and "View cart" (goes to the cart page).
 * With `failed`, it explains that nothing was added because a limit was hit.
 * Controlled; the cart store opens it on every add attempt.
 */
function AddedToCartModal({
  open,
  onOpenChange,
  count,
  failed = false,
  failedMessage,
  cartHref = '/cart',
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Units now in the cart. */
  count: number
  /** The add was refused (cart or line full). */
  failed?: boolean
  /** Shown instead of the count when `failed`. */
  failedMessage?: string
  cartHref?: string
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="flex max-w-md flex-col items-center gap-0 rounded-none bg-surface-tile p-10 text-center ring-0 sm:max-w-lg">
        <span className="relative mb-6 inline-flex" aria-hidden>
          <ShoppingCartIcon className="size-20 stroke-[1.5]" />
          {failed
            ? <XIcon className="absolute top-1 left-1/2 size-9 -translate-x-1/4 stroke-3 text-destructive" />
            : <CheckIcon className="absolute top-1 left-1/2 size-9 -translate-x-1/4 stroke-3 text-positive" />}
        </span>
        <DialogTitle>{failed ? 'Couldn\'t add to cart' : 'Added to cart'}</DialogTitle>
        <DialogDescription className="mt-2">
          {failed && failedMessage && (
            <>
              <span className="block text-attention">{failedMessage}</span>
              {' '}
            </>
          )}
          You have
          {' '}
          <strong className="font-bold text-foreground">
            {count}
            {' '}
            {count === 1 ? 'item' : 'items'}
          </strong>
          {' '}
          in your cart
        </DialogDescription>
        <div className="mt-8 grid w-full gap-4 sm:grid-cols-2">
          <DialogClose render={<Button variant="buy" />}>Continue shopping</DialogClose>
          <DialogClose nativeButton={false} render={<Button variant="secondary" nativeButton={false} render={<Link to={cartHref} />} />}>
            View cart
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { AddedToCartModal }
