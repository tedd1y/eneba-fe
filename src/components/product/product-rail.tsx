import { InfoIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

/** Section heading with the small info icon: "Recommended for you ⓘ". */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 type-h2">
      {children}
      <InfoIcon className="size-4 text-muted-foreground" aria-hidden />
    </h2>
  )
}

/**
 * Horizontal product rail: title, swipeable row of items, centered "See all".
 * Items are 2 per view on phone, 3 on tablet, 5 on desktop.
 */
function ProductRail({
  title,
  children,
  actionLabel = "See all",
  className,
}: {
  title: string
  children: React.ReactNode[]
  actionLabel?: string
  className?: string
}) {
  return (
    <section className={cn("flex flex-col gap-6", className)}>
      <SectionTitle>{title}</SectionTitle>
      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent className="-ml-4">
          {children.map((child, i) => (
            <CarouselItem key={i} className="basis-1/2 pl-4 sm:basis-1/3 lg:basis-1/5">
              {child}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-5 hidden md:inline-flex" />
        <CarouselNext className="-right-5 hidden md:inline-flex" />
      </Carousel>
      <div className="flex justify-center">
        <Button variant="secondary" size="wide">
          {actionLabel}
        </Button>
      </div>
    </section>
  )
}

export { ProductRail, SectionTitle }
