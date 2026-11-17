import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { LoginStoreData, RegisterStoreData, UserResource } from '@/client'
import { v1MeShowQueryKey } from '@/client/@tanstack/react-query.gen'
import { loginStore, logout, registerStore, v1MeShow } from '@/client/sdk.gen'
import { readCookie } from '@/lib/api'
import { ApiError } from '@/lib/errors'

/**
 * Sanctum SPA auth: the session lives in an httpOnly cookie, and every state-changing request
 * carries the XSRF-TOKEN cookie back as `X-XSRF-TOKEN` (set up in lib/api).
 */

const meKey = v1MeShowQueryKey()

/**
 * `GET /sanctum/csrf-cookie`: sets the XSRF-TOKEN (and session) cookies.
 * Relative to the current page (proxied to the API like `/api`); the route isn't under `/api`.
 */
export async function csrf() {
  const response = await fetch('/sanctum/csrf-cookie', { credentials: 'include' })
  if (!response?.ok) throw new ApiError(response.status, null, 'Couldn\'t reach the server. Please try again.')
}

/** The logged-in user, `null` for guests (401), `undefined` while loading. */
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
 * `POST /login` (after `csrf()`). Fails with an ApiError (status 0 = network error): 422 has `fieldErrors.email` for
 * wrong credentials, 429 means too many attempts. On success `useMe` reloads the user.
 */
export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: LoginStoreData['body']) => {
      await csrf()
      const { error, response } = await loginStore({ body })
      if (!response?.ok) throw new ApiError(response?.status ?? 0, error, 'Couldn\'t log you in. Please try again.')
    },
    // Awaited, so the mutation only reports success once the user is loaded.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: meKey }),
  })
}

/**
 * `POST /register` (after `csrf()`). Registering also logs the user in, so `useMe` reloads.
 * 422 has per-field messages in `fieldErrors` (name, email, password).
 */
export function useRegister() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: RegisterStoreData['body']) => {
      await csrf()
      const { error, response } = await registerStore({ body })
      if (!response?.ok) throw new ApiError(response?.status ?? 0, error, 'Couldn\'t create your account. Please try again.')
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: meKey }),
  })
}

/** `POST /logout`. Afterwards `useMe` is `null` straight away, without a refetch. */
export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      // The XSRF cookie expires with the session lifetime; get a fresh one if it's gone.
      if (!readCookie('XSRF-TOKEN')) await csrf()
      const { error, response } = await logout()
      if (!response?.ok) throw new ApiError(response?.status ?? 0, error, 'Couldn\'t log you out. Please try again.')
    },
    onSuccess: () => queryClient.setQueryData(meKey, null),
  })
}
