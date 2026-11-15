import { ChevronRightIcon, HeartIcon, HouseIcon } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

import type { BreadcrumbItem, FeatureLine, ProductFeature } from './types'

/** "⌂ › Store › Categories › … › Age of Empires II: D…". Last item is the current page. */
function ProductBreadcrumbs({ items, className }: { items: BreadcrumbItem[], className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('min-w-0', className)}>
      <ol className="flex min-w-0 items-center gap-1.5 type-body text-muted-foreground">
        <li className="shrink-0">
          <a href="/" aria-label="Home" className="transition-colors hover:text-attention">
            <HouseIcon className="size-4" aria-hidden />
          </a>
        </li>
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={item.label} className={cn('flex items-center gap-1.5', last ? 'min-w-0' : 'shrink-0 max-md:hidden')}>
              <ChevronRightIcon className="size-3.5 shrink-0" aria-hidden />
              {last || !item.href
                ? <span aria-current={last ? 'page' : undefined} className="truncate">{item.label}</span>
                : <a href={item.href} className="transition-colors hover:text-attention">{item.label}</a>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/** Heart + count bookmark in the top-right of the hero. Toggles locally; reports through `onToggle`. */
function WishlistToggle({
  count,
  defaultActive = false,
  onToggle,
}: {
  /** Omit to show the heart without a counter. */
  count?: number
  defaultActive?: boolean
  onToggle?: (active: boolean) => void
}) {
  const [active, setActive] = useState(defaultActive)
  const shown = count === undefined ? undefined : count + (active && !defaultActive ? 1 : 0) - (!active && defaultActive ? 1 : 0)

  return (
    <Button
      variant="ghost"
      aria-pressed={active}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      onClick={() => {
        setActive(!active)
        onToggle?.(!active)
      }}
      className="h-auto shrink-0 flex-col gap-1 bg-surface-deep px-3 py-2 type-caption"
    >
      <HeartIcon className={cn(active && 'fill-attention text-attention')} aria-hidden />
      {shown?.toLocaleString()}
    </Button>
  )
}

function FeatureLineText({ line }: { line: FeatureLine }) {
  return (
    <p className={cn('type-caption', line.positive ? 'text-positive' : 'text-muted-foreground')}>
      {line.text}
      {line.link && (
        <>
          {' '}
          <a href={line.link.href} className="text-attention hover:underline">{line.link.label}</a>
        </>
      )}
    </p>
  )
}

/** Icon + title + supporting lines ("Global, Europe — Can be activated in Lithuania"). */
function FeatureList({ features }: { features: ProductFeature[] }) {
  return (
    <ul className="flex flex-col gap-5">
      {features.map(({ icon: Icon, title, lines }) => (
        <li key={title} className="flex gap-4">
          <Icon className="size-9 shrink-0 stroke-[1.5]" aria-hidden />
          <div className="flex flex-col gap-0.5">
            <p className="type-card-title">{title}</p>
            {lines.map(line => <FeatureLineText key={line.text} line={line} />)}
          </div>
        </li>
      ))}
    </ul>
  )
}

/**
 * Top of the product page: box art, deal badge, title, wishlist, feature rows, "Works on".
 * On phones the art shrinks beside the title and the feature list drops below.
 */
function ProductHero({
  title,
  cover = 'bg-linear-to-br from-surface-tile to-primary',
  image,
  badge,
  wishlistCount,
  features,
  worksOn,
  requirementsHref = '#system-requirements',
  className,
}: {
  title: string
  /** Token classes for the placeholder, shown when there's no `image` or it fails to load. */
  cover?: string
  image?: string
  badge?: string
  wishlistCount?: number
  features: ProductFeature[]
  worksOn?: string[]
  requirementsHref?: string
  className?: string
}) {
  // Remember which URL failed, so navigating to another product retries its image.
  const [failedImage, setFailedImage] = useState<string>()

  return (
    <div className={cn('grid grid-cols-[5rem_1fr] gap-x-4 gap-y-6 md:grid-cols-[var(--spacing-product-cover)_1fr] md:grid-rows-[auto_1fr] md:gap-x-8', className)}>
      {image && failedImage !== image
        ? <img src={image} alt={`${title} cover`} onError={() => setFailedImage(image)} className="aspect-[5/7] w-full object-cover md:row-span-2 md:self-start" />
        : <div className={cn('aspect-[5/7] w-full md:row-span-2 md:self-start', cover)} role="img" aria-label={`${title} cover`} />}

      <div className="flex min-w-0 items-start gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {badge && <Badge variant="outline" className="rounded-full border-highlight type-label text-highlight">{badge}</Badge>}
          <h1 className="type-h3 md:type-h2">{title}</h1>
        </div>
        <WishlistToggle count={wishlistCount} />
      </div>

      <div className="col-span-2 flex flex-col gap-6 md:col-span-1 md:col-start-2">
        <FeatureList features={features} />
        {worksOn && (
          <>
            <Separator />
            <p className="flex flex-wrap gap-x-6 gap-y-1 type-caption text-muted-foreground">
              <span>
                Works on:
                {' '}
                <span className="text-foreground">{worksOn.join(', ')}</span>
              </span>
              <a href={requirementsHref} className="text-attention hover:underline">Check requirements</a>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export { FeatureList, ProductBreadcrumbs, ProductHero, WishlistToggle }
