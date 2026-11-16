import { GlobeIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

const links = [
  { label: 'Terms & Conditions', href: '#' },
  { label: 'Privacy notice', href: '#' },
  { label: 'Cookie preferences', href: '#' },
  { label: 'Support', href: '#' },
]

/** Slim footer for the login page: language, legal links, copyright. One row on desktop, stacked below. */
function LoginFooter({ className }: { className?: string }) {
  return (
    <footer className={cn('flex flex-col items-center gap-5 type-body lg:flex-row lg:justify-center', className)}>
      <span className="flex items-center gap-1.5">
        <GlobeIcon className="size-4" aria-hidden />
        English EU
      </span>
      <nav aria-label="Legal" className="contents">
        {links.map(link => (
          <a key={link.label} href={link.href} className="font-bold hover:text-attention">{link.label}</a>
        ))}
      </nav>
      <p>
        Copyright ©
        {' '}
        {new Date().getFullYear()}
        {' '}
        Eneba. All Rights Reserved.
      </p>
    </footer>
  )
}

export { LoginFooter }
