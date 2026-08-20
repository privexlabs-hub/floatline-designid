import type { Metadata } from 'next';
import Link from 'next/link';
import { ColourRamps, SurfaceGrid, TypeScale, SpacingScale, Radii, Shadows } from './Foundations';
import { AUTOMATION_ICONS, MARKS, TEXTURES } from '@/lib/tokens';
import { LOCKUP } from '@/lib/brand-geometry';

export const metadata: Metadata = {
  title: 'Design system',
  description: 'Floatline foundations — colour, type, spacing, radii, shadow, iconography, logo files and every downloadable brand asset.',
};

const ASSETS: { group: string; files: { path: string; note: string }[] }[] = [
  {
    group: 'Logo',
    files: [
      { path: MARKS.mark, note: 'The mark, full colour' },
      { path: MARKS.wordmark, note: 'Horizontal lockup, light ground' },
      { path: MARKS.wordmarkDark, note: 'Horizontal lockup, dark ground' },
      { path: MARKS.lockupStacked, note: 'Stacked lockup' },
      { path: MARKS.markMono, note: 'One colour, inherits currentColor' },
      { path: MARKS.markOutline, note: 'Outline only' },
    ],
  },
  {
    group: 'Favicon & app icons',
    files: [
      { path: '/brand/favicon/favicon.svg', note: 'Simplified mark — legible at 16px' },
      { path: '/brand/favicon/favicon-32.png', note: '32×32' },
      { path: '/brand/favicon/favicon-96.png', note: '96×96' },
      { path: '/brand/favicon/apple-touch-icon.png', note: '180×180' },
      { path: '/brand/favicon/icon-192.png', note: '192×192' },
      { path: '/brand/favicon/icon-512.png', note: '512×512' },
      { path: '/brand/favicon/icon-maskable-512.png', note: '512×512, Android safe zone' },
      { path: '/brand/favicon/site.webmanifest', note: 'Web app manifest' },
    ],
  },
  {
    group: 'Open Graph',
    files: [
      { path: '/brand/og/og-default.png', note: '1200×630 — site default' },
      { path: '/brand/og/og-playbook.png', note: '1200×630 — playbook' },
      { path: '/brand/og/og-editor.png', note: '1200×630 — studio' },
    ],
  },
  {
    group: 'Textures',
    files: [
      { path: TEXTURES.receiptPaper, note: 'Receipt-paper pattern — dotted and dashed' },
      { path: TEXTURES.paperGrain, note: 'Fine paper grain' },
    ],
  },
];

function Block({ id, n, title, lead, children }: { id: string; n: string; title: string; lead?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="ds-block">
      <div className="pb-num">{n}</div>
      <h2>{title}</h2>
      {lead ? <p className="pb-lead">{lead}</p> : null}
      <div style={{ marginTop: 'var(--sp-5)' }}>{children}</div>
    </section>
  );
}

export default function Page() {
  return (
    <main className="shell" style={{ paddingBlock: 'var(--sp-7) var(--sp-11)' }}>
      <Link href="/" className="tag-link">← floatline</Link>
      <h1 className="fl-display-2" style={{ marginTop: 'var(--sp-4)' }}>design system</h1>
      <p className="pb-lead">
        The foundations, read back out of the live stylesheet. Every value below is what the browser
        actually computed, not a printed copy of it.
      </p>
      <hr className="receipt" />

      <Block id="colour" n="00" title="Colour" lead="Brand green, amber for value in motion, red for critical only, on warm paper.">
        <ColourRamps />
      </Block>

      <Block id="surfaces" n="01" title="Artboard surfaces" lead="Seven grounds. An artboard is themed entirely through a handful of --art-* properties, which is why one template renders correctly on all of them.">
        <SurfaceGrid />
      </Block>

      <Block id="type" n="02" title="Type scale" lead="Bricolage Grotesque for display, Manrope for UI and body, IBM Plex Mono for money and IDs. All self-hosted.">
        <TypeScale />
      </Block>

      <Block id="spacing" n="03" title="Spacing" lead="A 4-point base grid.">
        <SpacingScale />
      </Block>

      <Block id="radii" n="04" title="Radii" lead="Gently rounded, not pill-everywhere. Receipt blocks stay sharper on purpose.">
        <Radii />
      </Block>

      <Block id="shadow" n="05" title="Elevation" lead="Warm-tinted, never blue-black. Three steps and a press state.">
        <Shadows />
      </Block>

      <Block id="motifs" n="06" title="Motifs" lead="Four shapes that make a layout unmistakably Floatline before a word is read.">
        <div className="auto-grid ds-grid">
          <div className="card">
            <h4>Float bar</h4>
            <div style={{ marginTop: 12, height: 14, borderRadius: 999, background: 'var(--fl-green-200)', overflow: 'hidden' }}>
              <div style={{ width: '62%', height: '100%', background: 'var(--fl-amber-600)', borderRadius: 999 }} />
            </div>
            <p className="note" style={{ marginTop: 10 }}>Capacity, progress, float. It is in the logo.</p>
          </div>
          <div className="card">
            <h4>Receipt rule</h4>
            <hr className="receipt" />
            <p className="note">A 1.5px dashed divider. The brand&rsquo;s rhythm.</p>
          </div>
          <div className="card">
            <h4>Status dot</h4>
            <div className="row" style={{ marginTop: 12 }}>
              {[['#29B26A', 'ON-TRACK'], ['#E89B2C', 'AT-RISK'], ['#C8362A', 'FAILED']].map(([c, l]) => (
                <span key={l} className="row" style={{ gap: 6 }}>
                  <i style={{ width: 10, height: 10, borderRadius: 999, background: c, display: 'block' }} />
                  <span className="fl-micro">{l}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="card">
            <h4>Read fraction</h4>
            <p className="fl-money" style={{ fontSize: 22, marginTop: 12, color: 'var(--fg)' }}>29 / 32 read</p>
            <p className="note" style={{ marginTop: 8 }}>Always with the slash spaced. Never a percentage.</p>
          </div>
        </div>
      </Block>

      <Block id="icons" n="07" title="Iconography" lead="Lucide is the line-icon source of truth — a substitution, not a bespoke set. These ten glyphs are drawn in-house because they carry brand meaning nothing generic can.">
        <div className="auto-grid-sm ds-grid">
          {AUTOMATION_ICONS.map((name) => (
            <a key={name} href={`/brand/icons/${name}.svg`} download className="ds-icon">
              <span
                className="icon icon-lg"
                role="img"
                aria-label={`${name} icon`}
                style={{ ['--icon' as string]: `url(/brand/icons/${name}.svg)`, color: 'var(--fl-green-800)' }}
              />
              <code>{name}</code>
            </a>
          ))}
        </div>
      </Block>

      <Block id="logo" n="08" title="Logo" lead={`Clear space is ${LOCKUP.clearSpace}× the mark's height on every side. Minimum mark size ${LOCKUP.minMarkSize}px; below ${LOCKUP.minWordmarkWidth}px wide, drop the wordmark.`}>
        <div className="auto-grid ds-grid">
          <div className="ds-lockup" style={{ background: 'var(--fl-paper)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={MARKS.wordmark} alt="Floatline wordmark on paper" style={{ width: 'min(100%, 260px)' }} />
          </div>
          <div className="ds-lockup" style={{ background: 'var(--fl-green-900)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={MARKS.wordmarkDark} alt="Floatline wordmark on green" style={{ width: 'min(100%, 260px)' }} />
          </div>
          <div className="ds-lockup" style={{ background: 'var(--fl-canvas)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={MARKS.lockupStacked} alt="Floatline stacked lockup" style={{ width: 'min(100%, 170px)' }} />
          </div>
        </div>
      </Block>

      <Block id="assets" n="09" title="Assets" lead="Every brand file, downloadable. Rasters are generated from the SVG sources by npm run assets:build — none is hand-placed.">
        {ASSETS.map((g) => (
          <div key={g.group} style={{ marginBottom: 'var(--sp-6)' }}>
            <h3>{g.group}</h3>
            <div className="scroll-x">
              <table className="pb-table">
                <thead><tr><th>File</th><th>What it is</th><th /></tr></thead>
                <tbody>
                  {g.files.map((f) => (
                    <tr key={f.path}>
                      <td><code>{f.path.replace('/brand/', '')}</code></td>
                      <td>{f.note}</td>
                      <td><a href={f.path} download>Download</a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
        <p className="note">
          Fonts are under <code>/brand/fonts/</code> with a manifest listing every face, its source
          URL, byte length and SHA-256. They are licensed under the SIL Open Font License 1.1.
        </p>
      </Block>
    </main>
  );
}
