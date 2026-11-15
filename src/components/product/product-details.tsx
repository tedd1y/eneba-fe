import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

import { StarRating } from './star-rating'
import type { DescriptionBlock, RequirementSet, SpecRow } from './types'

/** Genre / mode pills ("Single Player", "Strategy"). */
function TagList({ tags, className }: { tags: string[], className?: string }) {
  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)}>
      {tags.map(tag => (
        <li key={tag}>
          <Badge className="h-6 rounded-full bg-chip px-2.5 type-body text-muted-foreground">{tag}</Badge>
        </li>
      ))}
    </ul>
  )
}

function DescriptionBody({ blocks }: { blocks: DescriptionBlock[] }) {
  return blocks.map((block, i) =>
    block.kind === 'paragraph'
      ? <p key={i}>{block.text}</p>
      : (
          <ul key={i} className="flex list-inside list-disc flex-col gap-1.5 pl-5">
            {block.items.map(item => <li key={item}>{item}</li>)}
          </ul>
        ))
}

/** Clamps tall content behind a fade with a centred "Read more" toggle. */
function Expandable({ children, collapsedClass = 'max-h-96' }: { children: React.ReactNode, collapsedClass?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col gap-3">
      <div className={cn('relative overflow-hidden', !open && collapsedClass)}>
        {children}
        {!open && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-b from-transparent to-surface-deep" aria-hidden />}
      </div>
      <Button variant="attention" size="text" className="self-center type-body font-normal" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        {open ? 'Show less' : 'Read more'}
      </Button>
    </div>
  )
}

/** Tabbed "Description" / "Activation guide" panel with rating header and collapsible copy. */
function DescriptionTabs({
  title,
  rating,
  ratingCount,
  description,
  activationSteps,
  className,
}: {
  title: string
  rating?: number
  ratingCount?: number
  description: DescriptionBlock[]
  activationSteps: string[]
  className?: string
}) {
  return (
    <Tabs defaultValue="description" className={cn('gap-0', className)}>
      <TabsList variant="panel">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="activation">Activation guide</TabsTrigger>
      </TabsList>
      <TabsContent value="description" className="flex flex-col gap-5 bg-surface-deep p-5 pt-8">
        <h3 className="type-h3">{title}</h3>
        {rating !== undefined && (
          <p className="flex items-center gap-2 type-caption text-muted-foreground">
            <StarRating value={rating} size="md" />
            <span className="type-label text-rating">{rating.toFixed(2)}</span>
            / 5 from
            {' '}
            {ratingCount?.toLocaleString()}
            {' '}
            ratings
          </p>
        )}
        <Expandable>
          <div className="flex flex-col gap-4 type-body text-muted-foreground">
            <DescriptionBody blocks={description} />
          </div>
        </Expandable>
      </TabsContent>
      <TabsContent value="activation" className="bg-surface-deep p-5 pt-8">
        <ol className="flex list-inside list-decimal flex-col gap-2 type-body text-muted-foreground">
          {activationSteps.map(step => <li key={step}>{step}</li>)}
        </ol>
      </TabsContent>
    </Tabs>
  )
}

/** Right-aligned label / value rows. Array values stack one per line (languages). */
function SpecList({ rows, title, className }: { rows: SpecRow[], title?: string, className?: string }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {title && <h4 className="type-card-title">{title}</h4>}
      <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1 type-body">
        {rows.map(row => (
          <div key={row.label} className="contents">
            <dt className="text-right text-muted-foreground">{row.label}</dt>
            <dd className="flex flex-col">
              {Array.isArray(row.value) ? row.value.map(v => <span key={v}>{v}</span>) : row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/** One tab per platform ("WINDOWS", "MAC"), each with minimum and recommended specs. */
function SystemRequirements({ sets, className }: { sets: RequirementSet[], className?: string }) {
  return (
    <Tabs defaultValue={sets[0]?.platform} className={cn('gap-0', className)}>
      <TabsList variant="panel">
        {sets.map(set => <TabsTrigger key={set.platform} value={set.platform} className="uppercase">{set.platform}</TabsTrigger>)}
      </TabsList>
      {sets.map(set => (
        <TabsContent key={set.platform} value={set.platform} className="flex flex-col gap-6 bg-surface-deep p-5">
          <SpecList title="Minimum system requirements" rows={set.minimum} />
          {set.recommended && <SpecList title="Recommended system requirements" rows={set.recommended} />}
        </TabsContent>
      ))}
    </Tabs>
  )
}

/** Titled page section used for "Product Details", "System requirements", "Other details". */
function DetailSection({ title, id, children, className }: { title: string, id?: string, children: React.ReactNode, className?: string }) {
  return (
    <section id={id} className={cn('flex scroll-mt-24 flex-col gap-4', className)}>
      <h2 className="type-h3 font-bold">{title}</h2>
      {children}
    </section>
  )
}

export { DescriptionTabs, DetailSection, Expandable, SpecList, SystemRequirements, TagList }
