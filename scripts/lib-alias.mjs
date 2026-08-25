/**
 * Teaches Node two things TypeScript takes for granted: the `@/*` -> `src/*`
 * alias from tsconfig.json, and extensionless imports.
 *
 * The verification scripts import the app's own source so a rule is stated once
 * and checked once. Node strips the types natively; what it does not do is
 * resolve a path alias or guess `.ts`. That is all this restores — registered
 * as a synchronous hook, with no bundler and no extra dependency.
 */
import { registerHooks } from 'node:module';
import { pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const SRC = pathToFileURL(path.resolve(import.meta.dirname, '../src') + '/').href;
const EXTS = ['.ts', '.tsx', '/index.ts', '/index.tsx'];

/** Append the extension TypeScript let the author omit. */
function withExtension(url) {
  const file = fileURLToPath(url);
  if (path.extname(file) && existsSync(file)) return url;
  for (const ext of EXTS) {
    if (existsSync(file + ext)) return pathToFileURL(file + ext).href;
  }
  return url;
}

registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith('@/')) {
      return next(withExtension(new URL(specifier.slice(2), SRC).href), context);
    }
    if ((specifier.startsWith('./') || specifier.startsWith('../')) && context.parentURL?.startsWith('file:')) {
      const resolved = new URL(specifier, context.parentURL).href;
      if (!path.extname(specifier)) return next(withExtension(resolved), context);
    }
    return next(specifier, context);
  },
});
