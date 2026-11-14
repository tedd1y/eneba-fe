import { Header } from "@/components/layout/header"
import { SideMenu, SideMenuPanel } from "@/components/layout/side-menu"
import { Block, Section } from "@/showcase/section"

export function Navigation() {
  return (
    <Section
      id="layout"
      title="Header & side menu"
      description="Below 930px the header is a single 55px row (menu left, logo, icons). From 930px it is 147px: a 97px bar plus a 50px sub-header. “Categories” opens the side menu, which slides in from the left over a dimmed page."
    >
      <Block title="Header (resize to see phone / tablet / desktop)">
        <div className="border border-border">
          <Header />
        </div>
      </Block>

      <Block title="Side menu · triggers">
        <div className="flex items-center gap-2 bg-surface-nav px-2 py-1">
          <SideMenu />
          <SideMenu trigger="icon" />
        </div>
      </Block>

      <Block title="Side menu · panel (pinned open)">
        <div className="h-[36rem] w-full max-w-sm overflow-hidden border border-border">
          <SideMenuPanel />
        </div>
      </Block>
    </Section>
  )
}
