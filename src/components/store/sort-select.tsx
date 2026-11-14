import { ArrowDownWideNarrowIcon, ChevronDownIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useControllableState } from '@/lib/use-controllable-state'

export type SortOption = { value: string, label: string }

/** Sort order menu: "⇣ Popularity: Most popular ⌄". */
function SortSelect({
  options,
  value,
  defaultValue = options[0]?.value,
  onValueChange,
}: {
  options: SortOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}) {
  const [sort, setSort] = useControllableState({ value, defaultValue, onChange: onValueChange })
  const current = options.find(o => o.value === sort) ?? options[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="font-bold" />}>
        <ArrowDownWideNarrowIcon data-icon="inline-start" />
        <span className="sr-only">Sort by: </span>
        {current?.label}
        <ChevronDownIcon data-icon="inline-end" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuRadioGroup value={sort} onValueChange={v => setSort(v as string)}>
          {options.map(option => (
            <DropdownMenuRadioItem key={option.value} value={option.value} closeOnClick>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** "Results found: 2449". */
function ResultsCount({ count, label = 'Results found' }: { count: number, label?: string }) {
  return (
    <p className="type-body" aria-live="polite">
      {label}
      :
      {' '}
      <strong className="font-bold">{count}</strong>
    </p>
  )
}

export { ResultsCount, SortSelect }
