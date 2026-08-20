/**
 * The single source of truth for logo proportions.
 *
 * Both the React <Logo/> and scripts/build-brand-assets.mjs read these numbers,
 * so the on-screen lockup and the generated SVG/PNG files cannot drift apart.
 * All ratios are relative to the mark's own 96-unit box.
 */
export const MARK = {
  box: 96,
  corner: 22 / 96,
  /** The float bar: a full track with a filled portion. The brand's core motif. */
  bar: { x: 18 / 96, y: 46 / 96, w: 60 / 96, h: 10 / 96, fill: 34 / 60, radius: 5 / 96 },
  /** The upper rail — the "line" half of floatline. */
  rail: { x: 18 / 96, y: 28 / 96, w: 60 / 96, h: 10 / 96 },
  /** Five nodes: the network the automation runs over. */
  nodes: { count: 5, y: 70 / 96, r: 3 / 96, from: 24 / 96, to: 72 / 96, accentIndex: 2 },
} as const;

export const LOCKUP = {
  horizontal: { gap: 20 / 96, wordSize: 48 / 96, baseline: 63 / 96, tracking: -1.4 / 48 },
  stacked: { gap: 24 / 96, wordSize: 48 / 96, tracking: -1.4 / 48 },
  /** Minimum clear space on every side, as a multiple of the mark's height. */
  clearSpace: 0.5,
  /** Below this the wordmark is illegible — use the mark alone. */
  minWordmarkWidth: 120,
  minMarkSize: 20,
} as const;

export const LOGO_COLORS = {
  ground: '#0B6B3A',
  groundDeep: '#053D22',
  paper: '#F7F2E8',
  accent: '#E89B2C',
  tintOnDark: '#C6E8D2',
} as const;
