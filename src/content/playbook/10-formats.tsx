import { Section, Table } from '@/components/playbook/parts';
import { ArtboardFrame } from '@/components/playbook/ArtboardFrame';
import { GROUPED, PRESETS } from '@/content/templates/registry';
import { VERIFIED_ON } from '@/lib/artboard-sizes';

export function SectionFormats() {
  return (
    <Section
      id="formats" n="10" title="Post formats & templates"
      lead={`${PRESETS.length} templates across ${GROUPED.filter((g) => g.presets.length).length} groups, all editable and exportable in the studio. Sizes were last checked against first-party platform documentation on ${VERIFIED_ON}.`}
    >
      <h3>The catalog</h3>
      <Table
        head={['Group', 'Templates', 'Canvas']}
        rows={GROUPED.filter((g) => g.presets.length > 0).map((g) => [
          <strong key="l">{g.group}</strong>,
          String(g.presets.length),
          <code key="c">
            {[...new Set(g.presets.map((p) => `${p.w}×${p.h}`))].slice(0, 3).join(', ')}
            {new Set(g.presets.map((p) => `${p.w}×${p.h}`)).size > 3 ? ' …' : ''}
          </code>,
        ])}
      />

      <h3>Choosing one</h3>
      <ul>
        <li><strong>Square</strong> — a single point, glanced at. The workhorse.</li>
        <li><strong>Engagement</strong> — denser, built to be read and replied to. Use when the idea needs structure.</li>
        <li><strong>Carousel</strong> — a sequence that only works in order. If the slides could be shuffled, it should have been a square.</li>
        <li><strong>Portrait</strong> — the tallest shape a feed shows in full. Best for a headline with a real lede under it.</li>
        <li><strong>Vertical</strong> — stories and reels. The middle band is all you get; the studio draws the chrome for you.</li>
        <li><strong>Product · kit showcase</strong> — when the point is the product itself rather than a claim about it.</li>
      </ul>

      <h3>Safe areas</h3>
      <p>
        Stories lose 200px at the top and 320px at the bottom to platform chrome. YouTube channel
        art survives only in a 1546×423 band. LinkedIn puts the profile photo over the lower left
        of the cover. The studio renders every one of these as a guide beside the artboard — never
        inside it, so a guide cannot end up in an exported file.
      </p>

      <ArtboardFrame presetId="ve-launch" label="A story, with the safe band respected" maxHeight={460} />
    </Section>
  );
}
