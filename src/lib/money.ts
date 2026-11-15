const formatters = new Map<string, Intl.NumberFormat>()

/** Minor units (cents) → localized currency string: 205 → "€2.05". */
export function formatMoney(cents: number, currency = 'EUR', locale = 'en-IE') {
  const key = `${locale}:${currency}`
  let formatter = formatters.get(key)
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, { style: 'currency', currency })
    formatters.set(key, formatter)
  }
  return formatter.format(cents / 100)
}
