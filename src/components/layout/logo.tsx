import logoUrl from "@/assets/eneba-logo.svg"
import { cn } from "@/lib/utils"

function Logo({ className }: { className?: string }) {
  return <img src={logoUrl} alt="Eneba" className={cn("h-8 w-auto", className)} />
}

export { Logo }
