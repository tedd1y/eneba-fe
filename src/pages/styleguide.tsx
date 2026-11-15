import { Logo } from "@/components/layout/logo"
import { Button } from "@/components/ui/button"
import { Actions } from "@/showcase/actions"
import { Cards } from "@/showcase/cards"
import { Foundations } from "@/showcase/foundations"
import { Galleries } from "@/showcase/galleries"
import { Navigation } from "@/showcase/navigation"
import { CartPage } from "@/showcase/cart-page"
import { ProductPage } from "@/showcase/product-page"
import { Store } from "@/showcase/store"

const sections = [
  { id: "foundations", label: "Foundations" },
  { id: "actions", label: "Buttons & badges" },
  { id: "cards", label: "Cards" },
  { id: "galleries", label: "Galleries" },
  { id: "layout", label: "Header & side menu" },
  { id: "store", label: "Store filters" },
  { id: "product", label: "Product page" },
  { id: "cart", label: "Cart" },
]

export function StyleguidePage() {
  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-page items-center gap-4 px-4 md:px-8">
          <Logo />
          <span className="type-label text-muted-foreground">Styleguide</span>
        </div>
        <nav className="bg-surface-nav">
          <div className="mx-auto flex max-w-page gap-1 overflow-x-auto px-2 md:px-6">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant="ghost"
                nativeButton={false}
                render={<a href={`#${section.id}`} />}
              >
                {section.label}
              </Button>
            ))}
          </div>
        </nav>
      </header>

      <main>
        <Foundations />
        <Actions />
        <Cards />
        <Galleries />
        <Navigation />
        <Store />
        <ProductPage />
        <CartPage />
      </main>

      <footer className="bg-surface-footer py-8">
        <p className="mx-auto max-w-page px-4 type-caption text-muted-foreground md:px-8">
          Tokens live in src/globals.css · sampled from design/brand/homepage
        </p>
      </footer>
    </div>
  )
}
