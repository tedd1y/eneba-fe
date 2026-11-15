import { ChevronLeftIcon, ChevronRightIcon, type LucideIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type QuickLinkItem = { icon: LucideIcon, label: string }

/** Icon shortcut in the quick-category strip (Games, Steam, PSN…). Grows to share the row; never narrower than 100px. */
function QuickLink({ icon: Icon, label }: QuickLinkItem) {
  return (
    <a
      href="#"
      className="flex h-quick-link-h min-w-quick-link-w flex-1 flex-col items-center justify-center gap-0.5 px-1 text-center type-quick-link text-foreground transition-colors hover:text-attention"
    >
      <Icon className="size-8" aria-hidden />
      <span className="w-full truncate">{label}</span>
    </a>
  )
}

/**
 * Row of quick links with prev/next chevrons, aligned to the page container like the other galleries.
 * Tiles stretch to fill the row. When they overflow there's no scrollbar or free scrolling:
 * the chevrons page through the row, and each one disables at its end.
 */
function QuickLinkStrip({ items, className }: { items: QuickLinkItem[], className?: string }) {
  const rowRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const update = useCallback(() => {
    const row = rowRef.current
    if (!row) return
    setCanPrev(row.scrollLeft > 0)
    setCanNext(row.scrollLeft + row.clientWidth < row.scrollWidth - 1)
  }, [])

  useEffect(() => {
    const row = rowRef.current
    if (!row) return
    update()
    const observer = new ResizeObserver(update)
    observer.observe(row)
    row.addEventListener('scroll', update, { passive: true })
    return () => {
      observer.disconnect()
      row.removeEventListener('scroll', update)
    }
  }, [update])

  /** Moves by most of the visible width, keeping one tile of overlap for context. */
  const page = (direction: 1 | -1) => {
    const row = rowRef.current
    if (!row) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    row.scrollBy({ left: direction * row.clientWidth * 0.8, behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  return (
    <div className={cn('flex page-container items-center gap-2', className)}>
      <Button variant="ghost" size="icon-sm" aria-label="Scroll left" disabled={!canPrev} onClick={() => page(-1)}>
        <ChevronLeftIcon />
      </Button>
      {/* overflow-hidden: no scrollbar, wheel or swipe; only the chevrons (and keyboard focus) move the row. */}
      <div ref={rowRef} className="flex min-w-0 flex-1 overflow-hidden">
        {items.map(item => (
          <QuickLink key={item.label} {...item} />
        ))}
      </div>
      <Button variant="ghost" size="icon-sm" aria-label="Scroll right" disabled={!canNext} onClick={() => page(1)}>
        <ChevronRightIcon />
      </Button>
    </div>
  )
}

export { QuickLink, QuickLinkStrip }
