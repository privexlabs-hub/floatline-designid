/**
 * A small TYPED MIRROR of tokens.css — deliberately not a codegen pipeline.
 *
 * Only the handful of values that TypeScript genuinely needs live here: the
 * surface list (which the editor enumerates), the flatten colour per surface
 * (which JPEG/WebP/PDF need, because they have no alpha), and the mark paths.
 * Everything else stays in CSS where it belongs.
 */

export const PALETTE = [
  { name: 'Brand green', hex: '#0B6B3A', token: '--fl-green-800', use: 'Primary. Buttons, logo, links.' },
  { name: 'Deep green', hex: '#053D22', token: '--fl-green-900', use: 'Display headings, dark floods.' },
  { name: 'Amber', hex: '#E89B2C', token: '--fl-amber-600', use: 'Capacity, value in motion, at-risk.' },
  { name: 'Critical red', hex: '#C8362A', token: '--fl-red-600', use: 'Failure only. Never decorative.' },
  { name: 'Paper', hex: '#F7F2E8', token: '--fl-paper', use: 'App background. Warm receipt tone.' },
  { name: 'Canvas', hex: '#FBF8F0', token: '--fl-canvas', use: 'Raised card surface on paper.' },
  { name: 'Ink', hex: '#1A1410', token: '--fl-ink', use: 'Text. Warm near-black, never #000.' },
] as const;

export const SURFACES = [
  { id: 'paper', label: 'Paper', hint: 'The default. Warm receipt ground.' },
  { id: 'canvas', label: 'Canvas', hint: 'Quieter paper. Editorial, long copy.' },
  { id: 'ink', label: 'Ink', hint: 'Warm near-black. High contrast, stealth.' },
  { id: 'green', label: 'Green', hint: 'Deep brand flood. Launches, hero moments.' },
  { id: 'amber', label: 'Amber', hint: 'Capacity, money, throughput.' },
  { id: 'mono', label: 'Mono', hint: 'One colour on white. Print, docs, fax-safe.' },
  { id: 'inverted', label: 'Inverted', hint: 'Paper on brand green. Closers and CTAs.' },
] as const;

export type Surface = (typeof SURFACES)[number]['id'];

/**
 * The colour an alpha-less format flattens onto. JPEG has no transparency, so
 * without this an artboard rasterises onto BLACK rather than its own ground.
 * These must match the [data-surface] --art-bg values in artboard.css exactly.
 */
export const SURFACE_BG: Record<Surface, string> = {
  paper: '#F7F2E8',
  canvas: '#FBF8F0',
  ink: '#1A1410',
  green: '#053D22',
  amber: '#FBF1DC',
  mono: '#FFFFFF',
  inverted: '#0B6B3A',
};

/**
 * The resolved artboard palette, per surface.
 *
 * WHY THIS EXISTS, and why it duplicates artboard.css:
 * html-to-image deep-clones inline SVG subtrees VERBATIM — it does not apply
 * computed styles to them. So `fill: var(--art-bg)` inside an <svg> survives
 * the clone unresolved, the custom property is not defined inside the exported
 * foreignObject, and `fill` falls back to its initial value: BLACK. Every mark
 * in every export rasterised as a solid dark square until this was found.
 *
 * HTML elements are fine — their computed values are already resolved when
 * html-to-image copies them — so they keep using var(--art-*). Only SVG needs
 * literals, and this is where the literals live.
 *
 * These MUST match the [data-surface] blocks in artboard.css.
 * scripts/verify-app.mjs reads the values back out of a live artboard and
 * fails if the two ever drift.
 */
export type ArtPalette = {
  bg: string; fg: string; fg2: string; muted: string;
  accent: string; accentFg: string; signal: string; rule: string;
};

export const SURFACE_ART: Record<Surface, ArtPalette> = {
  paper:    { bg: '#F7F2E8', fg: '#053D22', fg2: '#1A1410', muted: '#6B5F54', accent: '#0B6B3A', accentFg: '#F7F2E8', signal: '#E89B2C', rule: 'rgba(26, 20, 16, 0.18)' },
  canvas:   { bg: '#FBF8F0', fg: '#053D22', fg2: '#3D332B', muted: '#6B5F54', accent: '#0B6B3A', accentFg: '#FBF8F0', signal: '#B2731A', rule: 'rgba(26, 20, 16, 0.14)' },
  ink:      { bg: '#1A1410', fg: '#F7F2E8', fg2: '#E4DDD0', muted: '#9C8F82', accent: '#29B26A', accentFg: '#053D22', signal: '#E89B2C', rule: 'rgba(247, 242, 232, 0.22)' },
  green:    { bg: '#053D22', fg: '#F7F2E8', fg2: '#E8F5EE', muted: '#A9C6B5', accent: '#E89B2C', accentFg: '#053D22', signal: '#E89B2C', rule: 'rgba(247, 242, 232, 0.24)' },
  amber:    { bg: '#FBF1DC', fg: '#1A1410', fg2: '#3D332B', muted: '#8A6A34', accent: '#B2731A', accentFg: '#FBF1DC', signal: '#0B6B3A', rule: 'rgba(178, 115, 26, 0.30)' },
  mono:     { bg: '#FFFFFF', fg: '#1A1410', fg2: '#1A1410', muted: '#6B5F54', accent: '#1A1410', accentFg: '#FFFFFF', signal: '#1A1410', rule: 'rgba(26, 20, 16, 0.28)' },
  inverted: { bg: '#0B6B3A', fg: '#F7F2E8', fg2: '#FFFFFF', muted: '#BFDCCB', accent: '#F7F2E8', accentFg: '#0B6B3A', signal: '#FCE6BE', rule: 'rgba(247, 242, 232, 0.30)' },
};

export const MARKS = {
  mark: '/brand/logo/floatline-mark.svg',
  markMono: '/brand/logo/floatline-mark-mono.svg',
  markOutline: '/brand/logo/floatline-mark-outline.svg',
  wordmark: '/brand/logo/floatline-wordmark.svg',
  wordmarkDark: '/brand/logo/floatline-wordmark-dark.svg',
  lockupStacked: '/brand/logo/floatline-lockup-stacked.svg',
} as const;

export const AUTOMATION_ICONS = [
  'trigger', 'branch', 'run', 'webhook', 'connector',
  'node-graph', 'broadcast-fanout', 'float-bar', 'capacity-bar', 'receipt-rule',
] as const;

export const TEXTURES = {
  receiptPaper: '/brand/textures/pattern-receipt-paper.svg',
  paperGrain: '/brand/textures/paper-grain.svg',
} as const;
