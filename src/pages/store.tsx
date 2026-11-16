import { Section } from '@/showcase/section.tsx'
import { FilterSection, FilterSidebar } from '@/components/store/filter-section.tsx'
import { FilterSheet } from '@/components/store/filter-sheet.tsx'
import { RangeFilter, type RangeValue } from '@/components/store/range-filter.tsx'
import { CheckboxFilter } from '@/components/store/checkbox-filter.tsx'
import { ComboboxFilter } from '@/components/store/combobox-filter.tsx'
import { ResultsCount, SortSelect, type SortOption } from '@/components/store/sort-select.tsx'
import { StorePagination } from '@/components/store/store-pagination.tsx'
import { XIcon } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'
import { type ActiveFilterGroup, ActiveFilters } from '@/components/store/active-filters.tsx'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { v1ProductsFiltersIndexOptions, v1ProductsIndexOptions } from '@/client/@tanstack/react-query.gen.ts'
import type { FilterOptionResource, ProductResource, ProductSort } from '@/client'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toProductsQuery, useStoreParams } from '@/lib/store-params'
import type { FilterOption } from '@/components/store/types.ts'
import { useDebouncedValue } from '@/lib/use-debounced-value.ts'
import { ProductCard, ProductCardRow } from '@/components/product/product-card.tsx'
import { useCartStore } from '@/stores/cart'

/** Store sort menu → API `sort` param (leading `-` = descending). */
const sortOptions: (SortOption & { value: ProductSort })[] = [
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: 'created_at', label: 'Date: Oldest First' },
  { value: '-created_at', label: 'Date: Newest First' },
  { value: 'title', label: 'Alphabet: A-Z' },
  { value: '-title', label: 'Alphabet: Z-A' },
]

/** Checkbox facets; the keys are the URL param names (see lib/store-params). */
type FacetKey = 'types' | 'os' | 'drms' | 'regions' | 'genres'

/** Sidebar and chip order follows the design: Type, Operating system, Platforms, then Regions and Genres. */
const facetLabels: Record<FacetKey, string> = {
  types: 'Type',
  os: 'Operating system',
  drms: 'Platforms',
  regions: 'Regions',
  genres: 'Genres',
}

/** Maps API filter options onto the `FilterOption` shape the store filters expect. */
function toFilterOptions(options: FilterOptionResource[] = []): FilterOption[] {
  return options.map(o => ({ value: o.value, label: o.label, count: o.count }))
}

/** Maps an API product onto the `Product` shape <ProductCard> renders. */
function toCardProps(p: ProductResource) {
  return {
    title: p.title,
    platform: p.platform.label,
    region: p.region.label,
    regionTone: p.region.value === 'europe' ? 'eu' as const : 'alt' as const,
    price: p.price.formatted,
    oldPrice: p.original_price?.formatted,
    discount: p.discount_percent > 0 ? `-${p.discount_percent}%` : undefined,
    cashback: p.cashback?.formatted,
    // ProductCard has no image slot yet; token gradient placeholder until it does.
    cover: 'bg-linear-to-br from-surface-tile to-primary',
  }
}

/**
 * Store listing. All filter state lives in the URL (lib/store-params), so links, reloads and
 * back/forward restore the same filters and results. Filter, search and sort changes reset to page 1.
 */
function WiredStore() {
  const addToCart = useCartStore(s => s.add)
  const [params, setParams] = useStoreParams()

  // Price inputs update locally while typing; the URL (and API) follow after a pause.
  const [price, setPrice] = useState<RangeValue>([params.priceMin, params.priceMax])
  const debouncedPrice = useDebouncedValue(price)
  useEffect(() => {
    const [min, max] = debouncedPrice
    if (min !== params.priceMin || max !== params.priceMax) void setParams({ priceMin: min, priceMax: max, page: null })
    // Only react to the user's typing, not to URL changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedPrice])
  // URL changed from elsewhere (back/forward, "Clear all", a pasted link): show it in the inputs.
  // Adjusting state during render on a prop change, per https://react.dev/learn/you-might-not-need-an-effect
  const [urlPrice, setUrlPrice] = useState<RangeValue>([params.priceMin, params.priceMax])
  if (urlPrice[0] !== params.priceMin || urlPrice[1] !== params.priceMax) {
    setUrlPrice([params.priceMin, params.priceMax])
    setPrice([params.priceMin, params.priceMax])
  }

  const { data: filters } = useQuery(v1ProductsFiltersIndexOptions())
  const facetOptions: Record<FacetKey, FilterOption[]> = {
    types: toFilterOptions(filters?.data.types),
    os: toFilterOptions(filters?.data.operating_systems),
    drms: toFilterOptions(filters?.data.platforms),
    regions: toFilterOptions(filters?.data.regions),
    genres: toFilterOptions(filters?.data.genres),
  }
  const countryOptions = toFilterOptions(filters?.data.countries)
  const countryLabel = countryOptions.find(o => o.value === params.country)?.label ?? params.country
  const priceMin = Math.floor((filters?.data.price.min?.amount ?? 0) / 100)
  const priceMax = Math.ceil((filters?.data.price.max?.amount ?? 50000) / 100)

  const { data } = useQuery({
    ...v1ProductsIndexOptions({ query: toProductsQuery(params) }),
    // Keep the current page on screen while the next one loads.
    placeholderData: keepPreviousData,
  })

  const goToPage = (next: number) => {
    void setParams({ page: next })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const setFacet = (key: FacetKey) => (value: string[]) => {
    // Values come from the API's own option lists; the URL parser re-validates them on read.
    void setParams({ [key]: value, page: null } as Parameters<typeof setParams>[0])
  }

  const groups: ActiveFilterGroup[] = (Object.keys(facetLabels) as FacetKey[]).map(key => ({
    id: key,
    label: facetLabels[key],
    options: facetOptions[key],
    value: params[key],
  }))

  const results = data?.meta.total ?? 0
  const pageCount = data?.meta.last_page ?? 1

  const clearAll = () => void setParams({ drms: null, regions: null, types: null, genres: null, os: null, country: null, priceMin: null, priceMax: null, search: null, page: null })
  const setSort = (value: string) => void setParams({ sort: value as ProductSort, page: null })
  // "Sort and filter (n)": how many filter groups are in use (each facet, price, country).
  const activeCount = groups.filter(g => g.value.length > 0).length
    + (params.priceMin !== null || params.priceMax !== null ? 1 : 0)
    + (params.country ? 1 : 0)
  const hasChips = groups.some(g => g.value.length > 0) || Boolean(params.search || params.country)

  // Same sections in the desktop sidebar and the tablet/phone sheet.
  const filterSections = (
    <>
      <FilterSection title="Price range (EUR)">
        <RangeFilter min={priceMin} max={priceMax} value={price} onValueChange={setPrice} labels={['Minimum price', 'Maximum price']} />
      </FilterSection>
      <FilterSection title="Country">
        <ComboboxFilter
          label="Country"
          placeholder="All countries"
          options={countryOptions}
          value={params.country}
          onValueChange={country => void setParams({ country, page: null })}
        />
      </FilterSection>
      <FilterSection title="Type" count={params.types.length}>
        <CheckboxFilter options={facetOptions.types} value={params.types} onValueChange={setFacet('types')} />
      </FilterSection>
      <FilterSection title="Operating system" count={params.os.length}>
        <CheckboxFilter options={facetOptions.os} value={params.os} onValueChange={setFacet('os')} />
      </FilterSection>
      <FilterSection title="Platforms" count={params.drms.length}>
        <CheckboxFilter searchable searchLabel="Search platforms" options={facetOptions.drms} value={params.drms} onValueChange={setFacet('drms')} />
      </FilterSection>
      <FilterSection title="Genres" count={params.genres.length}>
        <CheckboxFilter searchable searchLabel="Search genres" options={facetOptions.genres} value={params.genres} onValueChange={setFacet('genres')} />
      </FilterSection>
      <FilterSection title="Regions" count={params.regions.length}>
        <CheckboxFilter searchable searchLabel="Search regions" options={facetOptions.regions} value={params.regions} onValueChange={setFacet('regions')} />
      </FilterSection>
    </>
  )

  return (
    <div className="grid gap-6 nav:grid-cols-[14rem_1fr]">
      {/* Desktop: sidebar. Tablet / phone: the "Sort and filter" sheet below. */}
      <FilterSidebar className="max-nav:hidden">{filterSections}</FilterSidebar>

      <div className="flex min-w-0 flex-col gap-6">
        {/* Tablet / phone: one row that scrolls sideways, like the reference. */}
        <div className="flex items-center gap-4 max-nav:-mx-4 max-nav:overflow-x-auto max-nav:px-4 max-nav:[scrollbar-width:none] nav:flex-wrap [&_button]:shrink-0">
          <div className="flex shrink-0 items-center gap-4 nav:hidden">
            <FilterSheet
              activeCount={activeCount}
              sortOptions={sortOptions}
              sort={params.sort}
              onSortChange={setSort}
              resultsCount={results}
              onClearAll={clearAll}
            >
              {filterSections}
            </FilterSheet>
            {hasChips && <Separator orientation="vertical" className="h-8 bg-foreground/60 data-vertical:self-center" />}
          </div>
          <ActiveFilters
            className="max-nav:flex-nowrap"
            groups={groups}
            onValueChange={(id, value) => setFacet(id as FacetKey)(value)}
            onClearAll={clearAll}
            extra={(params.search || params.country) && (
              <>
                {params.country && (
                  <Button variant="chip" size="sm" aria-label={`Remove country ${countryLabel}`} onClick={() => void setParams({ country: null, page: null })}>
                    Country:
                    {' '}
                    {countryLabel}
                    <XIcon data-icon="inline-end" />
                  </Button>
                )}
                {params.search && (
                  <Button variant="chip" size="sm" aria-label={`Remove search "${params.search}"`} onClick={() => void setParams({ search: null, page: null })}>
                    Search: “
                    {params.search}
                    ”
                    <XIcon data-icon="inline-end" />
                  </Button>
                )}
              </>
            )}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <ResultsCount count={results} />
          {/* Tablet / phone sort from the sheet instead. */}
          <div className="max-nav:hidden">
            <SortSelect options={sortOptions} value={params.sort} onValueChange={setSort} />
          </div>
        </div>
        {/* Phone: one column of horizontal row cards. Tablet and up: the vertical card grid. */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {data?.data.map((p) => {
            const card = toCardProps(p)
            return (
              <Fragment key={p.id}>
                <ProductCardRow product={card} offersHref={`/${p.slug}`} onAddToCart={() => addToCart(p.id)} className="sm:hidden" />
                <ProductCard product={card} offersHref={`/${p.slug}`} onAddToCart={() => addToCart(p.id)} className="max-sm:hidden" />
              </Fragment>
            )
          })}
        </div>
        <StorePagination pageCount={pageCount} page={data?.meta.current_page ?? params.page} onPageChange={goToPage} />
      </div>
    </div>
  )
}

export function Store() {
  return (
    <div>
      <Section
        id="store"
        title="Store"
      >
        <WiredStore />
      </Section>
    </div>
  )
}
