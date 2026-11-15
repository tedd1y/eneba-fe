import { useState } from 'react'

import { AlsoViewed } from '@/showcase/product/also-viewed'
import { CheckoutTrustPanel, DealsSignup, FeaturedOfferPanel } from '@/showcase/product/buy-box'
import { MediaStrip } from '@/showcase/product/media-strip'
import { OfferList, OfferRow } from '@/showcase/product/offer-list'
import { PriceTag } from '@/showcase/product/price-tag'
import { DescriptionTabs, DetailSection, SpecList, SystemRequirements, TagList } from '@/showcase/product/product-details'
import { ProductBreadcrumbs, ProductHero } from '@/showcase/product/product-hero'
import { ReviewItem, ReviewList } from '@/showcase/product/reviews'
import { StarRating } from '@/showcase/product/star-rating'
import {
  activationSteps,
  alsoViewed,
  breadcrumbs,
  description,
  featuredOffer,
  features,
  media,
  otherDetails,
  otherOffers,
  paymentMethods,
  product,
  ratingAspects,
  recommendedOffers,
  requirements,
  reviews,
} from '@/showcase/product-data'
import { Section, Specimen } from '@/showcase/section'

/**
 * The whole product page assembled from the pieces below, fed by product-data.ts.
 * Desktop: content column + 350px buy box. Phone: buy box drops in right after the hero.
 */
function ProductPageDemo() {
  const [lastAction, setLastAction] = useState('Nothing yet: try a button')

  return (
    <div className="flex flex-col gap-6">
      <p className="type-caption text-muted-foreground" aria-live="polite">
        Last action:
        {' '}
        <span className="text-attention">{lastAction}</span>
      </p>
      <ProductBreadcrumbs items={breadcrumbs} />

      <div className="grid gap-x-8 gap-y-10 lg:grid-cols-[1fr_var(--spacing-buy-box)]">
        <ProductHero
          title={product.title}
          cover={product.cover}
          badge={product.badge}
          wishlistCount={product.wishlistCount}
          features={features}
          worksOn={product.worksOn}
          className="lg:col-start-1"
        />

        <aside className="flex flex-col gap-2 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <FeaturedOfferPanel
            offer={featuredOffer}
            onBuy={() => setLastAction('Buy now: featured offer')}
            onExpress={() => setLastAction('Express checkout')}
            onAddToCart={() => setLastAction('Added featured offer to cart')}
          />
          <CheckoutTrustPanel paymentMethods={paymentMethods} trustScore="100/100" />
          <DealsSignup onSubscribe={() => setLastAction('Subscribe')} />
        </aside>

        <div className="flex min-w-0 flex-col gap-12 lg:col-start-1">
          <MediaStrip items={media} onSelect={item => setLastAction(`Opened ${item.alt}`)} />
          <OfferList title="Recommended offers" offers={recommendedOffers} onBuy={o => setLastAction(`Buy now: ${o.seller.name} ${o.price}`)} />
          <OfferList
            id="offers"
            title="other offers"
            highlightCount
            offers={otherOffers}
            initialCount={3}
            onBuy={o => setLastAction(`Buy now: ${o.seller.name} ${o.price}`)}
          />

          <DetailSection title="Gamers also viewed">
            <AlsoViewed products={alsoViewed} initialCount={3} onAddToCart={x => setLastAction(`Added ${x.title} to cart`)} />
          </DetailSection>

          <ReviewList
            total={product.reviewCount}
            aspects={ratingAspects}
            reviews={reviews}
            onReview={() => setLastAction('Review now')}
          />

          <DetailSection title="Product Details">
            <TagList tags={product.tags} />
            <DescriptionTabs
              title={product.shortTitle}
              rating={product.rating}
              ratingCount={product.ratingCount}
              description={description}
              activationSteps={activationSteps}
            />
          </DetailSection>

          <DetailSection id="system-requirements" title="System requirements">
            <SystemRequirements sets={requirements} />
          </DetailSection>

          <DetailSection title="Other details">
            <SpecList rows={otherDetails} className="bg-surface-deep p-5" />
          </DetailSection>
        </div>
      </div>
    </div>
  )
}

export function ProductPage() {
  return (
    <Section
      id="product"
      title="Product page"
      description="Pieces sampled from design/brand/product, then assembled with dummy data. Offer lists, reviews and description reveal more on click; votes, wishlist and translate toggle locally."
    >
      <ProductPageDemo />

      <div className="grid gap-12 lg:grid-cols-2">
        <Specimen title="Star rating: whole and fractional">
          <div className="flex flex-col gap-3">
            {[5, 4, 4.57, 2.5, 0].map(v => (
              <p key={v} className="flex items-center gap-3 type-body">
                <StarRating value={v} />
                <StarRating value={v} size="md" />
                <span className="text-muted-foreground">{v}</span>
              </p>
            ))}
          </div>
        </Specimen>

        <Specimen title="Price tag: plain, discounted, best cashback">
          <div className="flex flex-wrap items-start gap-10 bg-surface-deep p-5">
            <PriceTag price="€55.89" cashbackPercent="11%" />
            <PriceTag price="€29.99" oldPrice="€32.99" discount="-9%" cashbackPercent="11%" />
            <PriceTag price="€31.49" oldPrice="€32.99" discount="-5%" cashbackPercent="14%" bestCashback />
          </div>
        </Specimen>

        <Specimen title="Offer row: Eneba-verified vs rated seller">
          <ul className="flex flex-col gap-2">
            <OfferRow offer={recommendedOffers[0]} />
            <OfferRow offer={otherOffers[1]} />
          </ul>
        </Specimen>

        <Specimen title="Review: short, translated, long (Read more)">
          <div className="flex flex-col gap-0.5">
            <ReviewItem review={reviews[0]} />
            <ReviewItem review={reviews[2]} />
          </div>
        </Specimen>
      </div>
    </Section>
  )
}
