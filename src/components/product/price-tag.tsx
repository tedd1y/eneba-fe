import { CirclePlusIcon, InfoIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import type { Price } from './types'

/** "€32.99 -5% ⓘ" over "€31.49 ⓘ", optional cashback line and "Best cashback" pill. */
function PriceTag({
  price,
  oldPrice,
  discount,
  cashbackPercent,
  bestCashback,
  size = 'md',
  align = 'end',
  suffix,
  className,
}: Price & {
  cashbackPercent?: string
  bestCashback?: boolean
  size?: 'md' | 'lg'
  align?: 'start' | 'end'
  /** Rendered after the big price ("Price is not final ⓘ"). */
  suffix?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-0.5', align === 'end' ? 'items-end text-right' : 'items-start', className)}>
      {oldPrice && (
        <p className="flex items-center gap-1 type-caption text-muted-foreground">
          <s>{oldPrice}</s>
          {discount && <span className="font-semibold text-cashback">{discount}</span>}
          <InfoIcon className="size-3.5" aria-hidden />
        </p>
      )}
      <p className={cn('flex items-center gap-1.5', size === 'lg' ? 'type-h1' : 'type-h3 font-bold')}>
        {price}
        {!suffix && <InfoIcon className="size-4 text-muted-foreground" aria-hidden />}
        {suffix}
      </p>
      {cashbackPercent && (
        <p className={cn('flex items-center gap-1 type-label', bestCashback ? 'text-cashback' : 'text-muted-foreground')}>
          <CirclePlusIcon className="size-4" aria-hidden />
          {cashbackPercent}
          {' '}
          Cashback
          {bestCashback && size === 'lg' && <BestCashbackBadge />}
        </p>
      )}
      {bestCashback && size !== 'lg' && <BestCashbackBadge />}
    </div>
  )
}

function BestCashbackBadge() {
  return (
    <Badge variant="outline" className="h-5 rounded-full border-cashback px-2 type-caption font-semibold text-cashback">
      Best cashback
    </Badge>
  )
}

export { BestCashbackBadge, PriceTag }
