import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** Simple arcade-style ghost: round head, wavy hem, two eyes. Colour comes from `currentColor`. */
function Ghost({ className, style }: { className?: string, style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 40 40" className={className} style={style} aria-hidden>
      <path
        fill="currentColor"
        d="M20 2C10.1 2 4 9.2 4 18v18.5c0 1 1.1 1.5 1.9.9l3.4-2.6 3.4 2.6c.6.4 1.4.4 2 0l3.4-2.6 3.4 2.6c.6.4 1.4.4 2 0l3.4-2.6 3.4 2.6c.6.4 1.4.4 2 0L34 34.8l1.1.9c.8.6 1.9.1 1.9-.9V18C36 9.2 29.9 2 20 2Z"
      />
      <circle cx="14" cy="19" r="3.2" className="fill-background" />
      <circle cx="26" cy="19" r="3.2" className="fill-background" />
    </svg>
  )
}

/** Scattered ghosts: position (%), size and token colour; `delay` staggers the float. */
const ghosts = [
  { left: '4%', top: '62%', size: 'size-12', color: 'text-chart-2', delay: '0s' },
  { left: '16%', top: '40%', size: 'size-16', color: 'text-cashback', delay: '-1.2s' },
  { left: '31%', top: '8%', size: 'size-20', color: 'text-discount', delay: '-2.4s' },
  { left: '31%', top: '68%', size: 'size-12', color: 'text-foreground', delay: '-0.6s' },
  { left: '44%', top: '45%', size: 'size-24', color: 'text-highlight', delay: '-3s' },
  { left: '52%', top: '0%', size: 'size-14', color: 'text-chart-5', delay: '-1.8s' },
  { left: '58%', top: '32%', size: 'size-12', color: 'text-region-alt', delay: '-2s' },
  { left: '60%', top: '78%', size: 'size-8', color: 'text-discount', delay: '-0.9s' },
  { left: '69%', top: '15%', size: 'size-8', color: 'text-attention', delay: '-2.7s' },
  { left: '71%', top: '52%', size: 'size-16', color: 'text-primary-hover', delay: '-1.5s' },
  { left: '80%', top: '35%', size: 'size-8', color: 'text-region-eu', delay: '-3.3s' },
  { left: '90%', top: '65%', size: 'size-16', color: 'text-highlight', delay: '-0.3s' },
]

/**
 * "Highscore! 404" page body. Title, text and action are props so it can serve
 * a missing product, a missing route, or any other not-found case.
 */
function NotFound({
  title = 'Highscore! 404',
  text = 'We\'re pretty sure something went horribly wrong',
  actionLabel = 'Continue browsing',
  actionHref = '/',
  className,
}: {
  title?: string
  text?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}) {
  return (
    <main
      className={cn(
        'relative flex min-h-[calc(100dvh-var(--spacing-header-mobile))] flex-col overflow-hidden nav:min-h-[calc(100dvh-var(--spacing-header-bar)-var(--spacing-header-nav))]',
        className,
      )}
    >
      <div className="flex page-container flex-col items-start gap-6 pt-block-lg nav:gap-8 nav:pt-36">
        <h1 className="type-display nav:text-6xl">{title}</h1>
        <p className="type-nav nav:text-xl">{text}</p>
        <Button variant="secondary" size="wide" nativeButton={false} render={<Link to={actionHref} />}>
          {actionLabel}
        </Button>
      </div>

      <div className="relative mt-auto h-80 w-full nav:h-[28rem]" aria-hidden>
        {ghosts.map(g => (
          <Ghost
            key={`${g.left}-${g.top}`}
            className={cn('absolute animate-float motion-reduce:animate-none', g.size, g.color)}
            // Position and stagger are per-ghost data, not design tokens.
            style={{ left: g.left, top: g.top, animationDelay: g.delay }}
          />
        ))}
      </div>
    </main>
  )
}

export { NotFound }
