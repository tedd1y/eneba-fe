import { HeartIcon, SearchIcon, ShoppingCartIcon, UserIcon } from "lucide-react"

import { Logo } from "@/components/layout/logo"
import { SideMenu } from "@/components/layout/side-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export type NavLink = { label: string; href: string }

const defaultNavLinks: NavLink[] = [
  { label: "Cheap Games", href: "#" },
  { label: "Software", href: "#" },
  { label: "eGift Cards", href: "#" },
  { label: "Eneba Gift Cards", href: "#" },
  { label: "Probably Stolen", href: "#" },
  { label: "FM27", href: "#" },
  { label: "GTA VI", href: "#" },
]

function SearchField() {
  return (
    <div className="relative w-full">
      <SearchIcon
        className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-placeholder"
        aria-hidden
      />
      <Input
        type="search"
        placeholder="Search for games, top-ups and more"
        aria-label="Search"
        className="h-14 pl-12"
      />
    </div>
  )
}

/**
 * Site header — two states, switching at the `nav` breakpoint (930px):
 * - Compact (< 930px): one 55px row — menu on the left, logo, icon actions. No sub-header.
 * - Full (≥ 930px): 147px — 97px bar (logo, search, locale, actions) + 50px sub-header
 *   (Categories menu, then category links).
 */
function Header({ navLinks = defaultNavLinks }: { navLinks?: NavLink[] }) {
  return (
    <header className="bg-background">
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

        <Button variant="ghost" className="hidden xl:inline-flex">
          English EU
          <Separator orientation="vertical" className="h-4 bg-foreground data-vertical:self-center" />
          EUR
        </Button>

        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Search" className="nav:hidden">
            <SearchIcon />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Wishlist">
            <HeartIcon />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Cart">
            <ShoppingCartIcon />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Account" className="nav:hidden">
            <UserIcon />
          </Button>
          <Button variant="ghost" className="hidden nav:inline-flex">
            <UserIcon data-icon="inline-start" />
            Log in
            <Separator orientation="vertical" className="h-4 bg-foreground data-vertical:self-center" />
            Register
          </Button>
        </div>
      </div>

      <nav aria-label="Main" className="hidden bg-surface-nav nav:block">
        <div className="mx-auto flex h-header-nav max-w-page items-center gap-1 overflow-x-auto px-6">
          <SideMenu />
          {navLinks.map((link) => (
            <Button
              key={link.label}
              variant="ghost"
              nativeButton={false}
              render={<a href={link.href} />}
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
