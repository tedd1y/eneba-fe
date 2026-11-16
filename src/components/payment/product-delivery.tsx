import { CheckIcon, CopyIcon, GemIcon, GlobeIcon, InfoIcon, KeyRoundIcon, MonitorPlayIcon, TriangleAlertIcon, CircleHelpIcon } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

import type { DeliveryItem } from './types'

/** Region / Platform / Product type: small label over a big uppercase value. */
function DeliveryFacts({ item }: { item: DeliveryItem }) {
  const facts = [
    { icon: GlobeIcon, label: 'Region', value: item.region, extra: (
      <p className="type-caption text-muted-foreground">
        Check
        {' '}
        <a href="#" className="text-attention hover:underline">region restrictions</a>
      </p>
    ) },
    { icon: MonitorPlayIcon, label: 'Platform', value: item.platform },
    { icon: KeyRoundIcon, label: 'Product type', value: item.productType, hint: 'The product is delivered as a code you redeem on the platform' },
  ]

  return (
    <dl className="grid gap-5 sm:grid-cols-3">
      {facts.map(({ icon: Icon, label, value, extra, hint }) => (
        <div key={label} className="flex items-center gap-3.5">
          <Icon className="size-10 shrink-0 stroke-[1.5]" aria-hidden />
          <div className="flex min-w-0 flex-col">
            <dt className="flex items-center gap-1.5 type-caption text-muted-foreground">
              {label}
              {hint && <CircleHelpIcon className="size-4 text-foreground" aria-label={hint} />}
            </dt>
            <dd className="type-h3 font-bold uppercase">{value}</dd>
            {extra}
          </div>
        </div>
      ))}
    </dl>
  )
}

/** "Please ensure you purchased the correct product": both boxes must be ticked before the key shows. */
function KeyConfirm({ item, onReveal, onRefund }: { item: DeliveryItem, onReveal: () => void, onRefund?: () => void }) {
  const [platformOk, setPlatformOk] = useState(false)
  const [regionOk, setRegionOk] = useState(false)

  return (
    <div className="flex flex-col bg-card">
      <p className="flex gap-3.5 px-5 py-5 type-body">
        <InfoIcon className="mt-0.5 size-6 shrink-0 text-attention" aria-hidden />
        Please ensure that you have purchased the correct digital product, as returns are impossible once the product has been displayed.
      </p>
      <Separator className="mx-5 w-auto" />
      <div className="flex flex-col gap-5 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex items-center gap-3.5 type-body">
            <Checkbox checked={platformOk} onCheckedChange={c => setPlatformOk(c === true)} />
            <span>
              <strong className="font-bold uppercase">{item.platform}</strong>
              {' '}
              is the correct platform
            </span>
          </label>
          <label className="flex items-center gap-3.5 type-body">
            <Checkbox checked={regionOk} onCheckedChange={c => setRegionOk(c === true)} />
            <span>
              <strong className="font-bold uppercase">{item.region}</strong>
              {' '}
              is the correct region
            </span>
          </label>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:max-w-155">
          <Button variant="buy" disabled={!platformOk || !regionOk} onClick={onReveal}>Display the key</Button>
          <Button variant="secondary" onClick={onRefund}>Request refund</Button>
        </div>
      </div>
    </div>
  )
}

/** One key with a copy button. */
function KeyValue({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
    catch {
      // Clipboard blocked (insecure origin / permissions): the key stays selectable on screen.
    }
  }

  return (
    <div className="flex items-center gap-4">
      <p className="type-h1 break-all select-all max-sm:text-center">{value}</p>
      <Button variant="ghost" size="icon" aria-label={copied ? 'Key copied' : 'Copy key'} onClick={copy}>
        {copied ? <CheckIcon className="text-positive" /> : <CopyIcon />}
      </Button>
    </div>
  )
}

/** The revealed key(s) with copy, "Print as a gift" and the library reminder. */
function KeyReveal({ keys, libraryHref = '#', onPrint }: { keys: string[], libraryHref?: string, onPrint?: () => void }) {
  return (
    <div className="flex flex-col bg-card px-5">
      <div className="flex flex-col items-center gap-6 pt-10 pb-11">
        <div className="flex flex-col items-center gap-3">
          {keys.map(k => <KeyValue key={k} value={k} />)}
        </div>
        <Button variant="secondary" className="w-full max-w-67" onClick={onPrint}>Print as a gift</Button>
      </div>
      <Separator />
      <div className="flex flex-col gap-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="type-body">Don&apos;t want to use it now? Don&apos;t worry. You can always find the code in your Library!</p>
        <Button variant="secondary" nativeButton={false} render={<Link to={libraryHref} />} className="shrink-0">My library</Button>
      </div>
    </div>
  )
}

/**
 * One bought product on "Get your product": box art, activation note, region/platform/type,
 * Enebium earned, then the key — hidden behind a platform + region confirmation until revealed.
 * Desktop: art sits in a tab left of the panel. Phone: art above, everything stacked.
 */
function ProductDelivery({ item, defaultRevealed = false, className }: {
  item: DeliveryItem
  defaultRevealed?: boolean
  className?: string
}) {
  const [revealed, setRevealed] = useState(defaultRevealed)
  const [failedImage, setFailedImage] = useState<string>()
  const showImage = item.image && failedImage !== item.image

  return (
    <article className={cn('grid md:grid-cols-[6.25rem_1fr]', className)}>
      <div className="self-start bg-surface-deep p-2.5 max-md:w-25 md:p-5">
        {showImage
          ? <img src={item.image} alt="" onError={() => setFailedImage(item.image)} className="aspect-[3/4] w-full object-cover" />
          : <div className={cn('aspect-[3/4] w-full', item.cover)} aria-hidden />}
      </div>

      <div className="flex min-w-0 flex-col gap-6 bg-surface-deep px-5 py-5 md:px-10 md:py-7.5">
        <h2 className="type-h3 font-bold">
          {item.title}
          {item.quantity > 1 && <span className="text-muted-foreground">{` × ${item.quantity}`}</span>}
        </h2>

        {item.activationNote && (
          <p className="flex gap-4 bg-card px-5 py-4 type-caption">
            <TriangleAlertIcon className="size-7 shrink-0 fill-attention stroke-attention-foreground" aria-hidden />
            {item.activationNote}
          </p>
        )}

        <DeliveryFacts item={item} />

        <p className="flex items-center gap-4 border border-border-strong/30 px-5 py-6 type-body">
          <GemIcon className="size-10 shrink-0 stroke-[1.5] text-highlight" aria-hidden />
          <span className="flex flex-col gap-1">
            <strong className="type-label">Success!</strong>
            <span className="text-muted-foreground">
              <strong className="font-bold text-highlight">
                {item.enebium}
                {' '}
                Enebium
              </strong>
              {' '}
              has been added to your Enebium balance.
            </span>
          </span>
        </p>

        <div className="flex flex-col gap-3">
          <p className="type-body text-muted-foreground">Digital product key:</p>
          {revealed ? <KeyReveal keys={item.keys} /> : <KeyConfirm item={item} onReveal={() => setRevealed(true)} />}
        </div>

        {revealed && (
          <>
            <p className="type-body">Since it&apos;s a digital product and the key was displayed, you are not eligible for a refund unless the key is invalid or faulty.</p>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-light type-caption font-bold text-light-foreground" aria-hidden>{item.seller.initials}</span>
                <div className="flex flex-col">
                  <p className="type-body">{item.seller.name}</p>
                  <p className="type-caption">
                    <span className="font-bold text-positive">{item.seller.positivePercent}</span>
                    {' '}
                    of
                    {' '}
                    {item.seller.ratings}
                    {' '}
                    ratings are
                    {' '}
                    <strong className="font-bold">excellent!</strong>
                  </p>
                </div>
              </div>
              <Button variant="secondary" className="self-start sm:self-auto">
                <TriangleAlertIcon data-icon="inline-start" />
                Report a problem
              </Button>
            </div>
          </>
        )}
      </div>
    </article>
  )
}

export { DeliveryFacts, KeyConfirm, KeyReveal, ProductDelivery }
