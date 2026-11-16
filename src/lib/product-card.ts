import type { ProductResource } from '@/client'
import type { Product } from '@/components/product/product-card'

/** Maps an API product onto the `Product` shape <ProductCard> renders. */
export function toCardProps(p: ProductResource): Product {
  return {
    title: p.title,
    platform: p.platform.label,
    region: p.region.label,
    regionTone: p.region.value === 'europe' ? 'eu' : 'alt',
    price: p.price.formatted,
    oldPrice: p.original_price?.formatted,
    discount: p.discount_percent > 0 ? `-${p.discount_percent}%` : undefined,
    cashback: p.cashback?.formatted,
    image: p.image_url || undefined,
    // Shown while the image loads, or when there's none.
    cover: 'bg-linear-to-br from-surface-tile to-primary',
  }
}
