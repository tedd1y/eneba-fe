import { cn } from "@/lib/utils"

/**
 * Hero banner row, 380px tall. Desktop: the main promo takes 2/3 of the width and the three side
 * promos share the rest. Tablet and phone: all four get the same width (1/4 each).
 */
function HeroGallery({
  main,
  side,
}: {
  main: React.ReactNode
  side: React.ReactNode[]
}) {
  return (
    <div className="grid h-hero grid-cols-4 nav:grid-cols-[6fr_repeat(3,1fr)]">
      <div className="min-w-0">{main}</div>
      {side.map((node, i) => (
        <div key={i} className="min-w-0">
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
        "@container flex size-full flex-col items-center justify-center gap-4 overflow-hidden p-2 focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none",
        tone,
        className,
      )}
    >
      {/* Narrow tiles (side promos, tablet/phone quarters) get a smaller, wrapping title. */}
      <p className="text-center type-display wrap-break-word @max-xs:type-h3 @max-xs:hyphens-auto">{title}</p>
      {children}
    </a>
  )
}

export { HeroGallery, PromoBanner }
