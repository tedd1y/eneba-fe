import type { LucideIcon } from "lucide-react"

/** Icon shortcut in the quick-category strip (Games, Steam, PSN…). */
function QuickLink({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <a
      href="#"
      className="flex w-24 shrink-0 flex-col items-center gap-2 py-2 type-label text-foreground transition-colors hover:text-highlight"
    >
      <Icon className="size-8" aria-hidden />
      {label}
    </a>
  )
}

export { QuickLink }
