import { ArrowLeftIcon, CheckIcon } from 'lucide-react'
import { Fragment } from 'react'
import { Link } from 'react-router'

import { Logo } from '@/components/layout/logo'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

import type { CheckoutStep } from './types'

/** Numbered checkout progress: done steps show a tick, the current one is mint, later ones dimmed. */
function CheckoutSteps({ steps, current, className }: { steps: CheckoutStep[], current: number, className?: string }) {
  return (
    <ol className={cn('flex min-w-0 flex-1 items-center gap-3', className)}>
      {steps.map((step, i) => {
        const state = i < current ? 'done' : i === current ? 'current' : 'todo'
        return (
          <Fragment key={step.id}>
            {i > 0 && <li aria-hidden className="h-px min-w-6 flex-1 bg-muted-foreground/60" />}
            <li aria-current={state === 'current' ? 'step' : undefined} className="flex shrink-0 items-center gap-2.5">
              <span
                className={cn(
                  'grid size-6 place-items-center rounded-full type-caption font-bold',
                  state === 'todo' ? 'bg-surface-tile text-muted-foreground' : 'bg-region-eu text-foreground',
                  state === 'todo' && i > current + 1 && 'opacity-60',
                )}
              >
                {state === 'done' ? <CheckIcon className="size-3.5" aria-hidden /> : i + 1}
              </span>
              <span
                className={cn(
                  'type-body max-lg:sr-only',
                  state === 'current' ? 'text-region-eu' : 'text-muted-foreground',
                  state === 'todo' && i > current + 1 && 'opacity-60',
                )}
              >
                {step.label}
              </span>
            </li>
          </Fragment>
        )
      })}
    </ol>
  )
}

/**
 * Minimal header for the checkout flow: logo, step progress, locale.
 * On phones it collapses to the logo mark and the current step's name; with `backHref`,
 * the logo is swapped for a back arrow ("← Payment").
 */
function CheckoutHeader({
  steps,
  current,
  homeHref = '/',
  backHref,
  className,
}: {
  steps: CheckoutStep[]
  current: number
  homeHref?: string
  /** Phone only: show a back arrow to this page instead of the logo. */
  backHref?: string
  className?: string
}) {
  return (
    <header className={cn('bg-surface-nav', className)}>
      <div className="mx-auto flex h-header-mobile max-w-page items-center gap-4 px-4 sm:h-header-bar sm:gap-10 sm:px-8">
        {backHref && (
          <Link to={backHref} aria-label="Back" className="-ml-1 shrink-0 p-1 sm:hidden">
            <ArrowLeftIcon className="size-5" aria-hidden />
          </Link>
        )}
        <Link to={homeHref} aria-label="Eneba home" className={cn('shrink-0', backHref && 'max-sm:hidden')}>
          <Logo className="h-8 sm:h-12" />
        </Link>
        <p className="type-h3 font-bold sm:hidden">{steps[current]?.label}</p>
        <CheckoutSteps steps={steps} current={current} className="max-sm:hidden" />
        <Button variant="ghost" className="ml-auto hover:bg-transparent max-sm:hidden">
          English EU
          <Separator orientation="vertical" className="h-4 bg-foreground data-vertical:self-center" />
          EUR
        </Button>
      </div>
    </header>
  )
}

export { CheckoutHeader, CheckoutSteps }
