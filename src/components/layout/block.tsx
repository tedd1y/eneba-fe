import { InfoIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const tones = {
  page: 'bg-background',
  band: 'bg-surface-deep',
} as const

export type BlockTone = keyof typeof tones

/**
 * Full-width homepage section. Owns the background band, the page container,
 * the section title (with optional info icon) and the centered action button,
 * so the content inside (rails, tile grids) stays title-less.
 */
function Block({
  title,
  tone = 'page',
  info = false,
  action,
  actionHref = '#',
  children,
  className,
}: {
  title?: string
  tone?: BlockTone
  /** Shows the small ⓘ after the title. */
  info?: boolean
  /** Label of the centered button under the content: "See all", "Load more"… */
  action?: string
  actionHref?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn(tones[tone], className)}>
      <div className="flex page-container flex-col gap-block-gap py-block nav:py-block-lg">
        {title && (
          <h2 className="flex items-center gap-2 type-h2">
            {title}
            {info && <InfoIcon className="size-4 text-muted-foreground" aria-hidden />}
          </h2>
        )}
        {children}
        {action && (
          <div className="flex justify-center">
            <Button
              variant="secondary"
              size="wide"
              nativeButton={false}
              render={<a href={actionHref} />}
            >
              {action}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

export { Block }
