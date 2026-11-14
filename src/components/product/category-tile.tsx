import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/** "Categories" block tile: product count, icon, label. */
function CategoryTile({
  icon: Icon,
  label,
  count,
  className,
}: {
  icon: LucideIcon
  label: string
  count: number
  className?: string
}) {
  return (
    <a
      href="#"
      className={cn(
        "flex flex-col items-center justify-between gap-4 bg-surface-tile px-4 py-5 type-h3 shadow-lg transition-colors hover:bg-primary focus-visible:ring-3 focus-visible:ring-ring",
        className,
      )}
    >
      <span>{count}</span>
      <Icon className="size-10" aria-hidden />
      <span>{label}</span>
    </a>
  )
}

export { CategoryTile }
