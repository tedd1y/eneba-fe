import { ChevronRightIcon, MenuIcon, XIcon } from "lucide-react"

import { Logo } from "@/components/layout/logo"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export type MenuItem = { label: string; hasChildren?: boolean }

const defaultMenuItems: MenuItem[] = [
  { label: "All offers" },
  { label: "Mobile games", hasChildren: true },
  { label: "Games", hasChildren: true },
  { label: "Gaming eCards", hasChildren: true },
  { label: "eGift Cards", hasChildren: true },
  { label: "E-money cards", hasChildren: true },
  { label: "PSN", hasChildren: true },
  { label: "Xbox", hasChildren: true },
  { label: "Nintendo", hasChildren: true },
  { label: "Software", hasChildren: true },
  { label: "Mobile recharges" },
  { label: "eSIM", hasChildren: true },
  { label: "Gift Guide" },
]

/** The menu list itself — reusable inside the sheet or rendered inline. */
function SideMenuPanel({
  items = defaultMenuItems,
  onClose,
}: {
  items?: MenuItem[]
  onClose?: React.ReactNode
}) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border px-6">
        <Logo />
        {onClose}
      </div>
      <nav className="flex-1 overflow-y-auto py-3">
        <ul>
          {items.map((item) => (
            <li key={item.label}>
              <a
                href="#"
                className="flex h-12 items-center justify-between px-6 type-nav transition-colors hover:bg-sidebar-accent focus-visible:bg-sidebar-accent focus-visible:outline-none"
              >
                {item.label}
                {item.hasChildren && <ChevronRightIcon className="size-5" aria-hidden />}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

/**
 * Slide-in category drawer from the left.
 * `trigger="label"` → "☰ Categories" (desktop nav bar), `trigger="icon"` → hamburger only (phone/tablet).
 */
function SideMenu({
  items,
  trigger = "label",
}: {
  items?: MenuItem[]
  trigger?: "label" | "icon"
}) {
  return (
    <Sheet>
      {trigger === "icon" ? (
        <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Open categories" />}>
          <MenuIcon />
        </SheetTrigger>
      ) : (
        <SheetTrigger render={<Button variant="ghost" />}>
          <MenuIcon data-icon="inline-start" />
          Categories
        </SheetTrigger>
      )}
      <SheetContent
        side="left"
        showCloseButton={false}
        className="w-full gap-0 border-sidebar-border p-0 sm:max-w-sm"
      >
        <SheetTitle className="sr-only">Categories</SheetTitle>
        <SideMenuPanel
          items={items}
          onClose={
            <SheetClose render={<Button variant="ghost" size="icon" aria-label="Close menu" />}>
              <XIcon />
            </SheetClose>
          }
        />
      </SheetContent>
    </Sheet>
  )
}

export { SideMenu, SideMenuPanel }
