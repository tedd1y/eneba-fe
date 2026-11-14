import type { Product } from "@/components/product/product-card"

/** Sample catalogue for the styleguide. Covers are token gradients until real art exists. */
export const products: Product[] = [
  {
    title: "Grand Theft Auto VI: Ultimate Edition (Xbox Series X|S) XBOX LIVE Key EUROPE",
    platform: "Xbox Live",
    region: "Europe",
    price: "€82.44",
    cashback: "€9.07",
    cover: "bg-linear-to-br from-region-alt to-primary",
  },
  {
    title: "Grand Theft Auto VI (PS5) PSN Key EUROPE",
    platform: "PSN",
    region: "Europe",
    regionTone: "alt",
    price: "€70.00",
    cashback: "€7.70",
    cover: "bg-linear-to-b from-highlight to-surface-tile",
  },
  {
    title: "PlayStation Network Card 100 GBP (UK) PSN Key UNITED KINGDOM",
    platform: "PSN",
    region: "United Kingdom",
    regionTone: "alt",
    price: "€114.55",
    oldPrice: "€115.00",
    cashback: "€5.73",
    cover: "bg-linear-to-b from-foreground to-primary",
  },
  {
    title: "Minecraft: Java & Bedrock Edition (PC) Official website Key GLOBAL",
    platform: "Windows Store",
    region: "Global",
    price: "€15.48",
    oldPrice: "€29.99",
    discount: "-48%",
    cashback: "€1.70",
    cover: "bg-linear-to-br from-cashback to-surface-deep",
  },
  {
    title: "over the hill Steam Key (PC) EUROPE",
    platform: "Steam",
    region: "Europe",
    price: "€12.16",
    oldPrice: "€24.99",
    discount: "-51%",
    cashback: "€1.34",
    cover: "bg-linear-to-b from-chart-5 to-region-alt",
  },
  {
    title: "Probably Stolen - Cyberpunk Shopkeeper Simulator (PC) Steam Key GLOBAL",
    platform: "Steam",
    region: "Global",
    price: "€8.60",
    cover: "bg-linear-to-tr from-surface-footer to-highlight",
  },
]
