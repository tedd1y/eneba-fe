import { defineConfig } from '@hey-api/openapi-ts'

/**
 * Generates the typed API client into src/client from the Laravel storefront spec.
 * Run `npm run openapi-ts` with the API running on localhost:8000. Never edit src/client by hand.
 */
export default defineConfig({
  input: 'http://localhost:8000/docs/api.json',
  output: 'src/client',
  plugins: [
    '@hey-api/client-fetch',
    '@hey-api/typescript',
    '@hey-api/sdk',
    '@tanstack/react-query',
  ],
})
