import { CANVAS } from '@/lib/artboard-sizes';
import type { Preset, Field } from '../types';
import { text } from '../fields';
import type { Surface } from '@/lib/tokens';

const G = 'Avatar · 400×400';

const av = (id: string, name: string, shape: string, surface: Surface, fields: Field[] = [], props: Record<string, unknown> = {}): Preset => ({
  id: `av-${id}`, group: G, name, layout: 'avatar', ...CANVAS.avatar, surface,
  props: { shape, ...props }, fields,
});

/**
 * Circle-cropped everywhere, so every variant keeps its content well inside the
 * inscribed circle (SAFE_AREAS.avatar is 28px on each side).
 *
 * DEVIATION, deliberate and documented: the brief asked for "Avatar · Radial
 * (campaign)". Floatline's own rule is "never invent a gradient — this is a
 * flat-colour brand on warm paper." The campaign slot is therefore FLOAT:
 * flat concentric bands taken from the logo's float bar. Same job, no rule
 * broken. See README → Deviations.
 */
export const AVATAR_PRESETS: Preset[] = [
  av('green', 'Avatar · Green (default)', 'mark', 'inverted'),
  av('ink', 'Avatar · Ink (stealth)', 'mark', 'ink'),
  av('white', 'Avatar · White (light surface)', 'mark', 'mono'),
  av('float', 'Avatar · Float (campaign)', 'float', 'green'),
  av('mono', 'Avatar · Monochrome', 'mark', 'mono', [], { tone: 'auto' }),
  av('inverted', 'Avatar · Inverted', 'mark', 'paper'),
  av('symbol', 'Avatar · Symbol / mark', 'monogram', 'green'),
  av('initials', 'Avatar · Person / founder', 'initials', 'amber', [text('initials', 'Initials', 'AO', 3)]),
];
