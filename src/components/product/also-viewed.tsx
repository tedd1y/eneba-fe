import { useState } from 'react'

import { type Product, ProductCard, ProductCardRow } from '@/components/product/product-card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * "Gamers also viewed": 3-column card grid on tablet/desktop, row cards on phone.
 * Shows `initialCount`, "Load more" reveals `step` at a time.
 */
function AlsoViewed({
  products,
  initialCount = 6,
  step = 3,
  onAddToCart,
  className,
}: {
  products: Product[]
  initialCount?: number
  step?: number
  onAddToCart?: (product: Product) => void
  className?: string
}) {
  const [visible, setVisible] = useState(initialCount)
  const shown = products.slice(0, visible)

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <ul className="grid gap-2 md:grid-cols-3 md:gap-4">
        {shown.map(p => (
          <li key={p.title}>
            <ProductCard product={p} onAddToCart={onAddToCart} className="max-md:hidden" />
            <ProductCardRow product={p} className="md:hidden" />
          </li>
        ))}
      </ul>
      {visible < products.length && (
        <Button variant="secondary" className="self-center" onClick={() => setVisible(v => v + step)}>
          Load more
        </Button>
      )}
    </div>
  )
}

export { AlsoViewed }
