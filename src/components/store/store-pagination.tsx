import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { getPageItems } from '@/lib/pagination'
import { useControllableState } from '@/lib/use-controllable-state'

/**
 * Numbered pagination: "‹ 1 2 3 4 5 … 123 ›". Current page is gold; arrows dim at the ends.
 * Pass `getHref` for real links (SEO, new tab); otherwise links are client-side via `onPageChange`.
 */
function StorePagination({
  pageCount,
  page,
  defaultPage = 1,
  onPageChange,
  getHref,
  siblings = 1,
}: {
  pageCount: number
  page?: number
  defaultPage?: number
  onPageChange?: (page: number) => void
  getHref?: (page: number) => string
  siblings?: number
}) {
  const [current, setCurrent] = useControllableState({ value: page, defaultValue: defaultPage, onChange: onPageChange })
  if (pageCount <= 1) return null

  const linkProps = (target: number) => ({
    href: getHref?.(target) ?? '#',
    onClick: (e: React.MouseEvent) => {
      if (!getHref) e.preventDefault()
      setCurrent(target)
    },
  })

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem className="mr-3">
          <PaginationPrevious isDisabled={current <= 1} {...linkProps(Math.max(1, current - 1))} />
        </PaginationItem>
        {getPageItems(current, pageCount, siblings).map(item =>
          typeof item === 'number'
            ? (
                <PaginationItem key={item}>
                  <PaginationLink isActive={item === current} {...linkProps(item)}>
                    {item}
                  </PaginationLink>
                </PaginationItem>
              )
            : (
                <PaginationItem key={item}>
                  <PaginationEllipsis />
                </PaginationItem>
              ))}
        <PaginationItem className="ml-3">
          <PaginationNext isDisabled={current >= pageCount} {...linkProps(Math.min(pageCount, current + 1))} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export { StorePagination }
