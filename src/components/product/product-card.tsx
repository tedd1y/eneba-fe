import { HeartIcon, InfoIcon, ShoppingCartIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type Product = {
  title: string
  platform: string
  region: string
  regionTone?: "eu" | "alt"
  price: string
  oldPrice?: string
  discount?: string
  cashback?: string
  /** Token-based classes for the cover placeholder (until real art is wired in). */
  cover: string
}

function Cover({
  product,
  showCashback = true,
  className,
}: {
  product: Product
  showCashback?: boolean
  className?: string
}) {
  return (
    <div className={cn("relative overflow-hidden", product.cover, className)}>
      {showCashback && product.cashback && (
        <Badge variant="cashback" className="absolute bottom-8 left-0">
          Cashback
        </Badge>
      )}
      <Badge variant="platform" className="absolute inset-x-0 bottom-0 h-8 w-full">
        {product.platform}
      </Badge>
    </div>
  )
}

function Region({ product }: { product: Product }) {
  return (
    <CardDescription
      className={cn(
        "uppercase",
        product.regionTone === "alt" ? "text-region-alt" : "text-region-eu",
      )}
    >
      {product.region}
    </CardDescription>
  )
}

function PriceBlock({ product }: { product: Product }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="type-label text-muted-foreground">
        From
        {product.oldPrice && (
          <>
            {" "}
            <s>{product.oldPrice}</s> <span className="text-discount">{product.discount}</span>
          </>
        )}
      </p>
      <p className="flex items-center gap-1.5 type-price">
        {product.price}
        <InfoIcon className="size-4 text-muted-foreground" aria-hidden />
      </p>
      {product.cashback && (
        <p className="type-label text-cashback">Cashback: {product.cashback}</p>
      )}
    </div>
  )
}

/** Vertical card used in desktop/tablet rails. */
function ProductCard({ product, className }: { product: Product; className?: string }) {
  return (
    <Card className={cn("h-full gap-2 pt-0", className)}>
      <Cover product={product} className="aspect-[3/4]" />
      <CardHeader className="pt-2">
        <CardTitle className="line-clamp-2">{product.title}</CardTitle>
        <Region product={product} />
      </CardHeader>
      <CardFooter className="mt-auto pt-0">
        <PriceBlock product={product} />
      </CardFooter>
    </Card>
  )
}

/** Horizontal list card used on phones. */
function ProductCardRow({ product, className }: { product: Product; className?: string }) {
  return (
    <Card className={cn("flex-row gap-0 p-4", className)}>
      <Cover product={product} showCashback={false} className="aspect-square w-24 shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <CardHeader className="pr-0">
          <CardTitle className="line-clamp-2">{product.title}</CardTitle>
          <Region product={product} />
          <CardAction>
            <Button variant="ghost" size="icon-sm" aria-label="Add to wishlist">
              <HeartIcon />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="mt-auto flex items-end justify-between gap-2 pr-0">
          <PriceBlock product={product} />
          <Button variant="secondary" size="icon-lg" aria-label="Add to cart">
            <ShoppingCartIcon />
          </Button>
        </CardContent>
      </div>
    </Card>
  )
}

export { ProductCard, ProductCardRow }
