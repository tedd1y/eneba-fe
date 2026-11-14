import { cn } from "@/lib/utils"

/** Brand / eGift card tile ("Best selling eGift Cards"). */
function BrandTile({ name, className }: { name: string; className?: string }) {
  return (
    <a
      href="#"
      className={cn(
        "flex aspect-[3/4] items-center justify-center bg-card type-h1 transition-transform hover:-translate-y-1 focus-visible:ring-3 focus-visible:ring-ring",
        className,
      )}
    >
      {name}
    </a>
  )
}

export { BrandTile }
