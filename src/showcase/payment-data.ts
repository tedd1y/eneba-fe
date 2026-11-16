import type { PaymentMethod } from '@/components/payment/types'

/** Payment methods from design/brand/payment. Dummy until there's a payments API. */
export const paymentMethods: PaymentMethod[] = [
  { id: 'wallet', name: 'Eneba Wallet', description: 'Pay with your Eneba wallet money', logo: 'eneba', logoLabel: 'eneba wallet' },
  { id: 'card', name: 'Credit or debit card', description: 'Pay via Visa, Mastercard, or Maestro debit or credit card', logo: 'card', logoLabel: 'VISA' },
  { id: 'paypal', name: 'PayPal', logo: 'paypal', logoLabel: 'PayPal' },
  { id: 'swedbank', name: 'Swedbank', logo: 'swedbank', logoLabel: 'Swedbank' },
  { id: 'seb', name: 'SEB', logo: 'seb', logoLabel: 'SEB' },
  { id: 'luminor', name: 'Luminor', logo: 'luminor', logoLabel: 'Luminor' },
  { id: 'revolut', name: 'Revolut', logo: 'revolut', logoLabel: 'Revolut' },
  { id: 'artea', name: 'Artea', logo: 'artea', logoLabel: 'Artea' },
  { id: 'lku', name: 'LKU', logo: 'lku', logoLabel: 'LKU' },
  { id: 'apple-pay', name: 'Apple Pay', description: 'Pay with Apple Pay', logo: 'apple-pay', logoLabel: 'Apple Pay' },
  { id: 'google-pay', name: 'Google Pay', description: 'Pay with Google Pay', logo: 'google-pay', logoLabel: 'G Pay' },
  { id: 'citadele', name: 'Citadele', logo: 'citadele', logoLabel: 'Citadele' },
  { id: 'crypto', name: 'Crypto currencies', description: 'Pay with your selected crypto currency', logo: 'crypto', logoLabel: 'Crypto' },
]

export const paymentLegal = {
  terms: { label: 'Terms and Conditions', href: '#' },
  privacy: { label: 'Privacy Notice', href: '#' },
  cookies: { label: 'Cookies', href: '#' },
}
