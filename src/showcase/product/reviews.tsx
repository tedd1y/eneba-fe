import { LanguagesIcon, ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { StarRating } from './star-rating'
import type { RatingAspect, Review } from './types'

/** ISO alpha-2 → regional-indicator emoji flag ("LT" → 🇱🇹). */
function flagOf(country: string) {
  return country
    .toUpperCase()
    .replace(/./g, ch => String.fromCodePoint(0x1F1E6 + ch.charCodeAt(0) - 65))
}

/** Per-aspect stars ("Gameplay ★★★★★") with the "Review now" action. */
function RatingSummary({
  aspects,
  actionLabel = 'Review now',
  onReview,
  className,
}: {
  aspects: RatingAspect[]
  actionLabel?: string
  onReview?: () => void
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-4 bg-surface-deep p-5 sm:flex-row sm:items-end sm:justify-between', className)}>
      <dl className="grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-1.5 sm:pl-5">
        {aspects.map(aspect => (
          <div key={aspect.label} className="contents">
            <dd><StarRating value={aspect.value} /></dd>
            <dt className="type-body">{aspect.label}</dt>
          </div>
        ))}
      </dl>
      <Button variant="secondary" size="sm" className="self-end" onClick={onReview}>{actionLabel}</Button>
    </div>
  )
}

type Vote = 'up' | 'down' | null

/**
 * One review: stars, flag, author, date, translate toggle, helpful votes and text.
 * Long text clamps to two lines with "Read more"; votes adjust the score locally.
 */
function ReviewItem({
  review,
  clampAt = 180,
  onVote,
  className,
}: {
  review: Review
  /** Characters after which the text is clamped behind "Read more". */
  clampAt?: number
  onVote?: (review: Review, vote: Vote) => void
  className?: string
}) {
  const [vote, setVote] = useState<Vote>(null)
  const [expanded, setExpanded] = useState(false)
  const [showOriginal, setShowOriginal] = useState(false)

  const text = showOriginal && review.originalText ? review.originalText : review.text
  const long = text.length > clampAt
  const score = review.votes + (vote === 'up' ? 1 : vote === 'down' ? -1 : 0)

  const cast = (next: Exclude<Vote, null>) => {
    const value = vote === next ? null : next
    setVote(value)
    onVote?.(review, value)
  }

  return (
    <article className={cn('flex flex-col gap-3 bg-surface-deep p-5', className)}>
      <header className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <StarRating value={review.rating} />
        <span className="flex items-center gap-2">
          <span className="type-body" role="img" aria-label={review.country}>{flagOf(review.country)}</span>
          <span className="type-label">{review.author}</span>
          <time className="type-caption text-muted-foreground">{review.date}</time>
        </span>
        <span className="ml-auto flex items-center gap-1">
          {review.originalText && (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-pressed={showOriginal}
              aria-label={showOriginal ? 'Show translation' : 'Show original'}
              onClick={() => setShowOriginal(o => !o)}
              className={cn(showOriginal && 'text-attention')}
            >
              <LanguagesIcon />
            </Button>
          )}
          <Button variant="ghost" size="icon-sm" aria-pressed={vote === 'up'} aria-label="Helpful" onClick={() => cast('up')} className={cn(vote === 'up' && 'text-attention')}>
            <ThumbsUpIcon />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-pressed={vote === 'down'} aria-label="Not helpful" onClick={() => cast('down')} className={cn(vote === 'down' && 'text-attention')}>
            <ThumbsDownIcon />
          </Button>
          <span className={cn('min-w-6 text-right type-label', score > 0 ? 'text-positive' : 'text-muted-foreground')}>
            {score > 0 ? `+${score}` : score}
          </span>
        </span>
      </header>
      <p className={cn('type-body text-muted-foreground', long && !expanded && 'line-clamp-2')}>
        {review.autoTranslated && !showOriginal && (
          <Badge variant="outline" className="mr-2 h-5 rounded-sm border-muted-foreground px-1.5 type-caption text-muted-foreground">
            Auto-translated
          </Badge>
        )}
        {text}
      </p>
      {long && (
        <Button variant="attention" size="text" className="self-start type-body font-normal" onClick={() => setExpanded(e => !e)}>
          {expanded ? 'Show less' : 'Read more'}
        </Button>
      )}
    </article>
  )
}

/** "Reviews: 47" — summary, list and "Load more reviews" (reveals `step` at a time). */
function ReviewList({
  total,
  aspects,
  reviews,
  initialCount = 5,
  step = 5,
  onReview,
  className,
}: {
  total: number
  aspects: RatingAspect[]
  reviews: Review[]
  initialCount?: number
  step?: number
  onReview?: () => void
  className?: string
}) {
  const [visible, setVisible] = useState(initialCount)

  return (
    <section className={cn('flex flex-col gap-4', className)}>
      <h2 className="type-h3 font-bold">
        Reviews:
        {' '}
        {total}
      </h2>
      <div className="flex flex-col gap-0.5">
        <RatingSummary aspects={aspects} onReview={onReview} />
        {reviews.slice(0, visible).map(review => <ReviewItem key={review.id} review={review} />)}
      </div>
      {visible < reviews.length && (
        <Button variant="secondary" className="self-center" onClick={() => setVisible(v => v + step)}>
          Load more reviews
        </Button>
      )}
    </section>
  )
}

export { RatingSummary, ReviewItem, ReviewList }
