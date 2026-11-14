import { ChevronLeftIcon, ChevronRightIcon, type LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

export type QuickLinkItem = { icon: LucideIcon, label: string }

/** Icon shortcut in the quick-category strip (Games, Steam, PSN…). */
function QuickLink({ icon: Icon, label }: QuickLinkItem) {
  return (
    <a
      href="#"
      className="flex h-quick-link-h w-quick-link-w shrink-0 flex-col items-center justify-center gap-0.5 px-1 text-center type-quick-link text-foreground transition-colors hover:text-attention"
    >
      <Icon className="size-8" aria-hidden />
      <span className="w-full truncate">{label}</span>
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
        <div className="flex pb-3">
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
