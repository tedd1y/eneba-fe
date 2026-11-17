import { v1MenusSidemenuIndexOptions } from '@/client/@tanstack/react-query.gen'
import { cn } from '@/lib/utils'
import { HeartIcon, SearchIcon, UserIcon } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useQueryState } from "nuqs"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router"

import { CartButton } from "@/components/cart/cart-button"
import { Logo } from "@/components/layout/logo"
import { formatMoney } from "@/lib/money"
import { storeParsers, storeSearchUrl } from "@/lib/store-params"
import { CART_LIMIT_MESSAGE, MAX_CART_ITEMS, maxQuantityFor, selectCartCount, useCartStore } from "@/stores/cart"
import { toCartLine, useCartProducts } from "@/stores/use-cart-products"
import { SideMenu } from "@/components/layout/side-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

/** Cart icon + popup in the header, driven by the cart store and priced from the API. */
function HeaderCart() {
  const { lines, subtotal, cashback, currency } = useCartProducts()
  const setQuantity = useCartStore(s => s.setQuantity)
  const remove = useCartStore(s => s.remove)
  const count = useCartStore(selectCartCount)
  const items = useCartStore(s => s.items)

  return (
    <CartButton
      lines={lines.map(toCartLine)}
      count={count}
      total={formatMoney(subtotal, currency)}
      cashback={cashback ? formatMoney(cashback, currency) : undefined}
      onQuantityChange={(line, q) => setQuantity(Number(line.id), q)}
      onRemove={line => remove(Number(line.id))}
      getMaxQuantity={line => maxQuantityFor(items, Number(line.id))}
      limitMessage={count >= MAX_CART_ITEMS ? CART_LIMIT_MESSAGE : undefined}
    />
  )
}

/**
 * Header search. Submitting goes to the store with `search` set, keeping the current store filters
 * when already on the store. Shows the URL's search term while on the store.
 */
function SearchField() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  // Read via nuqs: it updates the URL optimistically, ahead of react-router's location.
  const [urlSearch] = useQueryState('search', storeParsers.search)
  const urlTerm = pathname.startsWith('/store/') ? urlSearch : ''

  const [term, setTerm] = useState(urlTerm)
  // Follow the URL (chip removed, back/forward) without an effect.
  const [shownUrlTerm, setShownUrlTerm] = useState(urlTerm)
  if (shownUrlTerm !== urlTerm) {
    setShownUrlTerm(urlTerm)
    setTerm(urlTerm)
  }

  return (
    <form
      role="search"
      className="relative w-full"
      onSubmit={(e) => {
        e.preventDefault()
        // window.location is always current, including filters nuqs just wrote.
        navigate(storeSearchUrl(term.trim(), window.location))
      }}
    >
      <SearchIcon
        className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-placeholder"
        aria-hidden
      />
      <Input
        type="search"
        name="search"
        value={term}
        onChange={e => setTerm(e.target.value)}
        placeholder="Search for games, top-ups and more"
        aria-label="Search"
        className="h-14 pl-12"
      />
    </form>
  )
}

/**
 * Site header — two states, switching at the `nav` breakpoint (930px):
 * - Compact (< 930px): one 55px row — menu on the left, logo, icon actions. No sub-header.
 * - Full (≥ 930px): 147px — 97px bar (logo, search, locale, actions) + 50px sub-header
 *   (Categories menu, then category links).
 */
function Header({ className }: { className?: string }) {
  // Category links from /v1/menus/sidemenu, each pointing at a store filter (e.g. /store/all?types[]=software).
  // The menu rarely changes, so it's fetched once per session.
  const { data: menu } = useQuery({ ...v1MenusSidemenuIndexOptions(), staleTime: Infinity })
  const navLinks = menu?.data ?? []
  // Log in comes back here once the emailed link is used (the API returns it as `redirect`).
  const { pathname, search } = useLocation()
  const loginHref = pathname === '/' ? '/login' : `/login?redirect=${encodeURIComponent(pathname + search)}`

  return (
    <header className={cn('bg-background', className)}>
      <div className="mx-auto flex h-header-mobile max-w-page items-center gap-2 px-2 nav:h-header-bar nav:gap-6 nav:px-8">
        <div className="nav:hidden">
          <SideMenu trigger="icon" />
        </div>
        <a href="/" className="shrink-0" aria-label="Eneba home">
          <Logo className="h-8 nav:h-12" />
        </a>

        <div className="hidden max-w-2xl min-w-0 flex-1 nav:block">
          <SearchField />
        </div>

        <Button variant="ghost" className="hidden hover:bg-transparent aria-expanded:bg-transparent xl:inline-flex xl:h-full xl:[&_svg]:size-header-icon!">
          English EU
          <Separator orientation="vertical" className="h-4 bg-foreground data-vertical:self-center" />
          EUR
        </Button>

        {/* From tablet up, actions fill the bar's height and use larger icons. */}
        <div className="ml-auto flex items-center gap-1 nav:h-full nav:items-stretch nav:gap-0 nav:[&_[data-slot=button]]:h-full nav:[&_[data-slot=button]_svg]:size-header-icon!">
          <Button variant="ghost" size="icon" aria-label="Search" className="nav:hidden">
            <SearchIcon />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Wishlist">
            <HeartIcon />
          </Button>
          <HeaderCart />
          <Button variant="ghost" size="icon" aria-label="Log in" className="nav:hidden" nativeButton={false} render={<Link to={loginHref} />}>
            <UserIcon />
          </Button>
          {/* Gold text on hover, no fill. */}
          <div className="hidden items-center nav:flex">
            <Button variant="ghost" className="px-2 hover:bg-transparent" nativeButton={false} render={<Link to={loginHref} />}>
              <UserIcon data-icon="inline-start" />
              Log in
            </Button>
          </div>
        </div>
      </div>

      <nav aria-label="Main" className="hidden bg-surface-nav nav:block">
        <div className="mx-auto flex h-header-nav max-w-page items-stretch gap-0 overflow-clip px-6 [&_[data-slot=button],&_[data-slot=sheet-trigger]]:h-full [&_[data-slot=sheet-trigger]_svg,&_[data-slot=button]_svg]:size-header-icon!">
          <SideMenu />
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              nativeButton={false}
              render={<Link to={link.href} />}
            >
              {link.label}
            </Button>
          ))}
        </div>
      </nav>
    </header>
  )
}

export { Header }
