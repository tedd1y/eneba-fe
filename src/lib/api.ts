import { QueryClient } from '@tanstack/react-query'

import { client } from '@/client/client.gen'

/**
 * API runtime setup. The generated client defaults to the spec's server
 * (http://localhost:8000/api); set VITE_API_URL to point it elsewhere.
 */
const apiUrl = import.meta.env.VITE_API_URL as string | undefined
if (apiUrl) client.setConfig({ baseUrl: apiUrl })

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
