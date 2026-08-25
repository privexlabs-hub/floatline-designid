'use client';

import { useState } from 'react';
import { SURFACES, SURFACE_ART, type Surface } from '@/lib/tokens';
import { ratio, levelFor, format, type Level } from '@/lib/contrast';
import { buildBrandKit, type KitProgress } from '@/lib/brand-kit';
import { saveBlob } from '@/lib/export-image';

/**
 * The contrast table states a measured number rather than an intention.
 *
 * Text and graphics are reported separately because WCAG asks different things
 * of them: 4.5:1 for body text, 3:1 for large text and for graphics that carry
 * meaning, and nothing at all for decoration. Lumping them together is how a
 * float bar ends up being called an accessibility failure.
 */

const TEXT_ROLES = [
  ['fg', 'Primary text'],
  ['fg2', 'Secondary text'],
  ['muted', 'Muted text'],
  ['signalText', 'Amber text'],
] as const;

const GRAPHIC_ROLES = [
  ['signal', 'Signal fill — float bar, chips'],
  ['accent', 'Accent fill — solid chips'],
] as const;

function Badge({ level }: { level: Level }) {
  const tone =
    level === 'AAA' ? { bg: 'var(--fl-green-200)', fg: 'var(--fl-green-800)' }
    : level === 'AA' ? { bg: 'var(--fl-green-100)', fg: 'var(--fl-green-800)' }
    : level === 'AA-large' ? { bg: 'var(--fl-amber-200)', fg: 'var(--fl-amber-800)' }
    : { bg: 'var(--fl-red-200)', fg: 'var(--fl-red-700)' };
  return (
    <span
      style={{
        display: 'inline-block', padding: '2px 8px', borderRadius: 'var(--r-pill)',
        background: tone.bg, color: tone.fg,
        fontSize: 'var(--fs-micro)', fontWeight: 700,
        letterSpacing: 'var(--tr-micro)', textTransform: 'uppercase', whiteSpace: 'nowrap',
      }}
    >
      {level === 'fail' ? 'below AA' : level}
    </span>
  );
}

export function ContrastAudit() {
  const rows = SURFACES.map((s) => {
    const art = SURFACE_ART[s.id as Surface];
    return {
      surface: s,
      art,
      text: TEXT_ROLES.map(([k, label]) => {
        const r = ratio(art[k], art.bg) ?? 0;
        return { k, label, hex: art[k], r, level: levelFor(r) };
      }),
      graphic: GRAPHIC_ROLES.map(([k, label]) => {
        const r = ratio(art[k], art.bg) ?? 0;
        return { k, label, hex: art[k], r };
      }),
    };
  });

  const failing = rows.flatMap((row) => row.text.filter((t) => t.r < 4.5));

  return (
    <>
      <p className={failing.length ? 'warn' : 'note'} style={{ marginBottom: 'var(--sp-5)' }}>
        {failing.length === 0
          ? 'Every text pair on every surface clears WCAG AA. Measured from the tokens below, not asserted.'
          : `${failing.length} text pair(s) below AA — see the rows marked below.`}
      </p>

      <div className="scroll-x">
        <table className="pb-table">
          <thead>
            <tr>
              <th>Surface</th>
              <th>Role</th>
              <th>Colour</th>
              <th>Ratio</th>
              <th>Normal text</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) =>
              row.text.map((t, i) => (
                <tr key={`${row.surface.id}-${t.k}`}>
                  {i === 0 ? (
                    <td rowSpan={row.text.length}>
                      <strong>{row.surface.label}</strong>
                      <br />
                      <code style={{ fontSize: 'var(--fs-micro)' }}>{row.art.bg}</code>
                    </td>
                  ) : null}
                  <td>{t.label}</td>
                  <td>
                    <span
                      aria-hidden="true"
                      style={{
                        display: 'inline-block', width: 12, height: 12, borderRadius: 3,
                        background: t.hex, border: '1px solid var(--border)',
                        marginRight: 8, verticalAlign: -1,
                      }}
                    />
                    <code>{t.hex}</code>
                  </td>
                  <td className="fl-money">{format(t.r)}</td>
                  <td><Badge level={t.level} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h3 style={{ marginTop: 'var(--sp-7)' }}>Graphics</h3>
      <p className="note" style={{ marginTop: 'var(--sp-2)' }}>
        Measured against the page for reference. WCAG asks 3:1 of a graphic that
        carries meaning and nothing of decoration — and for the float bar the
        boundary that matters is the fill against its own track, not against the
        page behind it. Amber stays <code>#E89B2C</code> in all of these.
      </p>
      <div className="scroll-x">
        <table className="pb-table">
          <thead><tr><th>Surface</th><th>Role</th><th>Colour</th><th>vs ground</th></tr></thead>
          <tbody>
            {rows.map((row) =>
              row.graphic.map((g, i) => (
                <tr key={`${row.surface.id}-${g.k}`}>
                  {i === 0 ? <td rowSpan={row.graphic.length}><strong>{row.surface.label}</strong></td> : null}
                  <td>{g.label}</td>
                  <td><code>{g.hex}</code></td>
                  <td className="fl-money">{format(g.r)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function BrandKitButton() {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<KitProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setError(null);
    setBusy(true);
    try {
      const blob = await buildBrandKit(setProgress);
      saveBlob(blob, 'floatline-brand-kit.zip');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  return (
    <div style={{ marginBottom: 'var(--sp-6)' }}>
      <div className="row">
        <button type="button" className="btn" data-tone="primary" onClick={run} disabled={busy}>
          {busy ? 'Packaging…' : 'Download the brand kit'}
        </button>
        <span className="note">
          Logos, favicons, share cards, icons, textures, every font face, tokens.css and palette.json.
        </span>
      </div>
      {progress ? (
        <div style={{ marginTop: 'var(--sp-3)', maxWidth: 420 }}>
          <div className="progress"><i style={{ width: `${(progress.done / Math.max(1, progress.total)) * 100}%` }} /></div>
          <span className="field-count">{progress.done} / {progress.total} · {progress.label}</span>
        </div>
      ) : null}
      {error ? <p className="err" style={{ marginTop: 'var(--sp-3)' }} role="alert">{error}</p> : null}
    </div>
  );
}
