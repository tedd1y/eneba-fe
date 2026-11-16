import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'

import { PaymentLogo } from './payment-logo'
import type { PaymentMethod } from './types'

/**
 * Payment method picker. Each option is a full-width row: logo tile, name + description, radio.
 * Tablet/desktop: separate tiles with gaps. Phone: edge-to-edge rows split by hairlines.
 */
function PaymentMethodList({
  methods,
  value,
  onValueChange,
  className,
}: {
  methods: PaymentMethod[]
  value: string | null
  onValueChange: (id: string) => void
  className?: string
}) {
  return (
    <RadioGroup
      aria-label="Payment method"
      value={value}
      onValueChange={v => onValueChange(String(v))}
      className={cn('gap-0 max-sm:divide-y max-sm:divide-border sm:gap-2.5', className)}
    >
      {methods.map(method => (
        <label
          key={method.id}
          className="flex cursor-pointer items-center gap-5 bg-surface-deep px-5 py-4 transition-colors hover:bg-accent has-data-checked:bg-accent sm:py-3.75"
        >
          <PaymentLogo logo={method.logo} label={method.logoLabel} />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="type-label">{method.name}</span>
            {method.description && <span className="type-caption text-muted-foreground">{method.description}</span>}
          </span>
          <RadioGroupItem value={method.id} aria-label={method.name} />
        </label>
      ))}
    </RadioGroup>
  )
}

export { PaymentMethodList }
