import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { RequestMagicLinkRequest, UserResource } from '@/client'
import { v1MeShowQueryKey } from '@/client/@tanstack/react-query.gen'
import { authLogout, authMagicLinkStore, authMagicLinkVerify, v1MeShow } from '@/client/sdk.gen'
import { readCookie } from '@/lib/api'
import { ApiError } from '@/lib/errors'

/**
 * Passwordless (magic link) auth on Sanctum's SPA session: the session lives in an httpOnly cookie, and
 * every POST carries the XSRF-TOKEN cookie back as `X-XSRF-TOKEN` (set up in lib/api).
 */

const meKey = v1MeShowQueryKey()

/**
 * `GET /sanctum/csrf-cookie`: sets the XSRF-TOKEN (and session) cookies.
 * Relative to the current page (proxied to the API like `/api`); the route isn't under `/api`.
 */
async function csrf() {
  const response = await fetch('/sanctum/csrf-cookie', { credentials: 'include' })
  if (!response.ok) throw new ApiError(response.status, null, 'Couldn\'t reach the server. Please try again.')
}

/** Fetches the XSRF cookie only when it's missing (it expires with the session). */
async function ensureCsrf() {
  if (!readCookie('XSRF-TOKEN')) await csrf()
}

/** The signed-in user, `null` for guests (401), `undefined` while loading. */
export function useMe() {
  return useQuery({
    queryKey: meKey,
    queryFn: async ({ signal }): Promise<UserResource | null> => {
      const { data, error, response } = await v1MeShow({ signal })
      if (response?.status === 401) return null
      if (!data) throw new ApiError(response?.status ?? 0, error, 'Couldn\'t load your account.')
      return data.data
    },
    staleTime: Infinity,
    retry: false,
  })
}

/**
 * `POST /auth/magic-link`: emails a sign-in link. `redirect` is the storefront path (starting with `/`)
 * to open after signing in. The answer is the same for every address; the account is created on first use.
 * Fails with an ApiError (status 0 = network error): 422 has `fieldErrors.email`, 429 means too many requests.
 */
export function useRequestMagicLink() {
  return useMutation({
    mutationFn: async ({ email, redirect }: RequestMagicLinkRequest) => {
      await ensureCsrf()
      const { error, response } = await authMagicLinkStore({ body: { email, redirect } })
      if (!response?.ok) throw new ApiError(response?.status ?? 0, error, 'Couldn\'t send the link. Please try again.')
    },
  })
}

/**
 * `POST /auth/magic-link/verify` with the `token` from the emailed link. Resolves to the user and the
 * `redirect` path to open, and puts the user straight into `useMe`. The token works once: 422 means it's
 * unknown, used or expired.
 */
export function useVerifyMagicLink() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (token: string) => {
      await ensureCsrf()
      const { data, error, response } = await authMagicLinkVerify({ body: { token } })
      if (!data) throw new ApiError(response?.status ?? 0, error, 'Couldn\'t sign you in. Please request a new link.')
      return { user: data.data, redirect: data.redirect }
    },
    onSuccess: ({ user }) => queryClient.setQueryData(meKey, user),
  })
}

/** `POST /auth/logout`. Afterwards `useMe` is `null` straight away, without a refetch. */
export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await ensureCsrf()
      const { error, response } = await authLogout()
      if (!response?.ok) throw new ApiError(response?.status ?? 0, error, 'Couldn\'t log you out. Please try again.')
    },
    onSuccess: () => queryClient.setQueryData(meKey, null),
  })
}
