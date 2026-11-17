import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * "Log in" panel: title, Email and "Sign in with magic link". Validates on submit; `onSubmit` gets the
 * email once it's valid. `error` shows under the field (e.g. from the API), `status` under the button.
 */
function LoginForm({
  onSubmit,
  pending,
  error,
  status,
  className,
}: {
  onSubmit?: (email: string) => void
  pending?: boolean
  error?: string
  status?: string
  className?: string
}) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const emailError = (submitted && !EMAIL_RE.test(email) ? 'Enter a valid email address' : undefined) ?? error

  return (
    <section aria-labelledby="login-title" className={cn('flex flex-col gap-7', className)}>
      <div className="flex flex-col gap-1">
        <h1 id="login-title" className="type-h2">Log in</h1>
        <p className="type-caption font-bold text-muted-foreground">We’ll email you a link to sign in.</p>
      </div>

      <form
        noValidate
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault()
          setSubmitted(true)
          if (EMAIL_RE.test(email)) onSubmit?.(email.trim())
        }}
      >
        <div className="flex flex-col gap-1.5">
          <Input
            variant="panel"
            type="email"
            autoComplete="email"
            placeholder="Email"
            aria-label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            aria-invalid={emailError ? true : undefined}
            aria-describedby={emailError ? 'login-email-error' : undefined}
            className="h-14 rounded-none px-5 type-body"
          />
          {emailError && <p id="login-email-error" className="type-caption text-destructive">{emailError}</p>}
        </div>

        <Button type="submit" variant="buy" className="w-full" disabled={pending}>Sign in with magic link</Button>
        {status && <p role="status" className="type-caption">{status}</p>}
      </form>
    </section>
  )
}

export { LoginForm }
