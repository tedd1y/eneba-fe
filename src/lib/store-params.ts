import {
  createSerializer,
  parseAsFloat,
  parseAsInteger,
  parseAsNativeArrayOf,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from 'nuqs'

import type { ProductSort, V1ProductsIndexData } from '@/client'

/**
 * Store filters ⇄ URL ⇄ API, all in one place.
 *
 *   /store/all?drms[]=steam&types[]=game&types[]=dlc&regions[]=europe&genres[]=rpg&os[]=windows
 *             &country=lt&price_min=10&price_max=50&sort=-price&page=2&search=elden
 *
 * Arrays use repeated bracketed keys. Defaults (no filters, sort=price, page 1, empty search)
 * are left out of the URL. Filter values are database slugs, passed through as plain strings.
 */

export const SORTS = ['price', '-price', 'created_at', '-created_at', 'title', '-title'] as const satisfies readonly ProductSort[]

export const DEFAULT_SORT: ProductSort = 'price'
export const PAGE_SIZE = 20

export const storeParsers = {
  drms: parseAsNativeArrayOf(parseAsString),
  regions: parseAsNativeArrayOf(parseAsString),
  types: parseAsNativeArrayOf(parseAsString),
  genres: parseAsNativeArrayOf(parseAsString),
  os: parseAsNativeArrayOf(parseAsString),
  /** ISO 3166-1 alpha-2 code: products that can be activated in this country. */
  country: parseAsString,
  /** Euros. */
  priceMin: parseAsFloat,
  /** Euros. */
  priceMax: parseAsFloat,
  sort: parseAsStringLiteral(SORTS).withDefault(DEFAULT_SORT),
  page: parseAsInteger.withDefault(1),
  search: parseAsString.withDefault(''),
}

/** State key → URL key. Keys not listed use their own name (country, sort, page, search). */
export const storeUrlKeys = {
  drms: 'drms[]',
  regions: 'regions[]',
  types: 'types[]',
  genres: 'genres[]',
  os: 'os[]',
  priceMin: 'price_min',
  priceMax: 'price_max',
} as const

const options = { urlKeys: storeUrlKeys, clearOnDefault: true } as const

/** Read/write the store filters in the URL. Filter, search and sort setters should also reset `page`. */
export function useStoreParams() {
  return useQueryStates(storeParsers, { ...options, history: 'push' })
}

export type StoreParams = ReturnType<typeof useStoreParams>[0]

/** Builds `?…` for the store from partial params, e.g. for links and the header search. */
export const serializeStoreParams = createSerializer(storeParsers, options)

const toCents = (eur: number | null) => (eur === null ? undefined : Math.round(eur * 100))
const orUndefined = <T>(list: T[]) => (list.length > 0 ? list : undefined)

/** URL params → `/v1/products` query. The only place URL names meet API names. */
export function toProductsQuery(params: StoreParams): NonNullable<V1ProductsIndexData['query']> {
  return {
    'platform[]': orUndefined(params.drms),
    'region[]': orUndefined(params.regions),
    'type[]': orUndefined(params.types),
    'genre[]': orUndefined(params.genres),
    'os[]': orUndefined(params.os),
    'country': params.country || undefined,
    'min_price': toCents(params.priceMin),
    'max_price': toCents(params.priceMax),
    'sort': params.sort,
    'page': params.page,
    'per_page': PAGE_SIZE,
    'search': params.search || undefined,
  }
}

/**
 * Store URL for a header search: keeps the current store filters (when already on the store),
 * sets `search`, and resets to page 1. An empty term removes the search.
 */
export function storeSearchUrl(term: string, location: { pathname: string, search: string }) {
  const onStore = location.pathname.startsWith('/store/')
  const params = new URLSearchParams(onStore ? location.search : '')
  params.delete('page')
  if (term) params.set('search', term)
  else params.delete('search')
  // Keep `drms[]` readable like nuqs writes it, instead of URLSearchParams' `drms%5B%5D`.
  const query = params.toString().replace(/%5B%5D=/g, '[]=')
  return `${onStore ? location.pathname : '/store/all'}${query ? `?${query}` : ''}`
}
