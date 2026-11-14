import { ChevronLeftIcon, ChevronRightIcon, type LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

export type QuickLinkItem = { icon: LucideIcon, label: string }

/** Icon shortcut in the quick-category strip (Games, Steam, PSN…). */
function QuickLink({ icon: Icon, label }: QuickLinkItem) {
  return (
    <a
      href="#"
      className="flex w-24 shrink-0 flex-col items-center gap-2 py-2 type-label text-foreground transition-colors hover:text-highlight"
    >
      <Icon className="size-8" aria-hidden />
      {label}
    </a>
  )
}

/** Scrollable row of quick links with prev/next chevrons. */
function QuickLinkStrip({ items }: { items: QuickLinkItem[] }) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon-sm" aria-label="Scroll left">
        <ChevronLeftIcon />
      </Button>
      <ScrollArea className="min-w-0 flex-1">
        <div className="flex justify-between gap-2 pb-3">
          {items.map(item => (
            <QuickLink key={item.label} {...item} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <Button variant="ghost" size="icon-sm" aria-label="Scroll right">
        <ChevronRightIcon />
      </Button>
    </div>
  )
}

export { QuickLink, QuickLinkStrip }
