import { SlidersHorizontalIcon, XIcon } from 'lucide-react'

import { FilterSection, FilterSidebar } from '@/components/store/filter-section'
import type { SortOption } from '@/components/store/sort-select'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

/**
 * Tablet / phone stand-in for the filter sidebar: a "Sort and filter (n)" chip that slides in a
 * panel from the left with the sort order and every filter section (`children`), plus
 * "Clear all" and "Show N results" at the bottom. Filters apply as they change, like the sidebar.
 */
function FilterSheet({
  activeCount,
  sortOptions,
  sort,
  onSortChange,
  resultsCount,
  onClearAll,
  children,
}: {
  /** Number of active filter groups, shown as "(n)" on the button. */
  activeCount: number
  sortOptions: SortOption[]
  sort: string
  onSortChange: (value: string) => void
  resultsCount: number
  onClearAll: () => void
  /** FilterSection elements, the same ones the desktop sidebar shows. */
  children: React.ReactNode
}) {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="chip" size="sm" />}>
        <SlidersHorizontalIcon data-icon="inline-start" />
        Sort and filter
        {activeCount > 0 && ` (${activeCount})`}
      </SheetTrigger>
      <SheetContent side="left" showCloseButton={false} className="gap-0 bg-background p-0 data-[side=left]:w-full sm:max-w-sm">
        <div className="flex items-center justify-between gap-4 bg-surface-nav px-5 py-4">
          <SheetTitle className="type-h3 font-bold">Sort and filter</SheetTitle>
          <SheetClose render={<Button variant="ghost" size="icon-sm" aria-label="Close" />}>
            <XIcon />
          </SheetClose>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <FilterSidebar>
            <FilterSection title="Sort by">
              <RadioGroup aria-label="Sort by" value={sort} onValueChange={v => onSortChange(String(v))} className="gap-3">
                {sortOptions.map(option => (
                  <label key={option.value} className="flex cursor-pointer items-center gap-3 type-body">
                    <RadioGroupItem value={option.value} />
                    {option.label}
                  </label>
                ))}
              </RadioGroup>
            </FilterSection>
            {children}
          </FilterSidebar>
        </div>

        <div className="flex items-center gap-4 bg-surface-nav px-5 py-4">
          <Button variant="attention" size="text" className="type-body" onClick={onClearAll}>Clear all</Button>
          <SheetClose render={<Button variant="buy" className="flex-1" />}>
            Show
            {' '}
            {resultsCount}
            {' '}
            {resultsCount === 1 ? 'result' : 'results'}
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export { FilterSheet }
