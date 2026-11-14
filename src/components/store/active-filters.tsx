import { ChevronDownIcon } from 'lucide-react'

import type { FilterOption } from '@/components/store/types'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export type ActiveFilterGroup = {
  id: string
  label: string
  options: FilterOption[]
  value: string[]
}

/**
 * Applied-filter chips above results: "Type (1) ⌄  Regions (5) ⌄  Clear all".
 * Each chip opens a popover with its selected values; unticking one removes it.
 * Groups with nothing selected are hidden; renders nothing when no filter is active.
 */
function ActiveFilters({
  groups,
  onValueChange,
  onClearAll,
  clearLabel = 'Clear all',
}: {
  groups: ActiveFilterGroup[]
  onValueChange: (groupId: string, value: string[]) => void
  onClearAll: () => void
  clearLabel?: string
}) {
  const active = groups.filter(g => g.value.length > 0)
  if (active.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-4">
      {active.map(group => (
        <Popover key={group.id}>
          <PopoverTrigger render={<Button variant="chip" size="sm" />}>
            {group.label}
            {' '}
            (
            {group.value.length}
            )
            <ChevronDownIcon data-icon="inline-end" />
          </PopoverTrigger>
          <PopoverContent align="start" className="w-64">
            <ul className="flex flex-col gap-3">
              {group.options
                .filter(o => group.value.includes(o.value))
                .map(option => (
                  <li key={option.value}>
                    <label className="flex cursor-pointer items-center gap-3 type-body">
                      <Checkbox
                        checked
                        onCheckedChange={() =>
                          onValueChange(group.id, group.value.filter(v => v !== option.value))}
                      />
                      {option.label}
                    </label>
                  </li>
                ))}
            </ul>
            <Button
              variant="attention"
              size="text"
              className="self-start"
              onClick={() => onValueChange(group.id, [])}
            >
              Clear
              {' '}
              {group.label.toLowerCase()}
            </Button>
          </PopoverContent>
        </Popover>
      ))}
      <Button variant="attention" size="text" className="type-body" onClick={onClearAll}>
        {clearLabel}
      </Button>
    </div>
  )
}

export { ActiveFilters }
