import {
  CompassIcon,
  CrosshairIcon,
  Gamepad2Icon,
  GhostIcon,
  SwordsIcon,
  WandSparklesIcon,
  ZapIcon,
} from "lucide-react"

import { BrandTile } from "@/components/product/brand-tile"
import { CategoryTile } from "@/components/product/category-tile"
import { ProductCard, ProductCardRow } from "@/components/product/product-card"
import { products } from "@/showcase/data"
import { Block, Section } from "@/showcase/section"

const categories = [
  { icon: ZapIcon, label: "Action", count: 20699 },
  { icon: CompassIcon, label: "Adventure", count: 19950 },
  { icon: Gamepad2Icon, label: "Simulation", count: 15649 },
  { icon: SwordsIcon, label: "Strategy", count: 14912 },
  { icon: WandSparklesIcon, label: "RPG", count: 5605 },
  { icon: GhostIcon, label: "Indie", count: 5397 },
  { icon: CrosshairIcon, label: "FPS / TPS", count: 2820 },
]

export function Cards() {
  return (
    <Section
      id="cards"
      title="Cards"
      description="Product cards carry a mint outline on the deep card surface. Price is the loudest element; cashback is always lime."
    >
      <Block title="Product card · vertical (desktop, tablet)">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {products.slice(0, 5).map((product) => (
            <ProductCard key={product.title} product={product} />
          ))}
        </div>
      </Block>

      <Block title="Product card · row (phone)">
        <div className="grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
          {products.slice(2, 6).map((product) => (
            <ProductCardRow key={product.title} product={product} />
          ))}
        </div>
      </Block>

      <Block title="Category tile">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {categories.map((category) => (
            <CategoryTile key={category.label} {...category} />
          ))}
        </div>
      </Block>

      <Block title="eGift brand tile">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {["Razer Gold", "iTunes", "Amazon", "Google Play", "Netflix", "Spotify"].map((name) => (
            <BrandTile key={name} name={name} />
          ))}
        </div>
      </Block>
    </Section>
  )
}
