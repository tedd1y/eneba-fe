import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CreditCardIcon,
  DollarSignIcon,
  Gamepad2Icon,
  GiftIcon,
  MonitorIcon,
  SmartphoneIcon,
  TrophyIcon,
  TvIcon,
} from "lucide-react"

import { HeroGallery, PromoBanner } from "@/components/product/hero-gallery"
import { ProductCard } from "@/components/product/product-card"
import { ProductRail } from "@/components/product/product-rail"
import { QuickLink } from "@/components/product/quick-link"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { products } from "@/showcase/data"
import { Block, Section } from "@/showcase/section"

const quickLinks = [
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
      description="Hero mosaic, the quick-category strip and the swipeable product rail with its centered “See all”."
      className="bg-surface-deep"
    >
      <Block title="Hero mosaic">
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
      </Block>

      <Block title="Quick-category strip">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" aria-label="Scroll left">
            <ChevronLeftIcon />
          </Button>
          <ScrollArea className="min-w-0 flex-1">
            <div className="flex justify-between gap-2 pb-3">
              {quickLinks.map((link) => (
                <QuickLink key={link.label} {...link} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <Button variant="ghost" size="icon-sm" aria-label="Scroll right">
            <ChevronRightIcon />
          </Button>
        </div>
      </Block>

      <Block title="Product rail">
        <ProductRail title="Recommended for you">
          {products.map((product) => (
            <ProductCard key={product.title} product={product} />
          ))}
        </ProductRail>
      </Block>
    </Section>
  )
}
