import { Section, Table, DoDont } from '@/components/playbook/parts';
import { VOICE } from '@/content/brand';
import { VERTICALS } from '@/content/verticals';

export function SectionVoice() {
  return (
    <Section
      id="voice" n="06" title="Voice & tone"
      lead="An operator's voice: direct, specific about money and time, and calm. The reader is busy, mid-task, and has been let down by software before."
    >
      <h3>The voice is</h3>
      <ul>{VOICE.is.map((v) => <li key={v}>{v}</li>)}</ul>

      <h3>The voice is not</h3>
      <ul>{VOICE.isNot.map((v) => <li key={v}>{v}</li>)}</ul>

      <h3>Rewrites</h3>
      <p>Every row below is a real edit, not an invented strawman.</p>
      <Table
        head={['Instead of', 'Write']}
        rows={VOICE.examples.map((e) => [<em key="b" style={{ color: 'var(--fl-red-700)' }}>{e.bad}</em>, <strong key="g">{e.good}</strong>])}
      />

      <h3>Tone by vertical</h3>
      <p>
        The voice does not change between verticals. The <em>nouns</em> do. Using a vertical&rsquo;s
        own vocabulary is the difference between sounding like you have met the buyer and sounding
        like you have read about them.
      </p>
      <Table
        head={['Vertical', 'The operator is a…', 'The network is…', 'The unit of work']}
        rows={VERTICALS.map((v) => [v.label, v.operator, v.network, v.unit])}
      />

      <h3>Numbers</h3>
      <DoDont
        dos={[
          'Money with the symbol first, in the mono face: ₦25,000',
          'Delivery as a fraction with spaces: 29 / 32 read',
          'Time saved as a range when it is a range: 2–4 hrs/day',
          'A source for every claim, even if it is “across 40 networks”',
        ]}
        donts={[
          '“NGN 25,000”, “25,000 Naira”, “25k”',
          '“90% delivered” when you can say 29 / 32',
          '“Save time”, “boost efficiency”, “10x your ops”',
          'A percentage with no denominator anywhere near it',
        ]}
      />
    </Section>
  );
}
