import { MinusIcon, PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useControllableState } from '@/lib/use-controllable-state'
import { cn } from '@/lib/utils'

/** "−  1  +" quantity control. Controlled or uncontrolled; clamps to [min, max]. */
function QuantityStepper({
  value,
  defaultValue = 1,
  onValueChange,
  min = 1,
  max = 10,
  label = 'Quantity',
  className,
}: {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  label?: string
  className?: string
}) {
  const [qty, setQty] = useControllableState({ value, defaultValue, onChange: onValueChange })

  return (
    <div role="group" aria-label={label} className={cn('flex items-center gap-1', className)}>
      <Button variant="ghost" size="icon-sm" aria-label="Decrease quantity" disabled={qty <= min} onClick={() => setQty(Math.max(min, qty - 1))}>
        <MinusIcon />
      </Button>
      <output aria-live="polite" className="min-w-6 text-center type-body">{qty}</output>
      <Button variant="ghost" size="icon-sm" aria-label="Increase quantity" disabled={qty >= max} onClick={() => setQty(Math.min(max, qty + 1))}>
        <PlusIcon />
      </Button>
    </div>
  )
}

export { QuantityStepper }
