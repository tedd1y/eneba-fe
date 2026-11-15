import { Header } from '@/components/layout/header.tsx'
import { Section } from '@/showcase/section.tsx'
import { FilterSection, FilterSidebar } from '@/components/store/filter-section.tsx'
import { RangeFilter, type RangeValue } from '@/components/store/range-filter.tsx'
import { ComboboxFilter } from '@/components/store/combobox-filter.tsx'
import { countries, operatingSystems, platforms, regions, sortOptions, types } from '@/showcase/store-data.ts'
import { CheckboxFilter } from '@/components/store/checkbox-filter.tsx'
import { ResultsCount, SortSelect } from '@/components/store/sort-select.tsx'
import { StorePagination } from '@/components/store/store-pagination.tsx'
import { useState } from 'react'
import { type ActiveFilterGroup, ActiveFilters } from '@/components/store/active-filters.tsx'
import {useQuery} from "@tanstack/react-query";
import {v1ProductsIndexOptions} from "@/client/@tanstack/react-query.gen.ts";
import type {ProductResource} from "@/client";
import { ProductCard } from '@/components/product/product-card.tsx'

type MultiKey = 'type' | 'os' | 'platform' | 'region'

const facets: Record<MultiKey, { label: string, options: typeof types }> = {
  type: { label: 'Type', options: types },
  os: { label: 'Operating system', options: operatingSystems },
  platform: { label: 'Platforms', options: platforms },
  region: { label: 'Regions', options: regions },
}

const emptyMulti: Record<MultiKey, string[]> = { type: [], os: [], platform: [], region: [] }

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

/** Every store control wired to one state object, the way the store page will use them. */
function WiredStore() {

  const { data, isLoading, isError } = useQuery(
      v1ProductsIndexOptions({ query: { per_page: 20 } })
  )

  const [price, setPrice] = useState<RangeValue>([null, null])
  const [country, setCountry] = useState<string | null>(null)
  const [multi, setMulti] = useState<Record<MultiKey, string[]>>({
    ...emptyMulti,
    type: ['game'],
    region: ['global', 'europe', 'rest-of-the-world', 'emea', 'lithuania'],
  })
  const [sort, setSort] = useState(sortOptions[0].value)
  const [page, setPage] = useState(1)

  const setFacet = (key: MultiKey) => (value: string[]) => {
    setMulti(m => ({ ...m, [key]: value }))
    setPage(1)
  }

  const groups: ActiveFilterGroup[] = (Object.keys(facets) as MultiKey[]).map(key => ({
    id: key,
    label: facets[key].label,
    options: facets[key].options,
    value: multi[key],
  }))

  // Fake result count that reacts to filters so the demo feels live.
  const selectedCount = Object.values(multi).flat().length
  const results = Math.max(12, 2449 - selectedCount * 137 - (country ? 400 : 0))
  const pageCount = Math.ceil(results / 20)

  return (
    <div className="grid gap-6 md:grid-cols-[14rem_1fr]">
      <FilterSidebar>
        <FilterSection title="Price range (EUR)">
          <RangeFilter min={0} max={500} value={price} onValueChange={setPrice} labels={['Minimum price', 'Maximum price']} />
        </FilterSection>
        <FilterSection title="Country">
          <ComboboxFilter label="Country" placeholder="All countries" options={countries} value={country} onValueChange={setCountry} />
        </FilterSection>
        <FilterSection title="Type" count={multi.type.length}>
          <CheckboxFilter options={types} value={multi.type} onValueChange={setFacet('type')} />
        </FilterSection>
        <FilterSection title="Operating system" count={multi.os.length}>
          <CheckboxFilter options={operatingSystems} value={multi.os} onValueChange={setFacet('os')} />
        </FilterSection>
        <FilterSection title="Platforms" count={multi.platform.length}>
          <CheckboxFilter searchable searchLabel="Search platforms" options={platforms} value={multi.platform} onValueChange={setFacet('platform')} />
        </FilterSection>
        <FilterSection title="Regions" count={multi.region.length}>
          <CheckboxFilter searchable searchLabel="Search regions" options={regions} value={multi.region} onValueChange={setFacet('region')} />
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
          <SortSelect options={sortOptions} value={sort} onValueChange={setSort} />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {data?.data.map(p => (
            <ProductCard key={p.id} product={toCardProps(p)} offersHref={`/products/${p.slug}`} />
          ))}
        </div>
        <StorePagination pageCount={pageCount} page={Math.min(page, pageCount)} onPageChange={setPage} />
      </div>
    </div>
  )
}

export function Store() {
  return (
    <div>
      <Header />
      <Section
        id="store"
        title="Store filters"
      >
        <WiredStore />
      </Section>
    </div>
  )
}
