import { PlayIcon } from 'lucide-react'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'

import type { MediaItem } from './types'

/** Swipeable trailer + screenshot thumbnails under the hero. Clicking one reports it via `onSelect`. */
function MediaStrip({
  items,
  onSelect,
  className,
}: {
  items: MediaItem[]
  onSelect?: (item: MediaItem) => void
  className?: string
}) {
  return (
    <Carousel opts={{ align: 'start', dragFree: true }} className={cn('w-full', className)}>
      <CarouselContent className="-ml-2.5">
        {items.map(item => (
          <CarouselItem key={item.id} className="basis-auto pl-2.5">
            <button
              type="button"
              onClick={() => onSelect?.(item)}
              aria-label={item.kind === 'video' ? `Play ${item.alt}` : `View ${item.alt}`}
              className={cn(
                'group/media relative grid aspect-video w-media-thumb place-items-center transition-opacity hover:opacity-85',
                item.cover,
              )}
            >
              {item.kind === 'video' && (
                <span className="grid size-10 place-items-center rounded-full bg-discount transition-transform group-hover/media:scale-110">
                  <PlayIcon className="size-5 fill-foreground" aria-hidden />
                </span>
              )}
            </button>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-5 hidden md:inline-flex" />
      <CarouselNext className="-right-5 hidden md:inline-flex" />
    </Carousel>
  )
}

export { MediaStrip }
