import { useEffect, useRef } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'

import { AuthLayout } from '@/components/login/auth-layout'
import { Button } from '@/components/ui/button'
import { useVerifyMagicLink } from '@/lib/auth'

/**
 * `/auth/magic?token=…`, where the emailed sign-in link lands. Verifies the token once, then replaces
 * this page with the `redirect` path the link was requested with. A bad or used link offers a new one.
 */
export function MagicLink() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const navigate = useNavigate()
  const verify = useVerifyMagicLink()
  const { mutate } = verify

  // Tokens are single-use; the ref stops StrictMode's second effect run from spending it twice.
  const started = useRef(false)
  useEffect(() => {
    if (!token || started.current) return
    started.current = true
    mutate(token, { onSuccess: ({ redirect }) => navigate(redirect, { replace: true }) })
  }, [token, mutate, navigate])

  const failed = !token || verify.isError

  return (
    <AuthLayout
      greeting={(
        <>
          Welcome
          <br />
          back!
        </>
      )}
    >
      <section aria-labelledby="magic-title" className="flex flex-col gap-7">
        <div className="flex flex-col gap-1">
          <h1 id="magic-title" className="type-h2">{failed ? 'Link not valid' : 'Signing you in…'}</h1>
          <p role="status" className="type-caption font-bold text-muted-foreground">
            {failed
              ? 'This sign-in link is invalid, already used or expired. Request a new one.'
              : 'Just a moment.'}
          </p>
        </div>
        {failed && (
          <Button variant="buy" className="w-full" nativeButton={false} render={<Link to="/login" />}>
            Get a new link
          </Button>
        )}
      </section>
    </AuthLayout>
  )
}
