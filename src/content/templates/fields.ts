import type { Field } from './types';

/** Builders. Presets are dense enough without repeating the object shape. */
export const text = (k: string, label: string, def: string, max?: number): Field =>
  ({ k, label, type: 'text', def, ...(max ? { max } : {}) }) as Field;

export const area = (k: string, label: string, def: string, max?: number): Field =>
  ({ k, label, type: 'textarea', def, ...(max ? { max } : {}) }) as Field;

export const lines = (k: string, label: string, def: string[]): Field =>
  ({ k, label, type: 'lines', def });

export const pick = (k: string, label: string, def: string, options: string[]): Field =>
  ({ k, label, type: 'select', def, options });

export const flag = (k: string, label: string, def: boolean): Field =>
  ({ k, label, type: 'toggle', def });

export const image = (k: string, label: string, def = ''): Field =>
  ({ k, label, type: 'image', def });

/* Shared groups — the fields nearly every layout wants. */
export const eyebrow = (def: string) => text('eyebrow', 'Eyebrow', def, 32);
export const title = (def: string, max = 90) => area('title', 'Headline', def, max);
export const body = (def: string, max = 220) => area('body', 'Body', def, max);
export const cta = (def: string) => text('cta', 'Call to action', def, 40);
export const url = (def = 'floatline.app') => text('url', 'URL', def, 40);
export const tag = (def: string) => text('tag', 'Tag', def, 24);
export const badge = (def: string) => text('badge', 'Badge', def, 20);
