import { CircleHelpIcon, HeartIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

import { QuantityStepper } from './quantity-stepper'
import type { CartLine } from './types'

/**
 * One cart line: cover, "Sold by", title, note, quantity, price, cashback, wishlist + remove.
 * Lays out by its own width (container query), so it works in the cart page and the narrow cart popup:
 * wide puts quantity and price on the note row; narrow stacks them under the title.
 * The heart only shows when `onWishlist` is passed.
 */
function CartItem({
  line,
  maxQuantity = 10,
  onQuantityChange,
  onRemove,
  onWishlist,
  className,
}: {
  line: CartLine
  maxQuantity?: number
  onQuantityChange?: (line: CartLine, quantity: number) => void
  onRemove?: (line: CartLine) => void
  onWishlist?: (line: CartLine) => void
  className?: string
}) {
  const [failedImage, setFailedImage] = useState<string>()
  const showImage = line.image && failedImage !== line.image

  return (
    <article className={cn('@container bg-card', className)}>
      <div className="flex gap-3 p-3 @md:gap-4 @md:p-0 @md:pr-5">
        {showImage
          ? <img src={line.image} alt="" onError={() => setFailedImage(line.image)} className="aspect-[3/4] w-16 shrink-0 self-start object-cover @md:w-24" />
          : <div className={cn('aspect-[3/4] w-16 shrink-0 self-start @md:w-24', line.cover)} aria-hidden />}

        <div className="flex min-w-0 flex-1 flex-col gap-2 @md:py-4">
          <div className="flex items-start gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="flex min-w-0 items-center gap-2 type-label whitespace-nowrap">
                Sold by
                <span className="grid size-5 place-items-center rounded-full bg-surface-tile type-caption font-bold" aria-hidden>{line.seller.initials}</span>
                <span className="truncate">{line.seller.name}</span>
              </p>
              <h3 className="type-card-title @md:type-h3 @md:text-base">{line.title}</h3>
            </div>
            <div className="flex shrink-0 items-center">
              {onWishlist && (
                <>
                  <Button variant="ghost" size="icon-sm" aria-label="Move to wishlist" onClick={() => onWishlist(line)}>
                    <HeartIcon />
                  </Button>
                  <Separator orientation="vertical" className="h-5 data-vertical:self-center" />
                </>
              )}
              <Button variant="ghost" size="icon-sm" aria-label={`Remove ${line.title}`} onClick={() => onRemove?.(line)}>
                <Trash2Icon />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            {line.note && (
              <p className="flex items-center gap-1 type-caption text-muted-foreground @max-md:basis-full">
                {line.note}
                <CircleHelpIcon className="size-3.5" aria-hidden />
              </p>
            )}
            <QuantityStepper
              value={line.quantity}
              max={maxQuantity}
              onValueChange={q => onQuantityChange?.(line, q)}
              label={`Quantity of ${line.title}`}
              className="@md:ml-auto"
            />
            <p className="ml-auto min-w-16 text-right type-card-title font-bold @md:ml-0">{line.price}</p>
          </div>

          {line.cashback && (
            <p className="type-caption text-cashback">
              Cashback:
              {' '}
              {line.cashback}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}

/** "My cart" panel: title plus the lines, or an empty state with a store link. */
function CartList({
  title = 'My cart',
  emptyText = 'Your cart is empty.',
  storeHref = '/store',
  children,
  className,
}: {
  title?: string
  emptyText?: string
  storeHref?: string
  /** CartItem elements; pass none for the empty state. */
  children?: React.ReactNode
  className?: string
}) {
  const hasItems = Array.isArray(children) ? children.length > 0 : Boolean(children)

  return (
    <section aria-label={title} className={cn('flex flex-col gap-4 bg-surface-deep p-5 max-sm:p-3', className)}>
      <h2 className="type-h3 font-bold max-sm:sr-only">{title}</h2>
      {hasItems
        ? <div className="flex flex-col gap-2">{children}</div>
        : (
            <p className="flex flex-col items-start gap-3 type-body text-muted-foreground">
              {emptyText}
              <Button variant="secondary" size="sm" nativeButton={false} render={<Link to={storeHref} />}>Browse the store</Button>
            </p>
          )}
    </section>
  )
}

export { CartItem, CartList }
