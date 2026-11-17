import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Where the dev server forwards API calls. Server-side only (no VITE_ prefix), so it never reaches the bundle.
  const apiTarget = loadEnv(mode, process.cwd(), '').API_PROXY_TARGET || 'http://localhost:8000'

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
    server: {
      // The app calls the API relative to itself (/api, /sanctum), so the Sanctum session and
      // XSRF cookies are first-party to the page's own origin.
      proxy: {
        '/api': apiTarget,
        '/sanctum': apiTarget,
      },
    },
  }
})
