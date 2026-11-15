/** One line in the cart. Prices are already formatted for display. */
export type CartLine = {
  id: string
  title: string
  seller: { name: string, initials: string }
  /** Image URL; falls back to `cover` token classes when missing. */
  image?: string
  cover: string
  /** Unit price, formatted ("€2.05"). */
  price: string
  /** Cashback for the line, formatted ("€0.29"). */
  cashback?: string
  quantity: number
  /** "Digital product" note under the title. */
  note?: string
}

export type CheckoutStep = { id: string, label: string }

/** Summary row: "1 product — €2.05", "Service fee — --". */
export type SummaryRow = { label: string, value: string, hint?: string }
