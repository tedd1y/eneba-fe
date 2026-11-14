import { Section, Specimen } from "@/showcase/section"
import { ColorPair } from "@/showcase/color-pair"

const pairs = [
  { name: "Page", background: "background", foreground: "foreground" },
  { name: "Section band", background: "surface-deep", foreground: "foreground" },
  { name: "Product card", background: "card", foreground: "card-foreground" },
  { name: "Primary CTA", background: "primary", foreground: "primary-foreground" },
  { name: "Cashback badge", background: "highlight", foreground: "highlight-foreground" },
  { name: "Category tile", background: "surface-tile", foreground: "foreground" },
  { name: "Muted text on card", background: "card", foreground: "muted-foreground" },
  { name: "Cashback text on card", background: "card", foreground: "cashback" },
  { name: "Region (EU) on card", background: "card", foreground: "region-eu" },
  { name: "Region (alt) on card", background: "card", foreground: "region-alt" },
  { name: "Placeholder on page", background: "background", foreground: "placeholder" },
  { name: "Footer", background: "surface-footer", foreground: "muted-foreground" },
]

const palette: { group: string; tokens: { token: string; use: string }[] }[] = [
  {
    group: "Surfaces",
    tokens: [
      { token: "background", use: "Page purple" },
      { token: "surface-nav", use: "Category nav bar" },
      { token: "surface-deep", use: "Alternating band" },
      { token: "surface-tile", use: "Category tiles" },
      { token: "card", use: "Card body" },
      { token: "surface-footer", use: "Footer" },
    ],
  },
  {
    group: "Actions",
    tokens: [
      { token: "primary", use: "Solid CTA" },
      { token: "primary-hover", use: "CTA hover" },
      { token: "border-strong", use: "Outline buttons, search" },
      { token: "ring", use: "Focus ring" },
    ],
  },
  {
    group: "Accents & text",
    tokens: [
      { token: "highlight", use: "Cashback, card outline" },
      { token: "cashback", use: "Cashback amount" },
      { token: "region-eu", use: "Region label" },
      { token: "region-alt", use: "Region / discount" },
      { token: "muted-foreground", use: "Secondary text" },
      { token: "placeholder", use: "Input placeholder" },
    ],
  },
]

const typeScale = [
  { token: "type-display", spec: "40 / 1.15 / 800", use: "Hero promos", sample: "It's happening" },
  { token: "type-h1", spec: "32 / 1.2 / 700", use: "Page titles", sample: "Categories" },
  { token: "type-h2", spec: "24 / 1.25 / 700", use: "Section titles", sample: "Recommended for you" },
  { token: "type-h3", spec: "18 / 1.35 / 600", use: "Tile labels", sample: "Adventure" },
  { token: "type-price", spec: "24 / 1.2 / 700", use: "Prices", sample: "€82.44" },
  { token: "type-nav", spec: "16 / 1.5 / 500", use: "Header nav, side menu", sample: "Cheap Games" },
  { token: "type-card-title", spec: "14 / 1.45 / 600", use: "Product names", sample: "Grand Theft Auto VI (PS5) PSN Key EUROPE" },
  { token: "type-body", spec: "14 / 1.5 / 400", use: "Running text", sample: "You can unsubscribe at any time." },
  { token: "type-label", spec: "13 / 1.35 / 600", use: "Region, From, buttons", sample: "Cashback: €9.07" },
  { token: "type-caption", spec: "12 / 1.4 / 400", use: "Legal, footnotes", sample: "Copyright © 2026 Eneba." },
]

export function Foundations() {
  return (
    <Section
      id="foundations"
      title="Foundations"
      description="Colors sampled from the homepage designs. Every value lives in globals.css; components only reference tokens."
    >
      <Specimen title="Color roles">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pairs.map((pair) => (
            <ColorPair key={pair.name} {...pair} />
          ))}
        </div>
      </Specimen>

      <Specimen title="Palette">
        <div className="flex flex-col gap-6">
          {palette.map(({ group, tokens }) => (
            <div key={group} className="flex flex-col gap-3">
              <p className="type-label text-muted-foreground">{group}</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {tokens.map(({ token, use }) => (
                  <div key={token} className="flex flex-col gap-2">
                    <div
                      className="h-16 border border-border"
                      style={{ backgroundColor: `var(--${token})` }}
                    />
                    <div className="flex flex-col">
                      <span className="type-label">{use}</span>
                      <code className="type-caption text-muted-foreground">--{token}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Specimen>

      <Specimen title="Typography · Metropolis">
        <div className="overflow-x-auto">
          <table className="w-full min-w-xl border-collapse text-left">
            <thead className="type-caption text-muted-foreground">
              <tr>
                <th className="py-2 pr-4 font-normal">Token</th>
                <th className="py-2 pr-4 font-normal">Size / line / weight</th>
                <th className="py-2 pr-4 font-normal">Use</th>
                <th className="py-2 font-normal">Specimen</th>
              </tr>
            </thead>
            <tbody>
              {typeScale.map((row) => (
                <tr key={row.token} className="border-t border-border">
                  <td className="py-3 pr-4">
                    <code className="type-caption">{row.token}</code>
                  </td>
                  <td className="py-3 pr-4 type-caption text-muted-foreground">{row.spec}</td>
                  <td className="py-3 pr-4 type-caption text-muted-foreground">{row.use}</td>
                  <td className="max-w-md truncate py-3">
                    <span className={row.token}>{row.sample}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Specimen>

      <Specimen title="Shape & elevation">
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col gap-2">
            <div className="size-24 bg-card ring-1 ring-highlight" />
            <span className="type-caption text-muted-foreground">radius 0 · everything</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="size-24 bg-surface-tile shadow-lg" />
            <span className="type-caption text-muted-foreground">shadow-lg · tiles</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="size-24 border border-border-strong" />
            <span className="type-caption text-muted-foreground">1px white · outline</span>
          </div>
        </div>
      </Specimen>
    </Section>
  )
}
