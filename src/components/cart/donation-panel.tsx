import { ChevronDownIcon, CircleHelpIcon, HeartHandshakeIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'
import { useControllableState } from '@/lib/use-controllable-state'
import { cn } from '@/lib/utils'

import type { SummaryRow } from './types'

export type DonationAmount = { value: string, label: string }

/**
 * "Let's support freedom" — collapsible charity add-on. Picking an amount toggles it
 * (click again to clear); `totals` lists the running pledges under the buttons.
 */
function DonationPanel({
  title = 'Let\'s support freedom',
  text,
  amounts,
  value,
  defaultValue = null,
  onValueChange,
  totals,
  total,
  defaultOpen = true,
  className,
}: {
  title?: string
  text: string
  amounts: DonationAmount[]
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
  totals: SummaryRow[]
  total: SummaryRow
  defaultOpen?: boolean
  className?: string
}) {
  const [selected, setSelected] = useControllableState({ value, defaultValue, onChange: onValueChange })

  return (
    <Collapsible defaultOpen={defaultOpen} className={cn('bg-surface-deep', className)}>
      <CollapsibleTrigger className="group/donation flex w-full items-center gap-3 px-5 pt-5 pb-3 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset">
        <HeartHandshakeIcon className="size-5 shrink-0 text-attention" aria-hidden />
        <span className="flex flex-1 items-center gap-2 type-label">
          {title}
          <CircleHelpIcon className="size-4 text-muted-foreground" aria-hidden />
        </span>
        <ChevronDownIcon className="size-5 transition-transform group-data-panel-open/donation:rotate-180" aria-hidden />
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-4 pr-5 pb-5 pl-13">
        <p className="type-body text-muted-foreground">{text}</p>
        <div role="group" aria-label="Donation amount" className="flex flex-wrap gap-2.5">
          {amounts.map(amount => (
            <Button
              key={amount.value}
              variant="secondary"
              size="xs"
              aria-pressed={selected === amount.value}
              onClick={() => setSelected(selected === amount.value ? null : amount.value)}
              className="border-2 px-1 aria-pressed:border-attention aria-pressed:text-attention"
            >
              {amount.label}
            </Button>
          ))}
        </div>
        <dl className="flex flex-col gap-1 type-caption text-muted-foreground">
          {totals.map(row => (
            <div key={row.label} className="flex justify-between">
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
          <Separator className="my-1.5" />
          <div className="flex justify-between font-bold text-foreground">
            <dt>{total.label}</dt>
            <dd>{total.value}</dd>
          </div>
        </dl>
      </CollapsibleContent>
    </Collapsible>
  )
}

export { DonationPanel }
