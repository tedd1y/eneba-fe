import { ChevronDownIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

/**
 * Collapsible filter group on the tile surface: "Type ① ⌃".
 * `count` shows the gold badge with the number of active values.
 */
function FilterSection({
  title,
  count = 0,
  defaultOpen = true,
  children,
  className,
}: {
  title: string
  count?: number
  defaultOpen?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <Collapsible defaultOpen={defaultOpen} className={cn('bg-surface-tile', className)}>
      <CollapsibleTrigger className="group/filter flex w-full items-center gap-2 px-5 py-4 text-left type-nav font-bold outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset">
        <span className="flex-1">{title}</span>
        {count > 0 && (
          <Badge variant="count" aria-label={`${count} selected`}>
            {count}
          </Badge>
        )}
        <ChevronDownIcon
          className="size-5 transition-transform group-data-panel-open/filter:rotate-180"
          aria-hidden
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-5 pb-5">{children}</CollapsibleContent>
    </Collapsible>
  )
}

/** Vertical stack of filter sections, separated by thin page-colored gaps. */
function FilterSidebar({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <aside aria-label="Filters" className={cn('flex flex-col gap-0.5', className)}>
      {children}
    </aside>
  )
}

export { FilterSection, FilterSidebar }
