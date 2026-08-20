import { Section, Table } from '@/components/playbook/parts';
import { ArtboardFrame } from '@/components/playbook/ArtboardFrame';

export function SectionNewsletter() {
  return (
    <Section
      id="newsletter" n="12" title="Newsletter system"
      lead="One operating idea, every Monday. The newsletter is where the teaching pillar lives at full length, and it is the only place Floatline writes more than a screen at a time."
    >
      <h3>The Monday line</h3>
      <Table
        head={['Block', 'Length', 'Job']}
        rows={[
          ['The line', '1 sentence', 'The idea, stated so it can be quoted without the rest.'],
          ['The case', '150–250 words', 'Where it came from. A real network, a real number.'],
          ['The mechanic', '100–200 words', 'How to actually do it, whether or not you use Floatline.'],
          ['The receipt', '1 number', 'What it was worth, sourced.'],
          ['One ask', '1 line', 'Reply, read the case study, or start free. Exactly one.'],
        ]}
      />

      <h3>Rules</h3>
      <ul>
        <li>The subject line is the idea, not a tease. “The morning call costs 40 minutes” beats “Is your morning broken?”</li>
        <li>Plain text first. Images are illustrations, never the message — many recipients block them.</li>
        <li>Every image carries alt text. The studio writes an <code>alt-text.csv</code> beside batch exports for exactly this.</li>
        <li>Unsubscribe is in the footer of every send, one click, no confirmation flow.</li>
      </ul>

      <h3>Assets</h3>
      <p>
        Email images export at 600px CSS width — the width every client renders at — and are read at
        2x on a phone. The studio&rsquo;s email presets already use a 600 baseline for type, so an
        email asset is not a squeezed social asset.
      </p>

      <ArtboardFrame presetId="em-newsletter" label="Newsletter body block · 600×800" maxHeight={420} />
    </Section>
  );
}
