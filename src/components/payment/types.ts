/** Which mark the logo tile draws. */
export type PaymentLogo =
  | 'eneba'
  | 'card'
  | 'paypal'
  | 'swedbank'
  | 'seb'
  | 'luminor'
  | 'revolut'
  | 'artea'
  | 'lku'
  | 'apple-pay'
  | 'google-pay'
  | 'citadele'
  | 'crypto'

/** One selectable way to pay. */
export type PaymentMethod = {
  id: string
  name: string
  /** Second line ("Pay with your Eneba wallet money"). */
  description?: string
  logo: PaymentLogo
  /** Text in the logo tile (wordmark), e.g. "VISA", "PayPal". */
  logoLabel: string
}

/** A link inside the legal note ("Terms and Conditions"). */
export type LegalLink = { label: string, href: string }

/** One product on the "Get your product" page. Values are display-ready. */
export type DeliveryItem = {
  id: string
  title: string
  /** Box art URL; falls back to `cover` token classes. */
  image?: string
  cover: string
  /** Seller's activation instructions shown in the warning box. */
  activationNote?: string
  region: string
  platform: string
  productType: string
  /** Enebium (loyalty points) earned for this item. */
  enebium: number
  /** Number of keys bought. */
  quantity: number
  /** Activation keys (one per unit), revealed after the buyer confirms platform and region. */
  keys: string[]
  seller: { name: string, initials: string, positivePercent: string, ratings: string }
}
