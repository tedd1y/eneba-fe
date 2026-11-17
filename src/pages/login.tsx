import { useSearchParams } from 'react-router'

import { AuthLayout } from '@/components/login/auth-layout'
import { LoginForm } from '@/components/login/login-form'
import { useRequestMagicLink } from '@/lib/auth'

/** Only storefront paths (one leading `/`), as the API requires; anything else falls back to `/`. */
const safeRedirect = (value: string | null) =>
  value?.startsWith('/') && !value.startsWith('//') ? value : undefined

/**
 * `/login?redirect=/path`, from design/brand/login. Emails a magic sign-in link (`POST /auth/magic-link`);
 * `redirect` is where /auth/magic sends the user after signing in (`/` without one).
 */
export function Login() {
  const [params] = useSearchParams()
  const redirect = safeRedirect(params.get('redirect'))
  const requestLink = useRequestMagicLink()

  return (
    <AuthLayout
      greeting={(
        <>
          Hi!
          <br />
          It’s nice to
          <br />
          see you!
        </>
      )}
    >
      <LoginForm
        onSubmit={email => requestLink.mutate({ email, redirect })}
        pending={requestLink.isPending}
        error={requestLink.error?.message}
        status={requestLink.isSuccess ? `We’ve emailed a sign-in link to ${requestLink.variables.email}. Check your inbox.` : undefined}
      />
    </AuthLayout>
  )
}
