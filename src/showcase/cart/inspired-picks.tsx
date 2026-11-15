import { InfoIcon } from 'lucide-react'

import { type Product, ProductCard, ProductCardRow } from '@/components/product/product-card'
import { ProductRail } from '@/components/product/product-rail'
import { cn } from '@/lib/utils'

/** "Inspired by your picks" — product rail on tablet/desktop, row cards on phone. Reuses the store cards. */
function InspiredPicks({
  title = 'Inspired by your picks',
  products,
  getHref,
  onAddToCart,
  className,
}: {
  title?: string
  products: Product[]
  getHref?: (product: Product) => string
  onAddToCart?: (product: Product) => void
  className?: string
}) {
  if (products.length === 0) return null

  return (
    <section className={cn('flex flex-col gap-5 bg-surface-deep p-5 max-sm:bg-transparent max-sm:px-0', className)}>
      <h2 className="flex items-center gap-2 type-h3 font-bold">
        {title}
        <InfoIcon className="size-4 text-muted-foreground" aria-hidden />
      </h2>
      <ProductRail className="max-sm:hidden">
        {products.map(p => (
          <ProductCard key={p.title} product={p} offersHref={getHref?.(p)} onAddToCart={onAddToCart} />
        ))}
      </ProductRail>
      <div className="flex flex-col gap-2 sm:hidden">
        {products.map(p => <ProductCardRow key={p.title} product={p} offersHref={getHref?.(p)} />)}
      </div>
    </section>
  )
}

export { InspiredPicks }
