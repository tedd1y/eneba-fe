import { StarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * Read-only 5-star rating. Supports fractions (4.57 → four full stars and one ~57% filled).
 * `size` follows the design: sm for review rows, md for the description header.
 */
function StarRating({
  value,
  max = 5,
  size = 'sm',
  className,
}: {
  value: number
  max?: number
  size?: 'sm' | 'md'
  className?: string
}) {
  const clamped = Math.min(max, Math.max(0, value))

  return (
    <span
      role="img"
      aria-label={`${clamped} out of ${max} stars`}
      className={cn('inline-flex shrink-0 items-center gap-0.5', className)}
    >
      {Array.from({ length: max }, (_, i) => {
        const fill = Math.min(1, Math.max(0, clamped - i))
        return (
          <span key={i} className={cn('relative', size === 'sm' ? 'size-4' : 'size-6')} aria-hidden>
            <StarIcon className="absolute inset-0 size-full fill-rating-empty text-rating-empty" />
            {fill > 0 && (
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <StarIcon
                  className={cn('fill-rating text-rating', size === 'sm' ? 'size-4' : 'size-6')}
                />
              </span>
            )}
          </span>
        )
      })}
    </span>
  )
}

export { StarRating }
