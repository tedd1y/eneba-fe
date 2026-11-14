import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { useControllableState } from '@/lib/use-controllable-state'

/** `[from, to]`; `null` means "no limit" on that side. */
export type RangeValue = [number | null, number | null]

/**
 * Min – max number filter ("Price range"). Two filled inputs, optional slider underneath.
 * Empty inputs mean unbounded; values are clamped to [min, max] on blur.
 */
function RangeFilter({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = [null, null],
  onValueChange,
  showSlider = false,
  labels = ['Minimum', 'Maximum'],
}: {
  min?: number
  max?: number
  step?: number
  value?: RangeValue
  defaultValue?: RangeValue
  onValueChange?: (value: RangeValue) => void
  showSlider?: boolean
  /** Accessible names for the two inputs. */
  labels?: [string, string]
}) {
  const [range, setRange] = useControllableState({ value, defaultValue, onChange: onValueChange })
  const [from, to] = range

  const parse = (raw: string) => (raw === '' ? null : Number(raw))
  const clamp = (n: number | null) => (n === null ? null : Math.min(max, Math.max(min, n)))

  const commit = () => {
    let [a, b] = [clamp(from), clamp(to)]
    if (a !== null && b !== null && a > b) [a, b] = [b, a]
    if (a !== from || b !== to) setRange([a, b])
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Input
          variant="field"
          type="number"
          inputMode="decimal"
          aria-label={labels[0]}
          placeholder={String(min)}
          min={min}
          max={max}
          step={step}
          value={from ?? ''}
          onChange={e => setRange([parse(e.target.value), to])}
          onBlur={commit}
          className="h-10"
        />
        <span aria-hidden>-</span>
        <Input
          variant="field"
          type="number"
          inputMode="decimal"
          aria-label={labels[1]}
          placeholder={String(max)}
          min={min}
          max={max}
          step={step}
          value={to ?? ''}
          onChange={e => setRange([from, parse(e.target.value)])}
          onBlur={commit}
          className="h-10"
        />
      </div>
      {showSlider && (
        <Slider
          min={min}
          max={max}
          step={step}
          value={[from ?? min, to ?? max]}
          onValueChange={(next) => {
            const [a, b] = next as number[]
            setRange([a === min ? null : a, b === max ? null : b])
          }}
          aria-label={labels.join(' and ')}
        />
      )}
    </div>
  )
}

export { RangeFilter }
