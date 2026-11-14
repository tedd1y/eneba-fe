import { cn } from "@/lib/utils"

/** Hero banner mosaic: one large promo + three tall side promos (side promos hidden on phone). */
function HeroGallery({
  main,
  side,
}: {
  main: React.ReactNode
  side: React.ReactNode[]
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_repeat(3,1fr)]">
      <div className="aspect-[2/1] md:aspect-auto md:min-h-72">{main}</div>
      {side.map((node, i) => (
        <div key={i} className="hidden aspect-[3/5] md:block">
          {node}
        </div>
      ))}
    </div>
  )
}

/** A single promo tile for the hero mosaic. `tone` takes token classes (e.g. bg-surface-tile). */
function PromoBanner({
  title,
  tone,
  children,
  className,
}: {
  title: string
  tone?: string
  children?: React.ReactNode
  className?: string
}) {
  return (
    <a
      href="#"
      className={cn(
        "flex size-full flex-col items-center justify-center gap-4 p-6 focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none",
        tone,
        className,
      )}
    >
      <p className="text-center type-display">{title}</p>
      {children}
    </a>
  )
}

export { HeroGallery, PromoBanner }
