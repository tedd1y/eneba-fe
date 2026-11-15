import { Section } from '@/showcase/section.tsx'
import { FilterSection, FilterSidebar } from '@/components/store/filter-section.tsx'
import { RangeFilter, type RangeValue } from '@/components/store/range-filter.tsx'
import { CheckboxFilter } from '@/components/store/checkbox-filter.tsx'
import { ResultsCount, SortSelect, type SortOption } from '@/components/store/sort-select.tsx'
import { StorePagination } from '@/components/store/store-pagination.tsx'
import { useState } from 'react'
import { type ActiveFilterGroup, ActiveFilters } from '@/components/store/active-filters.tsx'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { v1ProductsFiltersIndexOptions, v1ProductsIndexOptions } from '@/client/@tanstack/react-query.gen.ts'
import type { FilterOptionResource, Platform, ProductResource, ProductSort, ProductType } from '@/client'
import type { FilterOption } from '@/components/store/types.ts'
import { useDebouncedValue } from '@/lib/use-debounced-value.ts'
import { ProductCard } from '@/components/product/product-card.tsx'

/** Store sort menu → API `sort` param (leading `-` = descending). */
const sortOptions: (SortOption & { value: ProductSort })[] = [
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: 'created_at', label: 'Date: Oldest First' },
  { value: '-created_at', label: 'Date: Newest First' },
  { value: 'title', label: 'Alphabet: A-Z' },
  { value: '-title', label: 'Alphabet: Z-A' },
]

type MultiKey = 'type' | 'platform'

const facetLabels: Record<MultiKey, string> = { type: 'Type', platform: 'Platforms' }

const emptyMulti: Record<MultiKey, string[]> = { type: [], platform: [] }

/** Maps API filter options onto the `FilterOption` shape the store filters expect. */
function toFilterOptions(options: FilterOptionResource[] = []): FilterOption[] {
  return options.map(o => ({ value: o.value, label: o.label, count: o.count }))
}

/** EUR from the range inputs → cents for the API; null stays "no limit". */
const toCents = (eur: number | null) => (eur === null ? undefined : Math.round(eur * 100))

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

function WiredStore() {
  const [price, setPrice] = useState<RangeValue>([null, null])
  const [multi, setMulti] = useState<Record<MultiKey, string[]>>(emptyMulti)
  const [sort, setSort] = useState<ProductSort>(sortOptions[0].value)
  const [page, setPage] = useState(1)

  // Price is typed digit by digit; wait for a pause before refetching.
  const [minPrice, maxPrice] = useDebouncedValue(price)

  const { data: filters } = useQuery(v1ProductsFiltersIndexOptions())
  const typeOptions = toFilterOptions(filters?.data.types)
  const platformOptions = toFilterOptions(filters?.data.platforms)
  const priceMin = Math.floor((filters?.data.price.min?.amount ?? 0) / 100)
  const priceMax = Math.ceil((filters?.data.price.max?.amount ?? 50000) / 100)

  const { data, isLoading, isError } = useQuery({
    ...v1ProductsIndexOptions({
      query: {
        page,
        'per_page': 20,
        'type[]': multi.type as ProductType[],
        'platform[]': multi.platform as Platform[],
        'min_price': toCents(minPrice),
        'max_price': toCents(maxPrice),
        sort,
      },
    }),
    // Keep the current page on screen while the next one loads.
    placeholderData: keepPreviousData,
  })

  const goToPage = (next: number) => {
    setPage(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const setFacet = (key: MultiKey) => (value: string[]) => {
    setMulti(m => ({ ...m, [key]: value }))
    setPage(1)
  }

  const setPriceRange = (value: RangeValue) => {
    setPrice(value)
    setPage(1)
  }

  const facetOptions: Record<MultiKey, FilterOption[]> = { type: typeOptions, platform: platformOptions }
  const groups: ActiveFilterGroup[] = (Object.keys(facetLabels) as MultiKey[]).map(key => ({
    id: key,
    label: facetLabels[key],
    options: facetOptions[key],
    value: multi[key],
  }))

  const results = data?.meta.total ?? 0
  const pageCount = data?.meta.last_page ?? 1

  return (
    <div className="grid gap-6 md:grid-cols-[14rem_1fr]">
      <FilterSidebar>
        <FilterSection title="Price range (EUR)">
          <RangeFilter min={priceMin} max={priceMax} value={price} onValueChange={setPriceRange} labels={['Minimum price', 'Maximum price']} />
        </FilterSection>
        <FilterSection title="Type" count={multi.type.length}>
          <CheckboxFilter options={typeOptions} value={multi.type} onValueChange={setFacet('type')} />
        </FilterSection>
        <FilterSection title="Platforms" count={multi.platform.length}>
          <CheckboxFilter searchable options={platformOptions} value={multi.platform} onValueChange={setFacet('platform')} />
        </FilterSection>
      </FilterSidebar>

      <div className="flex min-w-0 flex-col gap-6">
        <ActiveFilters
          groups={groups}
          onValueChange={(id, value) => setFacet(id as MultiKey)(value)}
          onClearAll={() => {
            setMulti(emptyMulti)
            setPage(1)
          }}
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <ResultsCount count={results} />
          <SortSelect
            options={sortOptions}
            value={sort}
            onValueChange={(value) => {
              setSort(value as ProductSort)
              setPage(1)
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {data?.data.map(p => (
            <ProductCard key={p.id} product={toCardProps(p)} offersHref={`/${p.slug}`} />
          ))}
        </div>
        <StorePagination pageCount={pageCount} page={data?.meta.current_page ?? page} onPageChange={goToPage} />
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
