import { cn } from '@/lib/utils'

import type { PaymentLogo as PaymentLogoKind } from './types'

/**
 * White tile with the provider's mark. No provider artwork in the repo yet, so these are typed
 * wordmarks (the site logo has white lettering, so the wallet gets a wordmark too). Swap a case for an <img> once real SVGs exist.
 */
function PaymentLogo({ logo, label, className }: { logo: PaymentLogoKind, label: string, className?: string }) {
  return (
    <span
      className={cn(
        'grid h-12 w-26 shrink-0 place-items-center overflow-hidden bg-light px-2 text-light-foreground sm:h-12.5 sm:w-27.5',
        className,
      )}
      aria-hidden
    >
      {logo === 'eneba'
        ? (
            <span className="flex flex-col items-end leading-none">
              <span className="text-2xl font-bold tracking-tight">eneba</span>
              <span className="type-caption font-bold">wallet</span>
            </span>
          )
        : <span className={cn('truncate text-center font-bold tracking-tight', wordmarkClass[logo])}>{label}</span>}
    </span>
  )
}

/** Wordmark styling per provider: weight, size and case only (colours stay on theme tokens). */
const wordmarkClass: Record<Exclude<PaymentLogoKind, 'eneba'>, string> = {
  'card': 'text-xl italic',
  'paypal': 'text-2xl italic',
  'swedbank': 'text-base',
  'seb': 'text-2xl tracking-widest',
  'luminor': 'text-2xl font-semibold',
  'revolut': 'text-2xl',
  'artea': 'text-2xl font-semibold',
  'lku': 'text-2xl tracking-wider',
  'apple-pay': 'text-xl font-semibold',
  'google-pay': 'text-2xl font-medium',
  'citadele': 'text-xl',
  'crypto': 'text-base',
}

export { PaymentLogo }
