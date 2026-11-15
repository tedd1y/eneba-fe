import type { Product } from '@/components/product/product-card'
import type { DonationAmount } from '@/showcase/cart/donation-panel'
import type { Consent } from '@/showcase/cart/cart-summary'
import type { CheckoutStep } from '@/showcase/cart/types'

/** Sample cart for the styleguide. Prices in cents so the demo can total them. */
export type CartSeed = {
  id: string
  title: string
  seller: { name: string, initials: string }
  cover: string
  unitPrice: number
  cashbackPercent: number
  quantity: number
}

export const cartSeed: CartSeed[] = [
  {
    id: 'bread-fred',
    title: 'Bread & Fred (PC) Steam Key EUROPE',
    seller: { name: 'NextLevel', initials: 'NL' },
    cover: 'bg-linear-to-br from-highlight via-surface-tile to-region-alt',
    unitPrice: 205,
    cashbackPercent: 14,
    quantity: 1,
  },
  {
    id: 'overcooked',
    title: 'Overcooked! 2 (PC) Steam Key EUROPE',
    seller: { name: 'GearUp', initials: 'GU' },
    cover: 'bg-linear-to-br from-chart-5 to-discount',
    unitPrice: 554,
    cashbackPercent: 11,
    quantity: 2,
  },
]

export const checkoutSteps: CheckoutStep[] = [
  { id: 'cart', label: 'Cart' },
  { id: 'payment', label: 'Payment' },
  { id: 'deliver', label: 'Get your product' },
]

export const donationAmounts: DonationAmount[] = [50, 100, 200, 500, 1000].map(c => ({
  value: String(c),
  label: `€${(c / 100).toFixed(2)}`,
}))

/** Running pledge totals in cents (Eneba matches 100%). */
export const donationTotals = { eneba: 1_000_000, community: 297_000 }

export const consents: Consent[] = [
  { id: 'reviews', label: 'I agree to receive an email invitation to review the service on Trustpilot' },
  { id: 'offers', label: 'I want to receive personalized offers for the best game deals' },
]

/** Codes the demo accepts: code → percent off. */
export const discountCodes: Record<string, number> = { SAVE10: 10, WELCOME5: 5 }

export const picks: Product[] = [
  { title: 'Overcooked! 2 (PC) Steam Key EUROPE', platform: 'Steam', region: 'Europe', price: '€5.54', cashback: '€0.61', cover: 'bg-linear-to-br from-chart-5 to-discount' },
  { title: 'Kitty Powers\' Matchmaker Steam Key GLOBAL', platform: 'Steam', region: 'Global', price: '€5.24', cashback: '€0.58', cover: 'bg-linear-to-br from-region-alt to-surface-tile' },
  { title: 'Mobile Legends – 1155 Diamonds Mobilelegends.com Key GLOBAL', platform: 'Mobile Legends', region: 'Global', price: '€19.30', cashback: '€1.16', cover: 'bg-linear-to-br from-primary to-card' },
  { title: 'Overcooked! 2 Steam Key GLOBAL', platform: 'Steam', region: 'Global', price: '€5.50', cashback: '€0.61', cover: 'bg-linear-to-br from-chart-5 to-region-alt' },
  { title: 'Mobile Legends – 275 Diamonds Mobilelegends.com Key GLOBAL', platform: 'Mobile Legends', region: 'Global', price: '€4.78', cashback: '€0.29', cover: 'bg-linear-to-br from-region-eu to-card' },
]
