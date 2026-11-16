import {
  ChessKnightIcon,
  CogIcon,
  CompassIcon,
  CreditCardIcon,
  CrosshairIcon,
  DollarSignIcon,
  FlagIcon,
  Gamepad2Icon,
  GhostIcon,
  GiftIcon,
  GlobeIcon,
  type LucideIcon,
  MonitorIcon,
  ScrollIcon,
  SmartphoneIcon,
  SwordIcon,
  TentIcon,
  TrophyIcon,
  TvIcon,
  UsersIcon,
  VolleyballIcon,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import type { FilterOptionResource, HomeGalleryResource } from '@/client'
import { v1HomeGalleriesIndexOptions, v1ProductsFiltersIndexOptions, v1ProductsIndexOptions } from '@/client/@tanstack/react-query.gen'

import { Block, type BlockTone } from '@/components/layout/block'
import { BrandTile } from '@/components/product/brand-tile'
import { CategoryTile } from '@/components/product/category-tile'
import { HeroGallery, PromoBanner } from '@/components/product/hero-gallery'
import { ProductCard } from '@/components/product/product-card'
import { ProductRail } from '@/components/product/product-rail'
import { QuickLinkStrip, type QuickLinkItem } from '@/components/product/quick-link'
import { Button } from '@/components/ui/button'
import { toCardProps } from '@/lib/product-card'
import { serializeStoreParams, storeHrefToProductsQuery } from '@/lib/store-params'
import { useCartStore } from '@/stores/cart'

const quickLinks: QuickLinkItem[] = [
  { icon: Gamepad2Icon, label: 'Games' },
  { icon: CreditCardIcon, label: 'Gaming eCards' },
  { icon: GiftIcon, label: 'eGift Cards' },
  { icon: DollarSignIcon, label: 'E-money' },
  { icon: MonitorIcon, label: 'Steam' },
  { icon: TvIcon, label: 'PSN' },
  { icon: TrophyIcon, label: 'FIFA' },
  { icon: SmartphoneIcon, label: 'Mobile' },
]

const brands = ['Razer Gold', 'iTunes', 'Amazon', 'Google Play', 'Netflix', 'Spotify']

/**
 * Genre from /v1/products/filters. The API also sends `icon`,
 * which its OpenAPI spec doesn't document yet, so it's typed here.
 */
type Genre = FilterOptionResource & { icon?: string | null }

/** API icon name → Lucide icon. Unknown names and `null` fall back to the gamepad. */
const genreIcons: Record<string, LucideIcon> = {
  sword: SwordIcon,
  compass: CompassIcon,
  scroll: ScrollIcon,
  crosshair: CrosshairIcon,
  chess: ChessKnightIcon,
  gear: CogIcon,
  ball: VolleyballIcon,
  flag: FlagIcon,
  globe: GlobeIcon,
  tent: TentIcon,
  ghost: GhostIcon,
  users: UsersIcon,
}
const DEFAULT_GENRE_ICON = Gamepad2Icon

/** Genres shown before "Load more": one row on desktop. */
const COLLAPSED_GENRES = 7

/**
 * "Categories": every genre, most products first. One row shows until "Load more" reveals the rest.
 * Each tile opens the store filtered by that genre.
 */
function CategoriesBlock({ tone }: { tone: BlockTone }) {
  const [showAll, setShowAll] = useState(false)
  const { data } = useQuery(v1ProductsFiltersIndexOptions())
  const genres: Genre[] = (data?.data.genres ?? []).toSorted((a, b) => b.count - a.count)
  if (genres.length === 0) return null

  const shown = showAll ? genres : genres.slice(0, COLLAPSED_GENRES)
  const hasMore = shown.length < genres.length

  return (
    <Block tone={tone} title="Categories" action={hasMore ? 'Load more' : undefined} onAction={() => setShowAll(true)}>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
        {shown.map(genre => (
          <CategoryTile
            key={genre.value}
            icon={(genre.icon && genreIcons[genre.icon]) || DEFAULT_GENRE_ICON}
            label={genre.label}
            count={genre.count}
            href={`/store/all${serializeStoreParams({ genres: [genre.value] })}`}
          />
        ))}
      </div>
    </Block>
  )
}

/**
 * One product rail from /v1/home/galleries: the first `limit` products of the gallery's store link,
 * with "See all" opening that link. Hidden until its products load, and when it has none.
 */
function GalleryRail({ gallery, tone }: { gallery: HomeGalleryResource, tone: BlockTone }) {
  const addToCart = useCartStore(s => s.add)
  const { data } = useQuery(v1ProductsIndexOptions({ query: storeHrefToProductsQuery(gallery.href, gallery.limit) }))
  const products = data?.data ?? []
  if (products.length === 0) return null

  return (
    <Block tone={tone} title={gallery.label} info action="See all" actionHref={gallery.href}>
      <ProductRail>
        {products.map(p => (
          <ProductCard key={p.id} product={toCardProps(p)} offersHref={`/${p.slug}`} onAddToCart={() => addToCart(p.id)} />
        ))}
      </ProductRail>
    </Block>
  )
}

/** Blocks alternate between the page background and the darker band. */
const toneAt = (index: number): BlockTone => (index % 2 === 0 ? 'page' : 'band')

export function Home() {
  const { data: galleries } = useQuery(v1HomeGalleriesIndexOptions())
  const rails = galleries?.data ?? []

  return (
    <div>
      <main>
        <HeroGallery
          main={(
            <PromoBanner title="It's happening!" tone="bg-linear-to-r from-primary to-region-alt">
              <Button nativeButton={false} render={<span />}>
                Shop cards
              </Button>
            </PromoBanner>
          )}
          side={[
            <PromoBanner key="a" title="Games -90% off!" tone="bg-surface-tile" />,
            <PromoBanner key="b" title="Defy death" tone="bg-surface-footer" />,
            <PromoBanner key="c" title="Cheaper software" tone="bg-highlight text-highlight-foreground" />,
          ]}
        />

        {/* Full width, no Block; keeps the Block's top spacing below the hero. */}
        <QuickLinkStrip items={quickLinks} className="pt-block nav:pt-block-lg" />

        {rails.map((gallery, i) => <GalleryRail key={gallery.id} gallery={gallery} tone={toneAt(i)} />)}

        <Block tone={toneAt(rails.length)} title="Best selling eGift Cards" info action="Show all">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {brands.map(name => (
              <BrandTile key={name} name={name} />
            ))}
          </div>
        </Block>

        <CategoriesBlock tone={toneAt(rails.length + 1)} />
      </main>
    </div>
  )
}
