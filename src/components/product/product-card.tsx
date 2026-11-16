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
import { useState } from "react"
import { Link } from "react-router"

export type Product = {
  title: string
  platform: string
  region: string
  regionTone?: "eu" | "alt"
  price: string
  oldPrice?: string
  discount?: string
  cashback?: string
  /** Box art URL (API `image_url`); the `cover` placeholder shows when it's missing or fails to load. */
  image?: string
  /** Token-based classes for the cover placeholder. */
  cover: string
}

/** Cashback tag + platform strip that sit on the bottom edge of the cover. */
function CoverBadges({
  product,
  showCashback = true,
  className,
}: {
  product: Product
  showCashback?: boolean
  className?: string
}) {
  return (
    <div className={cn("pointer-events-none flex flex-col items-start", className)}>
      {showCashback && product.cashback && <Badge variant="cashback">Cashback</Badge>}
      <Badge variant="platform" className="h-8 w-full">
        {product.platform}
      </Badge>
    </div>
  )
}

function Cover({
  product,
  showBadges = true,
  showCashback = true,
  className,
}: {
  product: Product
  showBadges?: boolean
  showCashback?: boolean
  className?: string
}) {
  // Remember which URL failed, so a new image (same card reused for another product) gets its own try.
  const [failedImage, setFailedImage] = useState<string>()
  const showImage = product.image && failedImage !== product.image

  return (
    <div className={cn("relative overflow-hidden", product.cover, className)}>
      {showImage && (
        <img
          src={product.image}
          alt=""
          loading="lazy"
          onError={() => setFailedImage(product.image)}
          className="absolute inset-0 size-full object-cover"
        />
      )}
      {showBadges && (
        <CoverBadges product={product} showCashback={showCashback} className="absolute inset-x-0 bottom-0" />
      )}
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

/**
 * Invisible link stretched over the whole card, so a click anywhere opens the product page.
 * Card content above it is pointer-events-none; buttons opt back in with pointer-events-auto.
 */
function CardLink({ to, label }: { to: string; label: string }) {
  return <Link to={to} aria-label={label} className="absolute inset-0 z-0" />
}

/**
 * Vertical card used in desktop/tablet rails. The whole card links to `offersHref`.
 * On hover (or when a link/button inside has focus) the lower part slides up over the cover
 * and reveals "Add to cart" / "View offers". Labels and handlers come in as props.
 */
function ProductCard({
  product,
  className,
  addToCartLabel = "Add to cart",
  viewOffersLabel = "View offers",
  onAddToCart,
  offersHref = "#",
}: {
  product: Product
  className?: string
  addToCartLabel?: string
  viewOffersLabel?: string
  onAddToCart?: (product: Product) => void
  offersHref?: string
}) {
  return (
    <Card className={cn("relative h-full gap-0 py-0", className)}>
      <CardLink to={offersHref} label={product.title} />
      <Cover product={product} showBadges={false} className="pointer-events-none aspect-[3/4]" />
      <div className="pointer-events-none relative flex flex-1 flex-col gap-2 bg-card pt-2 pb-4 transition-transform duration-300 ease-out group-hover/card:-translate-y-card-actions group-focus-within/card:-translate-y-card-actions motion-reduce:transition-none">
        {/* Badges ride on top of the sliding panel so they stay visible on hover. */}
        <CoverBadges product={product} className="absolute inset-x-0 bottom-full" />
        <CardHeader>
          <CardTitle className="line-clamp-2">{product.title}</CardTitle>
          <Region product={product} />
        </CardHeader>
        <CardFooter className="mt-auto">
          <PriceBlock product={product} />
        </CardFooter>
        <div className="pointer-events-auto absolute inset-x-0 top-full flex h-card-actions flex-col gap-2 bg-card px-(--card-spacing)">
          <Button variant="buy" className="w-full" onClick={() => onAddToCart?.(product)}>
            {addToCartLabel}
          </Button>
          <Button variant="secondary" className="w-full" nativeButton={false} render={<Link to={offersHref} />}>
            {viewOffersLabel}
          </Button>
        </div>
      </div>
    </Card>
  )
}

/** Horizontal list card used on phones, fixed at 171px tall so every row matches. The whole card links to `offersHref`. */
function ProductCardRow({
  product,
  className,
  offersHref = "#",
  onAddToCart,
}: {
  product: Product
  className?: string
  offersHref?: string
  onAddToCart?: (product: Product) => void
}) {
  return (
    <Card className={cn("relative h-card-row flex-row gap-0 overflow-hidden p-4", className)}>
      <CardLink to={offersHref} label={product.title} />
      <Cover product={product} showCashback={false} className="pointer-events-none aspect-square w-24 shrink-0" />
      <div className="pointer-events-none relative flex min-w-0 flex-1 flex-col gap-3">
        <CardHeader className="pr-0">
          <CardTitle className="line-clamp-2">{product.title}</CardTitle>
          <Region product={product} />
          <CardAction>
            <Button variant="ghost" size="icon-sm" aria-label="Add to wishlist" className="pointer-events-auto">
              <HeartIcon />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="mt-auto flex items-end justify-between gap-2 pr-0">
          <PriceBlock product={product} />
          <Button variant="secondary" size="icon-lg" aria-label="Add to cart" className="pointer-events-auto" onClick={() => onAddToCart?.(product)}>
            <ShoppingCartIcon />
          </Button>
        </CardContent>
      </div>
    </Card>
  )
}

export { ProductCard, ProductCardRow }
