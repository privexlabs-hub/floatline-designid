/**
 * eslint-config-next 16 ships a native flat config, so it is imported directly.
 * The FlatCompat bridge that older setups use throws a circular-structure error
 * against this version.
 */
import next from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const config = [
  {
    ignores: ['.source/**', 'out/**', '.next/**', 'public/**', 'verify-out/**', 'next-env.d.ts'],
  },
  ...next,
  ...nextTs,
  {
    // The verification scripts are Node ESM, not app code.
    files: ['scripts/**/*.mjs'],
    languageOptions: { globals: { process: 'readonly', console: 'readonly' } },
  },
];

export default config;
