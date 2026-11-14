import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import eslintConfigPrettier from "eslint-config-prettier";
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig([
  globalIgnores(['dist', '.agents', '.claude']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      stylistic.configs.recommended,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    // Generated shadcn primitives and styleguide helpers export variants/helpers next to components.
    files: ['src/components/ui/**/*.tsx', 'src/showcase/**/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
])
