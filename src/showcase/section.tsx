import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

/** Styleguide section shell: anchor, title, description, content. */
export function Section({
  id,
  title,
  description,
  children,
  className,
}: {
  id: string
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn("scroll-mt-20 py-12", className)}>
      <div className="mx-auto flex max-w-page flex-col gap-8 px-4 md:px-8">
        <header className="flex flex-col gap-2">
          <h2 className="type-h1">{title}</h2>
          {description && (
            <p className="max-w-2xl type-body text-muted-foreground">{description}</p>
          )}
        </header>
        {children}
      </div>
    </section>
  )
}

/** Labeled block inside a section. */
export function Block({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-col gap-2">
        <h3 className="type-h3">{title}</h3>
        <Separator />
      </div>
      {children}
    </div>
  )
}
