import { useState } from 'react'

import { ActiveFilters, type ActiveFilterGroup } from '@/components/store/active-filters'
import { CheckboxFilter } from '@/components/store/checkbox-filter'
import { ComboboxFilter } from '@/components/store/combobox-filter'
import { FilterSection, FilterSidebar } from '@/components/store/filter-section'
import { RangeFilter, type RangeValue } from '@/components/store/range-filter'
import { ResultsCount, SortSelect } from '@/components/store/sort-select'
import { StorePagination } from '@/components/store/store-pagination'
import { Section, Specimen } from '@/showcase/section'
import {
  countries,
  operatingSystems,
  platforms,
  regions,
  sortOptions,
  types,
} from '@/showcase/store-data'

type MultiKey = 'type' | 'os' | 'platform' | 'region'

const facets: Record<MultiKey, { label: string, options: typeof types }> = {
  type: { label: 'Type', options: types },
  os: { label: 'Operating system', options: operatingSystems },
  platform: { label: 'Platforms', options: platforms },
  region: { label: 'Regions', options: regions },
}

const emptyMulti: Record<MultiKey, string[]> = { type: [], os: [], platform: [], region: [] }

/** Every store control wired to one state object, the way the store page will use them. */
function WiredStoreDemo() {
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
        <div className="grid min-h-48 place-items-center border border-dashed border-border p-6 text-center type-body text-muted-foreground">
          Product grid · page
          {' '}
          {page}
          {' '}
          of
          {' '}
          {pageCount}
          {' '}
          · sorted by “
          {sortOptions.find(s => s.value === sort)?.label}
          ”
        </div>
        <StorePagination pageCount={pageCount} page={Math.min(page, pageCount)} onPageChange={setPage} />
      </div>
    </div>
  )
}

export function Store() {
  return (
    <Section
      id="store"
      title="Store filters"
      description="Store page building blocks. Every control works uncontrolled (defaultValue) or controlled (value + onValueChange), and takes its options as data. Gold marks the active state: counts, the current page, “Clear all”, checked boxes."
    >
      <Specimen title="Wired together (try it)">
        <WiredStoreDemo />
      </Specimen>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Specimen title="Range">
          <FilterSidebar>
            <FilterSection title="Price range (EUR)">
              <RangeFilter min={0} max={200} defaultValue={[10, 80]} showSlider />
            </FilterSection>
          </FilterSidebar>
        </Specimen>

        <Specimen title="Combobox">
          <FilterSidebar>
            <FilterSection title="Country">
              <ComboboxFilter label="Country" placeholder="All countries" options={countries} />
            </FilterSection>
          </FilterSidebar>
        </Specimen>

        <Specimen title="Section collapsed">
          <FilterSidebar>
            <FilterSection title="Genres" count={2} defaultOpen={false}>
              <CheckboxFilter options={types} />
            </FilterSection>
          </FilterSidebar>
        </Specimen>

        <Specimen title="Multiselect">
          <FilterSidebar>
            <FilterSection title="Operating system">
              <CheckboxFilter options={operatingSystems} defaultValue={['windows']} />
            </FilterSection>
          </FilterSidebar>
        </Specimen>

        <Specimen title="Multiselect with search + “more”">
          <FilterSidebar>
            <FilterSection title="Platforms">
              <CheckboxFilter searchable searchLabel="Search platforms" options={platforms} />
            </FilterSection>
          </FilterSidebar>
        </Specimen>

        <Specimen title="Sort order">
          <div className="flex justify-start">
            <SortSelect options={sortOptions} />
          </div>
        </Specimen>
      </div>

      <Specimen title="Pagination · start, middle, end, short">
        <div className="flex flex-col gap-4">
          <StorePagination pageCount={123} defaultPage={1} />
          <StorePagination pageCount={123} defaultPage={10} />
          <StorePagination pageCount={123} defaultPage={123} />
          <StorePagination pageCount={4} defaultPage={2} />
        </div>
      </Specimen>
    </Section>
  )
}
