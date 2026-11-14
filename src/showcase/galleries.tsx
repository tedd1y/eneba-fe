import {
  CreditCardIcon,
  DollarSignIcon,
  Gamepad2Icon,
  GiftIcon,
  MonitorIcon,
  SmartphoneIcon,
  TrophyIcon,
  TvIcon,
} from "lucide-react"

import { Block } from "@/components/layout/block"
import { HeroGallery, PromoBanner } from "@/components/product/hero-gallery"
import { ProductCard } from "@/components/product/product-card"
import { ProductRail } from "@/components/product/product-rail"
import { QuickLinkStrip, type QuickLinkItem } from "@/components/product/quick-link"
import { Button } from "@/components/ui/button"
import { products } from "@/showcase/data"
import { Section, Specimen } from "@/showcase/section"

const quickLinks: QuickLinkItem[] = [
  { icon: Gamepad2Icon, label: "Games" },
  { icon: CreditCardIcon, label: "Gaming eCards" },
  { icon: GiftIcon, label: "eGift Cards" },
  { icon: DollarSignIcon, label: "E-money" },
  { icon: MonitorIcon, label: "Steam" },
  { icon: TvIcon, label: "PSN" },
  { icon: TrophyIcon, label: "FIFA" },
  { icon: SmartphoneIcon, label: "Mobile" },
]

export function Galleries() {
  return (
    <Section
      id="galleries"
      title="Galleries"
      description="Hero mosaic, the quick-category strip and and Block — the full-width section that sets the band color (page / band) and owns the title, ⓘ and centered action, so rails and tile grids inside stay title-less."
    >
      <Specimen title="Hero mosaic">
        <HeroGallery
          main={
            <PromoBanner title="It's happening!" tone="bg-linear-to-r from-primary to-region-alt">
              <Button nativeButton={false} render={<span />}>
                Shop cards
              </Button>
            </PromoBanner>
          }
          side={[
            <PromoBanner key="a" title="Games -90% off!" tone="bg-surface-tile" />,
            <PromoBanner key="b" title="Defy death" tone="bg-surface-footer" />,
            <PromoBanner key="c" title="Cheaper software" tone="bg-highlight text-highlight-foreground" />,
          ]}
        />
      </Specimen>

      <Specimen title="Quick-category strip">
        <QuickLinkStrip items={quickLinks} />
      </Specimen>

      <Specimen title="Block · page tone, with title, info and action">
        <div className="border border-border">
          <Block title="Recommended for you" info action="See all">
            <ProductRail>
              {products.map((product) => (
                <ProductCard key={product.title} product={product} />
              ))}
            </ProductRail>
          </Block>
        </div>
      </Specimen>

      <Specimen title="Block · band tone">
        <div className="border border-border">
          <Block tone="band" title="Top games" info action="Show all">
            <ProductRail>
              {products.map((product) => (
                <ProductCard key={product.title} product={product} />
              ))}
            </ProductRail>
          </Block>
        </div>
      </Specimen>
    </Section>
  )
}
