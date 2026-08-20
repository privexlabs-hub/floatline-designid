import type { Surface } from '@/lib/tokens';
import type { VerticalId } from '@/content/verticals';
import type { CurrencyId } from '@/content/brand';

export type LayoutBaseProps = {
  w: number;
  h: number;
  surface: Surface;
  grain?: boolean;
  vertical?: VerticalId;
  currency?: CurrencyId;
  [k: string]: unknown;
};

/** Coerce an unknown editor field into a string without rendering "undefined". */
export const str = (v: unknown, fallback = ''): string =>
  v === undefined || v === null ? fallback : Array.isArray(v) ? v.join(' ') : String(v);

/** Coerce into a string[] — `lines` fields arrive as arrays, but a revived doc may not. */
export const arr = (v: unknown, fallback: string[] = []): string[] =>
  Array.isArray(v) ? v.map(String) : typeof v === 'string' && v.length ? v.split('\n') : fallback;

export const bool = (v: unknown, fallback = false): boolean =>
  typeof v === 'boolean' ? v : fallback;
