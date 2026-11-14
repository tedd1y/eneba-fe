import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding font-bold whitespace-nowrap transition-colors outline-none select-none active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        /** Solid electric violet — hero CTAs ("Shop cards"). */
        default:
          "bg-primary text-primary-foreground uppercase hover:bg-primary-hover",
        /** White outline, gold border + darkened fill on hover — "See all", "Load more", "Subscribe". */
        secondary:
          "border-border-strong bg-secondary text-secondary-foreground hover:border-attention hover:bg-secondary-hover aria-expanded:border-attention aria-expanded:bg-secondary-hover",
        outline:
          "border-border-strong bg-secondary text-secondary-foreground hover:border-attention hover:bg-secondary-hover aria-expanded:border-attention aria-expanded:bg-secondary-hover",
        /** Solid gold — purchase actions ("Add to cart"). */
        buy: "bg-attention text-attention-foreground hover:bg-attention/85",
        /** Mint accent — cashback / wallet actions. */
        highlight:
          "bg-highlight text-highlight-foreground hover:bg-highlight/85",
        /** Header links, menu rows: gold text on a deep fill. Icon-only sizes get the gold, no fill. */
        ghost:
          "font-medium text-foreground hover:bg-ghost-hover hover:text-attention aria-expanded:bg-ghost-hover aria-expanded:text-attention",
        destructive:
          "bg-destructive text-foreground hover:bg-destructive/85",
        link: "font-medium text-foreground underline underline-offset-4 hover:text-highlight",
        /** Dark pill — active store filters ("Type (1) ⌄"). */
        chip: "rounded-full bg-chip font-semibold text-foreground hover:bg-chip/70 aria-expanded:bg-chip/70",
        /** Gold text action — "Clear all", "22 more". */
        attention: "font-semibold text-attention hover:underline underline-offset-4",
      },
      size: {
        default:
          "h-10 gap-2 px-6 type-body has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs: "h-7 gap-1 px-2.5 type-caption [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 gap-1.5 px-4 type-label [&_svg:not([class*='size-'])]:size-4",
        lg: "h-12 gap-2 px-10 type-nav has-data-[icon=inline-end]:pr-8 has-data-[icon=inline-start]:pl-8",
        /** Bare inline text button, no box. */
        text: "h-auto gap-1 p-0 type-label",
        wide: "h-10 w-full max-w-56 gap-2 px-6 type-body",
        icon: "size-10",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-8 [&_svg:not([class*='size-'])]:size-4",
        "icon-lg": "size-12 [&_svg:not([class*='size-'])]:size-6",
      },
    },
    compoundVariants: [
      {
        variant: "ghost",
        size: ["icon", "icon-xs", "icon-sm", "icon-lg"],
        className: "hover:bg-transparent aria-expanded:bg-transparent",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
