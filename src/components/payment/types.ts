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
