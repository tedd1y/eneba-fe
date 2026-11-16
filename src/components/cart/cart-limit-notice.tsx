import { CircleAlertIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

/** Inline gold notice for cart limits ("Your cart is full…"). Announced politely to screen readers. */
function CartLimitNotice({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <p role="status" className={cn('flex items-start gap-2 type-body text-attention', className)}>
      <CircleAlertIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  )
}

export { CartLimitNotice }
