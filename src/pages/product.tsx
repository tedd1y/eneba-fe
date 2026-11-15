import { useQuery } from '@tanstack/react-query'
import { CircleCheckIcon, Gamepad2Icon, HandCoinsIcon, KeyRoundIcon } from 'lucide-react'
import { useParams } from 'react-router'

import type { ProductDetailResource } from '@/client'
import { v1ProductsShowOptions } from '@/client/@tanstack/react-query.gen.ts'
import { v1ProductsShow } from '@/client/sdk.gen.ts'
import { NotFound } from '@/components/layout/not-found'
import { NotFoundError } from '@/lib/errors'
import { AlsoViewed } from '@/components/product/also-viewed'
import { CheckoutTrustPanel, DealsSignup, FeaturedOfferPanel } from '@/components/product/buy-box'
import { MediaStrip } from '@/components/product/media-strip'
import { OfferList } from '@/components/product/offer-list'
import { DescriptionTabs, DetailSection, SpecList, SystemRequirements, TagList } from '@/components/product/product-details'
import { ProductBreadcrumbs, ProductHero } from '@/components/product/product-hero'
import { ReviewList } from '@/components/product/reviews'
import type {
  BreadcrumbItem,
  DescriptionBlock,
  FeaturedOffer,
  MediaItem,
  Offer,
  ProductFeature,
  RatingAspect,
  RequirementSet,
  Review,
  SpecRow,
} from '@/components/product/types'
import type { Product as CardProduct } from '@/components/product/product-card'

/** Site-wide payment methods; not product data. */
const paymentMethods = ['Wallet', 'Visa', 'PayPal', 'Swedbank', 'SEB', 'Luminor', 'Revolut', 'Artea', 'LKU', 'Apple Pay', 'Google Pay', 'Citadele', 'Crypto']

/**
 * Everything the product page renders. Fields the API doesn't provide yet are empty / undefined,
 * and the matching section stays hidden until they're filled.
 */
type ProductView = {
  title: string
  image?: string
  badge?: string
  breadcrumbs: BreadcrumbItem[]
  features: ProductFeature[]
  offer: FeaturedOffer
  description: DescriptionBlock[]
  details: SpecRow[]
  // Not in the API yet.
  wishlistCount?: number
  worksOn?: string[]
  tags: string[]
  media: MediaItem[]
  recommendedOffers: Offer[]
  otherOffers: Offer[]
  alsoViewed: CardProduct[]
  reviewTotal?: number
  ratingAspects: RatingAspect[]
  reviews: Review[]
  rating?: number
  ratingCount?: number
  activationSteps?: string[]
  requirements: RequirementSet[]
}

/** Plain-text description → paragraphs (the API separates them with blank lines). */
function toDescription(text: string | null): DescriptionBlock[] {
  if (!text) return []
  return text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => ({ kind: 'paragraph' as const, text: p }))
}

/** Maps an API product onto what the product page components render. Nullable fields fall back to undefined / []. */
function toProductView(p: ProductDetailResource): ProductView {
  return {
    title: p.title,
    image: p.image_url || undefined,
    badge: p.cashback ? 'Cashback deal' : undefined,
    breadcrumbs: [
      { label: 'Store', href: '/store' },
      { label: p.type.label, href: '/store' },
      { label: p.title },
    ],
    features: [
      {
        icon: CircleCheckIcon,
        title: p.region.label,
        lines: [{ text: `Can be activated in ${p.region.label}` }],
      },
      {
        icon: Gamepad2Icon,
        title: p.platform.label,
        lines: [{ text: `Activate/redeem on ${p.platform.label}` }],
      },
      {
        icon: KeyRoundIcon,
        title: 'Digital key',
        lines: [
          { text: 'This is a digital edition of the product (CD-KEY)' },
          { text: 'Instant delivery', positive: true },
        ],
      },
      {
        icon: HandCoinsIcon,
        title: 'Instant refunds',
        lines: [{ text: 'Unlike other marketplaces, Eneba allows you to get an instant refund for unviewed keys.' }],
      },
    ],
    offer: {
      price: p.price.formatted,
      oldPrice: p.original_price?.formatted,
      discount: p.discount_percent > 0 ? `-${p.discount_percent}%` : undefined,
      // API gives a cashback amount, not a percentage; PriceTag renders "<value> Cashback".
      cashbackPercent: p.cashback?.formatted,
    },
    description: toDescription(p.description),
    details: [
      { label: 'Platform', value: p.platform.label },
      { label: 'Region', value: p.region.label },
      { label: 'Type', value: p.type.label },
    ],
    tags: [],
    media: [],
    recommendedOffers: [],
    otherOffers: [],
    alsoViewed: [],
    ratingAspects: [],
    reviews: [],
    requirements: [],
  }
}

/**
 * Product page for `/:slug`. Desktop: content column + 350px buy box; phone: buy box after the hero.
 * Sections render only when their data exists, so unsupported ones stay hidden but wired.
 */
export function Product() {
  const { slug = '' } = useParams()
  const { data, error } = useQuery({
    ...v1ProductsShowOptions({ path: { product: slug } }),
    // Same key as the generated options, but keep the HTTP status so a 404 can show the not-found page.
    queryFn: async ({ signal }) => {
      const { data, error, response } = await v1ProductsShow({ path: { product: slug }, signal })
      if (response?.status === 404) throw new NotFoundError(`No product "${slug}"`)
      if (error || !data) throw error ?? new Error('Empty response')
      return data
    },
    retry: (count, err) => !(err instanceof NotFoundError) && count < 1,
    enabled: slug !== '',
  })

  if (error instanceof NotFoundError) return <NotFound />
  if (!data) return <main className="page-container page-main" aria-busy="true" />

  const product = toProductView(data.data)

  return (
    <main className="flex page-container page-main flex-col gap-6 pb-block-lg">
      <ProductBreadcrumbs items={product.breadcrumbs} />

      <div className="grid gap-x-8 gap-y-10 lg:grid-cols-[1fr_var(--spacing-buy-box)]">
        <ProductHero
          title={product.title}
          image={product.image}
          badge={product.badge}
          wishlistCount={product.wishlistCount}
          features={product.features}
          worksOn={product.worksOn}
          className="lg:col-start-1"
        />

        <aside className="flex flex-col gap-2 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <FeaturedOfferPanel offer={product.offer} />
          <CheckoutTrustPanel paymentMethods={paymentMethods} trustScore="100/100" />
          <DealsSignup />
        </aside>

        <div className="flex min-w-0 flex-col gap-12 lg:col-start-1">
          {product.media.length > 0 && <MediaStrip items={product.media} />}
          {product.recommendedOffers.length > 0 && (
            <OfferList title="Recommended offers" offers={product.recommendedOffers} />
          )}
          {product.otherOffers.length > 0 && (
            <OfferList id="offers" title="other offers" highlightCount offers={product.otherOffers} initialCount={3} />
          )}

          {product.alsoViewed.length > 0 && (
            <DetailSection title="Gamers also viewed">
              <AlsoViewed products={product.alsoViewed} initialCount={3} />
            </DetailSection>
          )}

          {product.reviews.length > 0 && (
            <ReviewList
              total={product.reviewTotal ?? product.reviews.length}
              aspects={product.ratingAspects}
              reviews={product.reviews}
            />
          )}

          {product.description.length > 0 && (
            <DetailSection title="Product Details">
              {product.tags.length > 0 && <TagList tags={product.tags} />}
              <DescriptionTabs
                title={product.title}
                rating={product.rating}
                ratingCount={product.ratingCount}
                description={product.description}
                activationSteps={product.activationSteps}
              />
            </DetailSection>
          )}

          {product.requirements.length > 0 && (
            <DetailSection id="system-requirements" title="System requirements">
              <SystemRequirements sets={product.requirements} />
            </DetailSection>
          )}

          <DetailSection title="Other details">
            <SpecList rows={product.details} className="bg-surface-deep p-5" />
          </DetailSection>
        </div>
      </div>
    </main>
  )
}
