import { CheckIcon, ShoppingCartIcon } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'

/**
 * "Added to cart" confirmation: cart icon with a tick, item count,
 * "Continue shopping" (closes) and "View cart" (goes to the cart page).
 * Controlled; the cart store opens it whenever something is added.
 */
function AddedToCartModal({
  open,
  onOpenChange,
  count,
  cartHref = '/cart',
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Units now in the cart. */
  count: number
  cartHref?: string
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="flex max-w-md flex-col items-center gap-0 rounded-none bg-surface-tile p-10 text-center ring-0 sm:max-w-lg">
        <span className="relative mb-6 inline-flex" aria-hidden>
          <ShoppingCartIcon className="size-20 stroke-[1.5]" />
          <CheckIcon className="absolute top-1 left-1/2 size-9 -translate-x-1/4 stroke-3 text-positive" />
        </span>
        <DialogTitle>Added to cart</DialogTitle>
        <DialogDescription className="mt-2">
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
