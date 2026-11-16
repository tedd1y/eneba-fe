import { useState } from 'react'
import { Link } from 'react-router'

import { Logo } from '@/components/layout/logo'
import { LoginFooter } from '@/components/login/login-footer'
import { LoginForm } from '@/components/login/login-form'

/**
 * `/login`, from design/brand/login. Desktop: dark page, "Hi! It's nice to see you!" on the left,
 * the form on a purple panel to the right. Tablet / phone: purple page, form only, footer stacked.
 * There's no auth API yet, so submitting only validates and says so.
 */
export function Login() {
  const [status, setStatus] = useState<string>()

  return (
    <div className="flex min-h-svh flex-col bg-background lg:bg-card">
      <header className="flex px-6 pt-6">
        <Link to="/" aria-label="Eneba home" className="shrink-0">
          <Logo className="h-12" />
        </Link>
      </header>

      <main className="flex items-start justify-center px-4 pt-6 pb-12 lg:flex-1 lg:items-center lg:justify-between lg:gap-12 lg:px-32 lg:py-12">
        <p className="hidden text-7xl leading-[0.95] font-bold tracking-tight lg:block xl:text-8xl" aria-hidden>
          Hi!
          <br />
          It’s nice to
          <br />
          see you!
        </p>
        <LoginForm
          onSubmit={({ email }) => setStatus(`Logging in isn't available yet (${email}).`)}
          status={status}
          className="w-full max-w-91 lg:max-w-95 lg:bg-background lg:p-10"
        />
      </main>

      <LoginFooter className="px-4 pb-8 lg:pb-7" />
    </div>
  )
}
