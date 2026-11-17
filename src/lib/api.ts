import { QueryClient } from '@tanstack/react-query'

import { client } from '@/client/client.gen'

/** Reads a cookie set by the API (same site: localhost), or undefined when it isn't there. */
export function readCookie(name: string) {
  const match = document.cookie.split('; ').find(c => c.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined
}

/**
 * API runtime setup for Laravel Sanctum's cookie (SPA) auth.
 * - Base URL: `/api`, relative to the page, so requests go through the dev server's proxy
 *   (vite.config.ts) and the session cookies are first-party. VITE_API_URL only overrides it.
 * - `credentials: 'include'`: send and keep the session + XSRF-TOKEN cookies, also when
 *   VITE_API_URL points at another origin.
 * - `Accept: application/json`: Laravel answers errors (401, 419, 422) as JSON instead of redirects.
 * - `X-XSRF-TOKEN`: copied from the XSRF-TOKEN cookie on every request, as Sanctum expects.
 *   The cookie comes from `csrf()` in lib/auth.
 */
const apiUrl = (import.meta.env.VITE_API_URL as string | undefined) || '/api'
client.setConfig({
  baseUrl: apiUrl,
  credentials: 'include',
  headers: { Accept: 'application/json' },
})

client.interceptors.request.use((request) => {
  const token = readCookie('XSRF-TOKEN')
  if (token) request.headers.set('X-XSRF-TOKEN', token)
  return request
})

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
