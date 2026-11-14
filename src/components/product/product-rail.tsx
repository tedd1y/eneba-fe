import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'

/**
 * Swipeable row of items: 2 per view on phone, 3 on tablet, 5 on desktop.
 * Title and "See all" come from the surrounding <Block>.
 */
function ProductRail({
  children,
  className,
}: {
  children: React.ReactNode[]
  className?: string
}) {
  return (
    <Carousel opts={{ align: 'start' }} className={cn('w-full', className)}>
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
  )
}

export { ProductRail }
