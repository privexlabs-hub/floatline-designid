'use client';

import { useEffect, useState } from 'react';
import { PALETTE, SURFACES, SURFACE_ART } from '@/lib/tokens';

/**
 * Reads the palette back OUT of the live document rather than printing the
 * TypeScript constants. If tokens.css and the typed mirror ever disagree, this
 * page shows the disagreement instead of quietly reprinting the wrong one.
 */
export function ColourRamps() {
  const [live, setLive] = useState<Record<string, string>>({});

  useEffect(() => {
    // Deferred a frame rather than read synchronously: the styles are already
    // committed, and setting state inside the same commit would cascade a
    // second render for values that never change afterwards.
    const id = requestAnimationFrame(() => {
      const cs = getComputedStyle(document.documentElement);
      const out: Record<string, string> = {};
      for (const c of PALETTE) out[c.token] = cs.getPropertyValue(c.token).trim().toUpperCase();
      setLive(out);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="auto-grid-sm ds-grid">
      {PALETTE.map((c) => {
        const actual = live[c.token];
        const drift = actual && actual !== c.hex.toUpperCase();
        return (
          <div key={c.token} className="ds-swatch" style={{ background: c.hex, color: ['#F7F2E8', '#FBF8F0', '#E89B2C'].includes(c.hex) ? '#1A1410' : '#F7F2E8' }}>
            <b>{c.name}</b>
            <code>{actual || c.hex}</code>
            <code style={{ opacity: 0.7 }}>{c.token}</code>
            {drift ? <span className="ds-drift">tokens.css says {actual}</span> : null}
          </div>
        );
      })}
    </div>
  );
}

export function SurfaceGrid() {
  return (
    <div className="auto-grid-sm ds-grid">
      {SURFACES.map((s) => {
        const a = SURFACE_ART[s.id];
        return (
          <div key={s.id} className="ds-swatch" style={{ background: a.bg, color: a.fg, border: `1px solid ${a.rule}` }}>
            <b>{s.label}</b>
            <code style={{ color: a.muted }}>{s.hint}</code>
            <span style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              {[a.fg, a.accent, a.signal, a.muted].map((c, i) => (
                <i key={i} style={{ width: 18, height: 18, borderRadius: 999, background: c, display: 'block' }} />
              ))}
            </span>
          </div>
        );
      })}
    </div>
  );
}

const SCALE = [
  ['Display 1', 'fl-display-1', '64 / 1.04'],
  ['Display 2', 'fl-display-2', '48 / 1.06'],
  ['Heading 1', 'fl-h1', '34 / 1.10'],
  ['Heading 2', 'fl-h2', '26 / 1.16'],
  ['Heading 3', 'fl-h3', '20 / 1.25'],
  ['Heading 4', 'fl-h4', '17 / 1.30'],
  ['Body', 'fl-p', '15 / 1.50'],
  ['Small', 'fl-small', '13 / 1.45'],
  ['Micro', 'fl-micro', '11 / 1.30'],
] as const;

export function TypeScale() {
  return (
    <div className="stack">
      {SCALE.map(([label, cls, size]) => (
        <div key={cls} className="ds-type-row">
          <span className="ds-type-meta">{label} · {size}</span>
          <span className={cls}>Coordination is work</span>
        </div>
      ))}
      <div className="ds-type-row">
        <span className="ds-type-meta">Money · tabular</span>
        <span className="fl-money" style={{ fontSize: 24 }}>₦25,000 · ₦300,000 · 29 / 32</span>
      </div>
    </div>
  );
}

const SPACING = [
  ['sp-1', 4], ['sp-2', 8], ['sp-3', 12], ['sp-4', 16], ['sp-5', 20],
  ['sp-6', 24], ['sp-7', 32], ['sp-8', 40], ['sp-9', 56], ['sp-10', 72], ['sp-11', 96],
] as const;

export function SpacingScale() {
  return (
    <div className="stack">
      {SPACING.map(([token, px]) => (
        <div key={token} className="ds-type-row">
          <span className="ds-type-meta">--{token} · {px}px</span>
          <span style={{ display: 'block', height: 12, width: px, background: 'var(--fl-amber-600)', borderRadius: 3 }} />
        </div>
      ))}
    </div>
  );
}

const RADII = [['r-xs', 4], ['r-sm', 6], ['r-md', 10], ['r-lg', 14], ['r-xl', 20], ['r-pill', 999]] as const;

export function Radii() {
  return (
    <div className="auto-grid-sm ds-grid">
      {RADII.map(([token, px]) => (
        <div key={token} style={{ display: 'grid', gap: 8, placeItems: 'center' }}>
          <span style={{ width: 84, height: 64, background: 'var(--fl-green-800)', borderRadius: px }} />
          <code style={{ fontSize: 11 }}>--{token} · {px === 999 ? 'pill' : `${px}px`}</code>
        </div>
      ))}
    </div>
  );
}

const SHADOWS = [
  ['sh-1', 'Hairline raise — table rows, quiet cards'],
  ['sh-2', 'Lifted card — the default for a raised surface'],
  ['sh-3', 'Floating — menus, modals, drawers'],
] as const;

export function Shadows() {
  return (
    <div className="auto-grid ds-grid">
      {SHADOWS.map(([token, use]) => (
        <div key={token} style={{ background: 'var(--fl-canvas)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-5)', boxShadow: `var(--${token})` }}>
          <code style={{ fontSize: 11 }}>--{token}</code>
          <p style={{ marginTop: 8, fontSize: 13 }}>{use}</p>
        </div>
      ))}
    </div>
  );
}
