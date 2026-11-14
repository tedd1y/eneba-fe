import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border border-transparent px-2 type-label whitespace-nowrap transition-colors focus-visible:ring-3 focus-visible:ring-ring has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive [&>svg]:pointer-events-none [&>svg]:size-3.5!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary-hover",
        /** Mint "CASHBACK" tag on product covers. */
        cashback:
          "h-7 bg-highlight px-2.5 text-highlight-foreground uppercase",
        /** Price drop, e.g. "-48%". */
        discount: "bg-discount text-foreground",
        secondary:
          "border-border-strong bg-secondary text-secondary-foreground [a]:hover:bg-secondary-hover",
        outline:
          "border-border text-foreground [a]:hover:bg-secondary-hover",
        /** Platform strip label (Xbox Live, PSN, Steam). */
        platform: "bg-overlay text-foreground",
        muted: "bg-muted text-muted-foreground",
        destructive: "bg-destructive text-foreground",
        ghost: "text-foreground hover:bg-secondary-hover",
        link: "text-foreground underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
