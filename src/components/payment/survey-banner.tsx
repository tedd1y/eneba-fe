import { SmileIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** "Help us improve Eneba" feedback strip with a "Take the survey" button. */
function SurveyBanner({ href = '#', className }: { href?: string, className?: string }) {
  return (
    <section className={cn('flex flex-wrap items-center justify-center gap-x-12 gap-y-4 bg-surface-deep px-5 py-5', className)}>
      <div className="flex items-center gap-5">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-surface-tile" aria-hidden>
          <SmileIcon className="size-7 text-attention" />
        </span>
        <div className="flex flex-col gap-0.5">
          <h2 className="type-h3 font-bold">Help us improve Eneba</h2>
          <p className="type-body text-muted-foreground">Rate 4 simple statements, we&apos;d love to know your feedback</p>
        </div>
      </div>
      <Button variant="buy" nativeButton={false} render={<a href={href} />}>Take the survey</Button>
    </section>
  )
}

export { SurveyBanner }
