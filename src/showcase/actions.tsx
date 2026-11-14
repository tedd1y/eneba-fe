import {
  ArrowRightIcon,
  HeartIcon,
  PlusIcon,
  SearchIcon,
  ShoppingCartIcon,
  WalletIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Block, Section } from "@/showcase/section"
import { previewState, StateMatrix } from "@/showcase/state-matrix"

const buttonVariants = ["default", "secondary", "highlight", "ghost", "link"] as const

const buttonLabels: Record<(typeof buttonVariants)[number], string> = {
  default: "Shop cards",
  secondary: "See all",
  highlight: "Top up wallet",
  ghost: "Log in",
  link: "Privacy notice",
}

export function Actions() {
  return (
    <Section
      id="actions"
      title="Buttons & badges"
      description="Primary is the solid electric violet from hero promos. Secondary is the white-outline button used for “See all” and “Load more”. Square corners, bold labels."
      className="bg-surface-deep"
    >
      <Block title="Button · variants × states">
        <StateMatrix
          rows={buttonVariants}
          render={(variant, state) => (
            <Button variant={variant} {...previewState(state)}>
              {buttonLabels[variant]}
            </Button>
          )}
        />
      </Block>

      <Block title="Button · sizes">
        <div className="flex flex-wrap items-center gap-4">
          <Button size="xs">Extra small</Button>
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
          <Button variant="secondary" size="wide">
            Show all
          </Button>
        </div>
      </Block>

      <Block title="Button · with icons">
        <div className="flex flex-wrap items-center gap-4">
          <Button>
            <ShoppingCartIcon data-icon="inline-start" />
            Add to cart
          </Button>
          <Button variant="secondary">
            Load more
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
          <Button variant="highlight">
            <WalletIcon data-icon="inline-start" />
            Eneba wallet
          </Button>
          <Button variant="ghost" size="icon" aria-label="Wishlist">
            <HeartIcon />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Cart">
            <ShoppingCartIcon />
          </Button>
          <Button variant="secondary" size="icon-lg" aria-label="Add to cart">
            <PlusIcon />
          </Button>
        </div>
      </Block>

      <Block title="Input · search & subscribe">
        <div className="flex max-w-2xl flex-col gap-4">
          <div className="relative">
            <SearchIcon
              className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-placeholder"
              aria-hidden
            />
            <Input
              placeholder="Search for games, top-ups and more"
              aria-label="Search"
              className="h-12 pl-12"
            />
          </div>
          <div className="flex">
            <Input placeholder="Enter your email" aria-label="Email" className="h-10" />
            <Button variant="secondary" className="-ml-px">
              Subscribe
            </Button>
          </div>
        </div>
      </Block>

      <Block title="Badge">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="cashback">
            <PlusIcon data-icon="inline-start" />
            Cashback
          </Badge>
          <Badge variant="discount">-48%</Badge>
          <Badge>New</Badge>
          <Badge variant="secondary">Pre-order</Badge>
          <Badge variant="outline">Global</Badge>
          <Badge variant="platform">Xbox Live</Badge>
          <Badge variant="muted">Out of stock</Badge>
          <Badge variant="destructive">Region locked</Badge>
        </div>
      </Block>
    </Section>
  )
}
