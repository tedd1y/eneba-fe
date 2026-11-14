import { useId, useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon, SearchIcon } from 'lucide-react'

import type { FilterOption } from '@/components/store/types'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { useControllableState } from '@/lib/use-controllable-state'

/**
 * Multi-select checkbox list with counts ("Type", "Operating system").
 * - `searchable` adds a search box that filters the list ("Platforms", "Regions").
 * - Lists longer than `visibleCount` collapse behind "N more ⌄" / "Show less ⌃".
 */
function CheckboxFilter({
  options,
  value,
  defaultValue = [],
  onValueChange,
  searchable = false,
  searchLabel = 'Search',
  visibleCount = 8,
  emptyText = 'No matches',
}: {
  options: FilterOption[]
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  searchable?: boolean
  searchLabel?: string
  visibleCount?: number
  emptyText?: string
}) {
  const id = useId()
  const [selected, setSelected] = useControllableState({ value, defaultValue, onChange: onValueChange })
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(false)

  const q = query.trim().toLowerCase()
  const matches = q ? options.filter(o => o.label.toLowerCase().includes(q)) : options
  // While searching, show every match; otherwise respect the collapsed length.
  const collapsible = !q && matches.length > visibleCount
  const shown = collapsible && !expanded ? matches.slice(0, visibleCount) : matches

  const toggle = (optionValue: string, checked: boolean) =>
    setSelected(checked ? [...selected, optionValue] : selected.filter(v => v !== optionValue))

  return (
    <div className="flex flex-col gap-4">
      {searchable && (
        <InputGroup variant="field" className="h-10">
          <InputGroupInput
            type="search"
            aria-label={searchLabel}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <InputGroupAddon align="inline-end">
            <SearchIcon className="size-5 text-foreground" />
          </InputGroupAddon>
        </InputGroup>
      )}

      <ul className="flex flex-col gap-3">
        {shown.map((option) => {
          const optionId = `${id}-${option.value}`
          return (
            <li key={option.value}>
              <label htmlFor={optionId} className="flex cursor-pointer items-start gap-3 type-body">
                <Checkbox
                  id={optionId}
                  checked={selected.includes(option.value)}
                  onCheckedChange={checked => toggle(option.value, checked)}
                  className="mt-px"
                />
                <span className="flex-1 leading-tight">{option.label}</span>
                {option.count !== undefined && (
                  <span className="text-muted-foreground tabular-nums">{option.count}</span>
                )}
              </label>
            </li>
          )
        })}
        {shown.length === 0 && <li className="type-body text-muted-foreground">{emptyText}</li>}
      </ul>

      {collapsible && (
        <Button
          variant="attention"
          size="text"
          className="self-start"
          aria-expanded={expanded}
          onClick={() => setExpanded(e => !e)}
        >
          {expanded ? 'Show less' : `${matches.length - visibleCount} more`}
          {expanded ? <ChevronUpIcon data-icon="inline-end" /> : <ChevronDownIcon data-icon="inline-end" />}
        </Button>
      )}
    </div>
  )
}

export { CheckboxFilter }
