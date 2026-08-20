import { Section, DoDont, Table } from '@/components/playbook/parts';
import { LOCKUP, MARK } from '@/lib/brand-geometry';

export function SectionLogo() {
  return (
    <Section
      id="logo" n="08" title="Logo & lockups"
      lead="The mark is a rounded square holding a line, a float bar and five nodes: the line the network runs on, the capacity moving along it, and the members it reaches."
    >
      <h3>The files</h3>
      <Table
        head={['File', 'Use']}
        rows={[
          [<code key="a">logo/floatline-mark.svg</code>, 'The mark alone, full colour. App icons, avatars, favicons.'],
          [<code key="b">logo/floatline-wordmark.svg</code>, 'Horizontal lockup on a light ground. The default.'],
          [<code key="c">logo/floatline-wordmark-dark.svg</code>, 'Horizontal lockup on a dark or brand-green ground.'],
          [<code key="d">logo/floatline-lockup-stacked.svg</code>, 'Stacked lockup for square and centred placements.'],
          [<code key="e">logo/floatline-mark-mono.svg</code>, 'One colour, inherits currentColor. Print, embroidery, fax-grade reproduction.'],
          [<code key="f">logo/floatline-mark-outline.svg</code>, 'Outline only. Etching, watermarks, single-weight contexts.'],
        ]}
      />

      <h3>Clear space and minimum sizes</h3>
      <ul>
        <li>Clear space on every side is <strong>{LOCKUP.clearSpace}×</strong> the mark&rsquo;s height. Nothing enters it — not type, not a rule, not a photo edge.</li>
        <li>Minimum mark size is <strong>{LOCKUP.minMarkSize}px</strong>. Below that the five nodes close up and it reads as a solid square.</li>
        <li>Minimum wordmark width is <strong>{LOCKUP.minWordmarkWidth}px</strong>. Below that, drop the word and use the mark.</li>
        <li>The favicon is a deliberately simplified mark — square plus the two-tone float bar, no nodes — because at 16px the nodes disappear.</li>
      </ul>

      <h3>Construction</h3>
      <p>
        The mark is built on a {MARK.box}-unit grid with a {Math.round(MARK.corner * MARK.box)}-unit
        corner radius. Those ratios live in <code>src/lib/brand-geometry.ts</code>, and both the
        React <code>&lt;Mark/&gt;</code> and the generated SVG files read from it — the asset build
        fails if the two ever disagree, so the drawn logo and the shipped file cannot drift.
      </p>

      <DoDont
        dos={[
          'Use the supplied files at any scale — they are vector',
          'Put the light lockup on paper or canvas, the dark one on green or ink',
          'Use the mono mark when a process allows only one colour',
          'Keep the float bar’s amber; it is the only accent in the mark',
        ]}
        donts={[
          'Redraw, restretch, rotate or add effects to the mark',
          'Recolour it outside the supplied variants',
          'Set the wordmark in any face other than Bricolage Grotesque',
          'Place the full-colour mark on a mid-tone photograph',
        ]}
      />
    </Section>
  );
}
