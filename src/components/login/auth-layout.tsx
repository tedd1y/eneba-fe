import { Link } from 'react-router'

import { Logo } from '@/components/layout/logo'
import { LoginFooter } from '@/components/login/login-footer'

/**
 * Page shell for /login and /auth/magic, from design/brand/login. Desktop: dark page, a big greeting
 * on the left, the form on a purple panel to the right. Tablet / phone: purple page, form only,
 * footer stacked right under it. `children` is the form, placed in the panel.
 */
function AuthLayout({ greeting, children }: { greeting: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-background lg:bg-card">
      <header className="flex px-6 pt-6">
        <Link to="/" aria-label="Eneba home" className="shrink-0">
          <Logo className="h-12" />
        </Link>
      </header>

      <main className="flex items-start justify-center px-4 pt-6 pb-12 lg:flex-1 lg:items-center lg:justify-between lg:gap-12 lg:px-32 lg:py-12">
        <p className="hidden text-7xl leading-[0.95] font-bold tracking-tight lg:block xl:text-8xl" aria-hidden>
          {greeting}
        </p>
        <div className="w-full max-w-91 lg:max-w-95 lg:bg-background lg:p-10">{children}</div>
      </main>

      <LoginFooter className="px-4 pb-8 lg:pb-7" />
    </div>
  )
}

export { AuthLayout }
