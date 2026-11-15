import {
  CompassIcon,
  CreditCardIcon,
  CrosshairIcon,
  DollarSignIcon,
  Gamepad2Icon,
  GhostIcon,
  GiftIcon,
  MonitorIcon,
  SmartphoneIcon,
  SwordsIcon,
  TrophyIcon,
  TvIcon,
  WandSparklesIcon,
  ZapIcon,
} from 'lucide-react'

import { Block } from '@/components/layout/block'
import { BrandTile } from '@/components/product/brand-tile'
import { CategoryTile } from '@/components/product/category-tile'
import { HeroGallery, PromoBanner } from '@/components/product/hero-gallery'
import { ProductCard } from '@/components/product/product-card'
import { ProductRail } from '@/components/product/product-rail'
import { QuickLinkStrip, type QuickLinkItem } from '@/components/product/quick-link'
import { Button } from '@/components/ui/button'
import { products } from '@/showcase/data'

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

const categories = [
  { icon: ZapIcon, label: 'Action', count: 20699 },
  { icon: CompassIcon, label: 'Adventure', count: 19950 },
  { icon: Gamepad2Icon, label: 'Simulation', count: 15649 },
  { icon: SwordsIcon, label: 'Strategy', count: 14912 },
  { icon: WandSparklesIcon, label: 'RPG', count: 5605 },
  { icon: GhostIcon, label: 'Indie', count: 5397 },
  { icon: CrosshairIcon, label: 'FPS / TPS', count: 2820 },
]

export function Home() {
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

        <Block title="Recommended for you" info action="See all">
          <ProductRail>
            {products.map(product => (
              <ProductCard key={product.title} product={product} />
            ))}
          </ProductRail>
        </Block>

        <Block tone="band" title="Top games" info action="Show all">
          <ProductRail>
            {products.map(product => (
              <ProductCard key={product.title} product={product} />
            ))}
          </ProductRail>
        </Block>

        <Block title="Best selling eGift Cards" info action="Show all">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {brands.map(name => (
              <BrandTile key={name} name={name} />
            ))}
          </div>
        </Block>

        <Block tone="band" title="Categories" action="Load more">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
            {categories.map(category => (
              <CategoryTile key={category.label} {...category} />
            ))}
          </div>
        </Block>
      </main>
    </div>
  )
}
