import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { cn } from '@/lib/utils'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type LoginValues = { email: string, password: string }

/**
 * "Log in" panel: title, "New user? Create account", Email, Password (with show/hide) and "Log in".
 * Validates on submit; `onSubmit` gets the values once both fields are valid.
 * `status` shows a message under the button (e.g. a failed login).
 */
function LoginForm({
  onSubmit,
  status,
  createAccountHref = '/login',
  forgotPasswordHref = '#',
  className,
}: {
  onSubmit?: (values: LoginValues) => void
  status?: string
  createAccountHref?: string
  forgotPasswordHref?: string
  className?: string
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const emailError = submitted && !EMAIL_RE.test(email) ? 'Enter a valid email address' : undefined
  const passwordError = submitted && password.length === 0 ? 'Enter your password' : undefined

  return (
    <section aria-labelledby="login-title" className={cn('flex flex-col gap-7', className)}>
      <div className="flex flex-col gap-1">
        <h1 id="login-title" className="type-h2">Log in</h1>
        <p className="type-caption font-bold text-muted-foreground">
          New user?
          {' '}
          <a href={createAccountHref} className="text-attention hover:underline">Create account</a>
        </p>
      </div>

      <form
        noValidate
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault()
          setSubmitted(true)
          if (EMAIL_RE.test(email) && password.length > 0) onSubmit?.({ email, password })
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

        <div className="flex flex-col gap-1.5">
          <InputGroup variant="panel" className="h-14 rounded-none">
            <InputGroupInput
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Password"
              aria-label="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              aria-invalid={passwordError ? true : undefined}
              aria-describedby={passwordError ? 'login-password-error' : undefined}
              className="h-full px-5 type-body"
            />
            <InputGroupAddon align="inline-end" className="pr-3">
              <InputGroupButton
                size="icon-sm"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword(s => !s)}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          {passwordError && <p id="login-password-error" className="type-caption text-destructive">{passwordError}</p>}
          <a href={forgotPasswordHref} className="self-end type-caption text-attention hover:underline">Forgot password?</a>
        </div>

        <Button type="submit" variant="buy" className="w-full">Log in</Button>
        {status && <p role="status" className="type-caption">{status}</p>}
      </form>
    </section>
  )
}

export { LoginForm }
