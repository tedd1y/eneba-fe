export type PageItem = number | 'ellipsis-start' | 'ellipsis-end'

/**
 * Page numbers to render, Eneba style: `1 2 3 4 5 … 123` near the start,
 * `1 … 9 10 11 … 123` in the middle, `1 … 119 120 121 122 123` near the end.
 * `siblings` is how many pages show on each side of the current one in the middle state.
 */
export function getPageItems(page: number, pageCount: number, siblings = 1): PageItem[] {
  const range = (from: number, to: number) =>
    Array.from({ length: to - from + 1 }, (_, i) => from + i)

  // first + last + current + siblings on both sides + two ellipses
  const slots = siblings * 2 + 5
  if (pageCount <= slots) return range(1, pageCount)

  const edge = slots - 2 // pages shown in a run touching the first/last page
  if (page <= edge - siblings) return [...range(1, edge), 'ellipsis-end', pageCount]
  if (page >= pageCount - edge + siblings + 1) {
    return [1, 'ellipsis-start', ...range(pageCount - edge + 1, pageCount)]
  }
  return [1, 'ellipsis-start', ...range(page - siblings, page + siblings), 'ellipsis-end', pageCount]
}
