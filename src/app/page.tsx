import Link from 'next/link';
import { BRAND, CAPABILITIES, CHANNELS } from '@/content/brand';
import { VERTICALS } from '@/content/verticals';
import { PRESETS, GROUPED } from '@/content/templates/registry';
import { TOC } from '@/content/playbook';

const DOORS = [
  { href: '/playbook/', n: '01', title: 'Brand playbook', body: `${TOC.filter((t) => t.kind === 'item').length} sections: positioning, channel strategy, voice, visual identity, formats, cadence and governance.` },
  { href: '/editor/', n: '02', title: 'Studio', body: `${PRESETS.length} templates across ${GROUPED.filter((g) => g.presets.length).length} groups. Edit, switch surface and vertical, export PNG / JPEG / WebP / SVG / PDF — one at a time or the whole kit as a ZIP.` },
  { href: '/design-system/', n: '03', title: 'Design system', body: 'Colour, type, spacing, radii, elevation, motifs and iconography — read back out of the live stylesheet. Every brand asset, downloadable.' },
  { href: '/ui-kits/', n: '04', title: 'UI kits', body: 'The brand on product surfaces: a multi-channel conversation and the operator console, as live responsive React.' },
];

export default function Home() {
  return (
    <main>
      <section className="hero-pattern" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="shell" style={{ paddingBlock: 'var(--sp-10) var(--sp-11)' }}>
          <div className="row" style={{ gap: 'var(--sp-3)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo/floatline-mark.svg" alt="" width={40} height={40} />
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: '-0.035em', color: 'var(--fl-green-900)' }}>
              floatline
            </strong>
            <span className="tag">Brand system</span>
          </div>

          <h1 className="fl-display-1" style={{ marginTop: 'var(--sp-7)', maxWidth: '15ch' }}>
            {BRAND.tagline.toLowerCase().replace(/\.$/, '')}
          </h1>
          <p style={{ marginTop: 'var(--sp-5)', maxWidth: '58ch', fontSize: 'var(--fs-body-lg)', lineHeight: 1.55 }}>
            {BRAND.promise}
          </p>

          <div className="row" style={{ marginTop: 'var(--sp-6)', gap: 'var(--sp-2)' }}>
            {CHANNELS.map((c) => <span key={c.id} className="tag">{c.label}</span>)}
          </div>

          <div className="row" style={{ marginTop: 'var(--sp-7)' }}>
            <Link href="/playbook/" className="btn" data-tone="primary">Read the playbook</Link>
            <Link href="/editor/" className="btn">Open the studio</Link>
          </div>
        </div>
      </section>

      <section className="shell" style={{ paddingBlock: 'var(--sp-9)' }}>
        <span className="fl-micro">What it does</span>
        <div className="auto-grid" style={{ marginTop: 'var(--sp-5)' }}>
          {CAPABILITIES.map((c) => (
            <div className="card" key={c.id}>
              <div className="cap-head">
                <span
                  className="icon"
                  aria-hidden="true"
                  style={{ ['--icon' as string]: `url(/brand/icons/${c.icon}.svg)`, color: 'var(--accent)' }}
                />
                <h3 style={{ fontSize: 'var(--fs-h4)' }}>{c.title}</h3>
              </div>
              <p style={{ marginTop: 'var(--sp-3)', fontSize: 'var(--fs-small)' }}>{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="shell" style={{ paddingBlock: 'var(--sp-6) var(--sp-9)' }}>
        <hr className="receipt" />
        <span className="fl-micro">Five verticals, one brand</span>
        <div className="auto-grid" style={{ marginTop: 'var(--sp-5)' }}>
          {VERTICALS.map((v, i) => (
            <div className="card" key={v.id}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: 'var(--fs-h4)' }}>{v.label}</h3>
                {i === 0 ? <span className="tag">Flagship</span> : null}
              </div>
              <p style={{ marginTop: 'var(--sp-3)', fontSize: 'var(--fs-small)' }}>{v.summary}</p>
              <p className="fl-money" style={{ marginTop: 'var(--sp-3)', color: 'var(--fl-amber-700)', fontWeight: 700 }}>
                {v.copy.stat} <span className="fl-micro" style={{ fontWeight: 500 }}>{v.copy.statLabel}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="shell" style={{ paddingBlock: 'var(--sp-6) var(--sp-11)' }}>
        <hr className="receipt" />
        <span className="fl-micro">Four doors</span>
        <div className="auto-grid" style={{ marginTop: 'var(--sp-5)' }}>
          {DOORS.map((d) => (
            <Link key={d.href} href={d.href} className="card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <span className="fl-micro" style={{ color: 'var(--fl-amber-700)' }}>{d.n}</span>
              <h3 style={{ marginTop: 'var(--sp-2)' }}>{d.title}</h3>
              <p style={{ marginTop: 'var(--sp-3)', fontSize: 'var(--fs-small)' }}>{d.body}</p>
              <span style={{ display: 'inline-block', marginTop: 'var(--sp-4)', color: 'var(--accent)', fontWeight: 700, fontSize: 'var(--fs-small)' }}>
                Open →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="shell" style={{ paddingBottom: 'var(--sp-9)' }}>
        <hr className="receipt" />
        <p className="note">
          Frontend only. No backend, no API routes, no telemetry, and nothing loaded from a third
          party at runtime — every font and asset is served from this origin. Exports are rendered
          and encoded in your browser and never uploaded.
        </p>
      </footer>
    </main>
  );
}
