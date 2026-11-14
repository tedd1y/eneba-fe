import { useCallback, useState } from 'react'

/**
 * State that can be controlled (`value` + `onChange`) or uncontrolled (`defaultValue`).
 * Lets store filters work standalone in the styleguide and wired to URL/query state on a page.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value?: T
  defaultValue: T
  onChange?: (value: T) => void
}) {
  const [inner, setInner] = useState(defaultValue)
  const isControlled = value !== undefined
  const current = isControlled ? value : inner

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInner(next)
      onChange?.(next)
    },
    [isControlled, onChange],
  )

  return [current, setValue] as const
}
