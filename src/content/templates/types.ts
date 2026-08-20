import type { Surface } from '@/lib/tokens';
import type { VerticalId } from '@/content/verticals';
import type { CurrencyId } from '@/content/brand';

export type FieldType = 'text' | 'textarea' | 'lines' | 'select' | 'toggle' | 'image';

export type Field =
  | { k: string; label: string; type: 'text'; def: string; max?: number }
  | { k: string; label: string; type: 'textarea'; def: string; max?: number }
  /** One item per line. Bound to a string[] prop. */
  | { k: string; label: string; type: 'lines'; def: string[] }
  | { k: string; label: string; type: 'select'; def: string; options: string[] }
  | { k: string; label: string; type: 'toggle'; def: boolean }
  /** A local file, read to a data URL. Never uploaded anywhere. */
  | { k: string; label: string; type: 'image'; def: string };

export type LayoutId =
  | 'square' | 'engagement' | 'carousel' | 'vertical' | 'portrait'
  | 'ytThumb' | 'cover' | 'avatar' | 'ad' | 'email' | 'web' | 'profile' | 'kit';

export type Platform = 'x' | 'linkedin' | 'instagram' | 'youtube' | 'email' | 'web' | 'facebook' | 'tiktok';

export type Preset = {
  id: string;
  group: string;
  name: string;
  layout: LayoutId;
  w: number;
  h: number;
  surface: Surface;
  /** Fixed props passed to the layout — shape and role selectors, mostly. */
  props?: Record<string, unknown>;
  fields: Field[];
  /** Where the exported image is destined, for the character counter. */
  platform?: Platform;
  /** Which copy pack seeds this preset's defaults. */
  vertical?: VerticalId;
  currency?: CurrencyId;
};

export const defaultsOf = (p: Preset): Record<string, unknown> =>
  Object.fromEntries(p.fields.map((f) => [f.k, f.def]));
