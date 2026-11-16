import { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import { CircleHelpIcon, ShoppingCartIcon, XIcon } from 'lucide-react'
import { Link } from 'react-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { CartItem } from './cart-item'
import type { CartLine } from './types'

/**
 * Header cart icon with a red item-count bubble. Clicking opens "My shopping cart":
 * a popup anchored under the icon over a dimmed backdrop, listing the lines,
 * service fee, total + cashback and "View cart" / "Checkout now".
 * Open state can be controlled (`open` + `onOpenChange`) or left to the component.
 */
function CartButton({
  lines,
  count = lines.reduce((n, l) => n + l.quantity, 0),
  total,
  cashback,
  serviceFee = '--',
  cartHref = '/cart',
  onQuantityChange,
  onRemove,
  onCheckout,
  open,
  onOpenChange,
  className,
}: {
  lines: CartLine[]
  /** Number in the bubble; defaults to the sum of quantities. Hidden at 0. */
  count?: number
  total: string
  cashback?: string
  serviceFee?: string
  cartHref?: string
  onQuantityChange?: (line: CartLine, quantity: number) => void
  onRemove?: (line: CartLine) => void
  onCheckout?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}) {
  const label = count > 0 ? `Cart, ${count} ${count === 1 ? 'item' : 'items'}` : 'Cart, empty'

  return (
    <PopoverPrimitive.Root modal open={open} onOpenChange={next => onOpenChange?.(next)}>
      <PopoverPrimitive.Trigger
        render={<Button variant="ghost" size="icon" aria-label={label} className={className} />}
      >
        {/* Bubble is pinned to the icon, so it stays put however tall the button is (header bar). */}
        <span className="relative inline-flex">
          <ShoppingCartIcon />
          {count > 0 && (
            <Badge variant="notification" className="pointer-events-none absolute -top-2.5 -right-2.5" aria-hidden>
              {count > 99 ? '99+' : count}
            </Badge>
          )}
        </span>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Backdrop className="fixed inset-0 z-40 bg-overlay transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <PopoverPrimitive.Positioner side="bottom" align="end" sideOffset={8} collisionPadding={16} className="z-50">
          <PopoverPrimitive.Popup
            className="flex max-h-[calc(100dvh-6rem)] w-[min(22.5rem,calc(100vw-2rem))] origin-(--transform-origin) flex-col bg-surface-tile text-foreground shadow-lg outline-none transition-[opacity,scale] duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0"
          >
            <PopoverPrimitive.Arrow className="data-[side=bottom]:-top-2">
              <span className="block size-0 border-x-8 border-b-8 border-x-transparent border-b-surface-tile" aria-hidden />
            </PopoverPrimitive.Arrow>

            <header className="flex items-center justify-between gap-4 px-5 pt-5 pb-4">
              <PopoverPrimitive.Title className="type-h3 font-bold">My shopping cart</PopoverPrimitive.Title>
              <PopoverPrimitive.Close render={<Button variant="ghost" size="icon-sm" aria-label="Close cart" />}>
                <XIcon />
              </PopoverPrimitive.Close>
            </header>
            <Separator />

            {lines.length === 0
              ? (
                  <p className="px-5 py-8 text-center type-body text-muted-foreground" aria-live="polite">
                    {/* count > 0 with no lines yet means prices are still loading. */}
                    {count > 0 ? 'Loading your cart…' : 'Your cart is empty.'}
                  </p>
                )
              : (
                  <>
                    <div className="flex min-h-0 flex-col overflow-y-auto">
                      {lines.map(line => (
                        <CartItem
                          key={line.id}
                          line={line}
                          onQuantityChange={onQuantityChange}
                          onRemove={onRemove}
                          className="border-b border-border bg-transparent"
                        />
                      ))}
                    </div>

                    <div className="flex flex-col gap-4 p-5">
                      <dl className="flex flex-col gap-1">
                        <div className="flex items-center justify-between type-body">
                          <dt>Service fee:</dt>
                          <dd className="flex items-center gap-1 font-bold">
                            {serviceFee}
                            <CircleHelpIcon className="size-4 text-muted-foreground" aria-hidden />
                          </dd>
                        </div>
                        <div className="flex items-start justify-between">
                          <dt className="type-h3 font-bold">Total</dt>
                          <dd className="flex flex-col items-end">
                            <span className="type-h1">{total}</span>
                            {cashback && (
                              <span className="type-label text-cashback">
                                Cashback:
                                {' '}
                                {cashback}
                              </span>
                            )}
                          </dd>
                        </div>
                      </dl>
                      <div className="flex flex-col gap-3">
                        <PopoverPrimitive.Close
                          nativeButton={false}
                          render={<Button variant="buy" className="w-full" nativeButton={false} render={<Link to={cartHref} />} />}
                        >
                          View cart
                        </PopoverPrimitive.Close>
                        <Button variant="secondary" className="w-full" onClick={onCheckout}>Checkout now</Button>
                      </div>
                    </div>
                  </>
                )}
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

export { CartButton }
