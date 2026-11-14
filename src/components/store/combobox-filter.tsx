import type { FilterOption } from '@/components/store/types'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import { useControllableState } from '@/lib/use-controllable-state'

/**
 * Single-choice filter you can type into ("All countries ⌄").
 * `value` is the option's `value`; `null` means nothing chosen (shows the placeholder).
 */
function ComboboxFilter({
  options,
  value,
  defaultValue = null,
  onValueChange,
  placeholder = 'All',
  emptyText = 'No matches',
  label,
}: {
  options: FilterOption[]
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
  placeholder?: string
  emptyText?: string
  /** Accessible name, e.g. "Country". */
  label: string
}) {
  const [selected, setSelected] = useControllableState({ value, defaultValue, onChange: onValueChange })
  const selectedOption = options.find(o => o.value === selected) ?? null

  return (
    <Combobox
      items={options}
      value={selectedOption}
      onValueChange={option => setSelected(option?.value ?? null)}
      itemToStringLabel={option => option.label}
      isItemEqualToValue={(a, b) => a.value === b.value}
    >
      <ComboboxInput
        variant="field"
        placeholder={placeholder}
        aria-label={label}
        showClear={selectedOption !== null}
        className="h-10 w-full"
      />
      <ComboboxContent>
        <ComboboxEmpty>{emptyText}</ComboboxEmpty>
        <ComboboxList>
          {(option: FilterOption) => (
            <ComboboxItem key={option.value} value={option}>
              <span className="flex-1">{option.label}</span>
              {option.count !== undefined && (
                <span className="text-muted-foreground">{option.count}</span>
              )}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export { ComboboxFilter }
