'use client';

import { Section, DoDont, Table } from '@/components/playbook/parts';
import { ArtboardFrame } from '@/components/playbook/ArtboardFrame';
import { PALETTE, SURFACES, SURFACE_ART } from '@/lib/tokens';
import { NON_NEGOTIABLES } from '@/content/brand';

export function SectionVisual() {
  return (
    <Section
      id="visual" n="07" title="Visual identity"
      lead="Calm operator, warm paper. A well-kept ledger in a shop in Yaba, not a Western SaaS dashboard. Every rule below exists to keep it from drifting back towards the default."
    >
      <h3>Palette</h3>
      <div className="pb-cards auto-grid-sm">
        {PALETTE.map((c) => (
          <div
            key={c.name}
            className="pb-swatch"
            style={{
              background: c.hex,
              color: ['#F7F2E8', '#FBF8F0', '#E89B2C'].includes(c.hex) ? '#1A1410' : '#F7F2E8',
            }}
          >
            <b>{c.name}</b>
            <code>{c.hex}</code>
          </div>
        ))}
      </div>
      <Table head={['Colour', 'Token', 'Use']} rows={PALETTE.map((c) => [c.name, <code key="t">{c.token}</code>, c.use])} />

      <h3>Surfaces</h3>
      <p>
        An artboard is themed entirely through a handful of <code>--art-*</code> custom properties.
        That is what lets one template render correctly on seven grounds instead of needing seven
        templates. No layout may read a raw brand token.
      </p>
      <div className="pb-cards auto-grid-sm">
        {SURFACES.map((s) => {
          const art = SURFACE_ART[s.id];
          return (
            <div key={s.id} className="pb-swatch" style={{ background: art.bg, color: art.fg, borderColor: art.rule }}>
              <b>{s.label}</b>
              <code style={{ color: art.muted }}>{s.hint}</code>
            </div>
          );
        })}
      </div>

      <h3>Type</h3>
      <ul>
        <li><strong>Bricolage Grotesque</strong> 700–800 — display and headlines. Lowercase, tightly tracked. Its optical-size axis is why large settings hold together.</li>
        <li><strong>Manrope</strong> 400–700 — UI and body. Sentence case.</li>
        <li><strong>IBM Plex Mono</strong> 400–600 — money, IDs, fractions, timestamps. Tabular figures so columns align.</li>
      </ul>
      <p>
        All three are self-hosted. That is not a preference: <code>html-to-image</code> reads
        <code> document.styleSheets</code> to embed faces into an export, and a cross-origin sheet
        throws a security error that it swallows — every exported asset would silently ship in a
        fallback typeface.
      </p>

      <h3>Motifs</h3>
      <ul>
        <li><strong>The float bar</strong> — a track with a filled portion. It is in the logo, and it generalises to any capacity or progress reading.</li>
        <li><strong>The receipt rule</strong> — a 1.5px dashed divider. It is the brand&rsquo;s rhythm; it separates sections in cards, digests and artboards.</li>
        <li><strong>Status dot + micro label</strong> — a coloured dot and an uppercase label. Never an emoji outside a chat surface.</li>
        <li><strong>The read fraction</strong> — <code>29 / 32 read</code>, always with the slash spaced.</li>
      </ul>

      <h3>Non-negotiables</h3>
      <ul>{NON_NEGOTIABLES.map((n) => <li key={n}>{n}</li>)}</ul>

      <DoDont
        dos={[
          'Flat colour on warm paper',
          'Warm-tinted shadows (a hint of brown)',
          'Hairlines at 10% and 18% ink',
          'Initials on a colour for avatars',
        ]}
        donts={[
          'Gradients, glows, neon, glassmorphism',
          'Blue-black shadows or cold grey neutrals',
          'A coloured left-border accent on cards',
          'Stock photography or generated faces',
        ]}
      />

      <ArtboardFrame presetId="sq-big-stat" label="The amber surface, carrying a money signal" />
    </Section>
  );
}
