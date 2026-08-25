/**
 * WCAG 2.1 contrast, so the design system can state a measured number rather
 * than an opinion.
 *
 * The thresholds are the spec's, not ours:
 *   - Normal text  AA 4.5   AAA 7
 *   - Large text   AA 3     AAA 4.5   (>=24px, or >=18.66px bold)
 *   - Non-text (icons, borders, chart bars) AA 3 — and DECORATIVE fills have
 *     no requirement at all, which is why the float bar keeps --fl-amber-600.
 */

export type Level = 'AAA' | 'AA' | 'AA-large' | 'fail';

/** Accepts #rgb, #rrggbb, and the rgb()/rgba() a computed style returns. */
export function parseColor(input: string): [number, number, number] | null {
  const s = input.trim().toLowerCase();

  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(s);
  if (hex) {
    const h = hex[1]!;
    const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
    const n = parseInt(full, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  const rgb = /^rgba?\(([^)]+)\)$/.exec(s);
  if (rgb) {
    const parts = rgb[1]!.split(/[\s,/]+/).filter(Boolean).map(parseFloat);
    if (parts.length >= 3 && parts.every((p) => Number.isFinite(p))) {
      return [parts[0]!, parts[1]!, parts[2]!];
    }
  }
  return null;
}

const channel = (c: number): number => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};

export function luminance(color: string): number | null {
  const rgb = parseColor(color);
  if (!rgb) return null;
  return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
}

/** 1 (identical) to 21 (black on white). Null if either colour is unparseable. */
export function ratio(a: string, b: string): number | null {
  const la = luminance(a);
  const lb = luminance(b);
  if (la === null || lb === null) return null;
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

export function levelFor(r: number, large = false): Level {
  if (large) {
    if (r >= 4.5) return 'AAA';
    if (r >= 3) return 'AA';
    return 'fail';
  }
  if (r >= 7) return 'AAA';
  if (r >= 4.5) return 'AA';
  if (r >= 3) return 'AA-large';
  return 'fail';
}

export const passesAA = (r: number, large = false): boolean => r >= (large ? 3 : 4.5);

export const format = (r: number): string => r.toFixed(2);
