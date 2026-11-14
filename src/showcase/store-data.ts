import type { SortOption } from '@/components/store/sort-select'
import type { FilterOption } from '@/components/store/types'

/** Sample filter facets for the styleguide, taken from design/brand/store. */
const opt = (label: string, count: number): FilterOption => ({
  value: label.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  label,
  count,
})

export const countries: FilterOption[] = [
  'Lithuania',
  'Germany',
  'France',
  'Poland',
  'Spain',
  'Italy',
  'United Kingdom',
  'United States',
].map(label => ({ value: label.toLowerCase().replace(/\s+/g, '-'), label }))

export const types: FilterOption[] = [
  opt('Game', 68244),
  opt('DLC', 24203),
  opt('eGift Cards', 1897),
  opt('Game points', 1484),
  opt('E-money Prepaid', 1262),
  opt('Gaming eCards', 652),
  opt('Subscription', 258),
  opt('Direct Top-up', 67),
]

export const operatingSystems: FilterOption[] = [
  opt('Windows', 439),
  opt('Mac', 247),
  opt('Android', 196),
  opt('iOS', 185),
  opt('Linux', 32),
]

export const platforms: FilterOption[] = [
  opt('Kaspersky', 262),
  opt('Avast', 163),
  opt('Steam', 147),
  opt('AVG AntiVirus', 127),
  opt('Ashampoo', 116),
  opt('VPN', 102),
  opt('McAfee', 97),
  opt('MAGIX', 92),
  opt('Norton', 88),
  opt('ESET', 71),
  opt('Bitdefender', 64),
  opt('Microsoft', 58),
  opt('Adobe', 41),
  opt('EaseUS', 37),
]

export const regions: FilterOption[] = [
  opt('Global', 2034),
  opt('Europe', 391),
  opt('United States', 49),
  opt('Middle East', 36),
  opt('South Africa', 33),
  opt('United Kingdom', 32),
  opt('Central African Republic', 30),
  opt('RU/CIS', 30),
  opt('Latin America', 28),
  opt('Ireland', 25),
  opt('United Arab Emirates', 10),
  opt('Turkey', 7),
  opt('Rest of the World', 3),
  opt('EMEA', 0),
  opt('Lithuania', 0),
]

export const sortOptions: SortOption[] = [
  { value: 'popular', label: 'Popularity: Most popular' },
  { value: 'price-asc', label: 'Price: Low to high' },
  { value: 'price-desc', label: 'Price: High to low' },
  { value: 'newest', label: 'Release date: Newest' },
  { value: 'discount', label: 'Discount: Biggest first' },
]
