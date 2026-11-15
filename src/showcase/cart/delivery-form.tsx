import { InfoIcon } from 'lucide-react'
import { useId } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

/** "Where to deliver the order?" — required email + "Remember me". Controlled via props. */
function DeliveryForm({
  title = 'Where to deliver the order?',
  email,
  onEmailChange,
  remember,
  onRememberChange,
  error,
  className,
}: {
  title?: string
  email: string
  onEmailChange: (email: string) => void
  remember: boolean
  onRememberChange: (remember: boolean) => void
  /** Validation message under the field; marks it invalid. */
  error?: string
  className?: string
}) {
  const id = useId()

  return (
    <section aria-labelledby={`${id}-title`} className={cn('flex flex-col gap-5 bg-surface-deep p-5', className)}>
      <h2 id={`${id}-title`} className="type-h3 font-bold">{title}</h2>
      <div className="flex flex-col gap-2">
        <label htmlFor={`${id}-email`} className="type-caption">
          Email
          {' '}
          <span className="text-muted-foreground" aria-hidden>*</span>
        </label>
        <Input
          id={`${id}-email`}
          type="email"
          variant="inset"
          required
          autoComplete="email"
          value={email}
          onChange={e => onEmailChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="h-10"
        />
        {error && <p id={`${id}-error`} className="type-caption text-destructive">{error}</p>}
      </div>
      <label className="flex items-center gap-3 type-body text-muted-foreground">
        <Checkbox checked={remember} onCheckedChange={checked => onRememberChange(checked === true)} />
        Remember me
        <InfoIcon className="size-4" aria-hidden />
      </label>
    </section>
  )
}

export { DeliveryForm }
