import { Header } from '@/components/layout/header'
import { HeroGallery, PromoBanner } from '@/components/product/hero-gallery.tsx'
import { Button } from '@/components/ui/button.tsx'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
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
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area.tsx'
import { QuickLink } from '@/components/product/quick-link.tsx'
import { Block } from '@/showcase/section.tsx'
import { ProductRail } from '@/components/product/product-rail.tsx'
import { products } from '@/showcase/data.ts'
import { ProductCard } from '@/components/product/product-card.tsx'
import { CategoryTile } from '@/components/product/category-tile.tsx'
import { BrandTile } from '@/components/product/brand-tile.tsx'

const quickLinks = [
  { icon: Gamepad2Icon, label: 'Games' },
  { icon: CreditCardIcon, label: 'Gaming eCards' },
  { icon: GiftIcon, label: 'eGift Cards' },
  { icon: DollarSignIcon, label: 'E-money' },
  { icon: MonitorIcon, label: 'Steam' },
  { icon: TvIcon, label: 'PSN' },
  { icon: TrophyIcon, label: 'FIFA' },
  { icon: SmartphoneIcon, label: 'Mobile' },
]

const categories = [
  { icon: ZapIcon, label: 'Action', count: 20699 },
  { icon: CompassIcon, label: 'Adventure', count: 19950 },
  { icon: Gamepad2Icon, label: 'Simulation', count: 15649 },
  { icon: SwordsIcon, label: 'Strategy', count: 14912 },
  { icon: WandSparklesIcon, label: 'RPG', count: 5605 },
  { icon: GhostIcon, label: 'Indie', count: 5397 },
  { icon: CrosshairIcon, label: 'FPS / TPS', count: 2820 },
]

export function HomePage() {
  return (
    <div>
      <Header />
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
        <div className="page-container page-main">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon-sm" aria-label="Scroll left">
              <ChevronLeftIcon />
            </Button>
            <ScrollArea className="min-w-0 flex-1">
              <div className="flex justify-between gap-2 pb-3">
                {quickLinks.map(link => (
                  <QuickLink key={link.label} {...link} />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <Button variant="ghost" size="icon-sm" aria-label="Scroll right">
              <ChevronRightIcon />
            </Button>
          </div>

          <Block title="Product rail">
            <ProductRail title="Recommended for you">
              {products.map(product => (
                <ProductCard key={product.title} product={product} />
              ))}
            </ProductRail>
          </Block>

          <Block title="Product rail">
            <ProductRail title="Top games">
              {products.map(product => (
                <ProductCard key={product.title} product={product} />
              ))}
            </ProductRail>
          </Block>

          <Block title="eGift brand tile">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
              {['Razer Gold', 'iTunes', 'Amazon', 'Google Play', 'Netflix', 'Spotify'].map(name => (
                <BrandTile key={name} name={name} />
              ))}
            </div>
          </Block>

          <Block title="Category tile">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
              {categories.map(category => (
                <CategoryTile key={category.label} {...category} />
              ))}
            </div>
          </Block>
        </div>
      </main>
    </div>
  )
}
