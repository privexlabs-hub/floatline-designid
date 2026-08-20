import { Section, Table } from '@/components/playbook/parts';

export function SectionCadence() {
  return (
    <Section
      id="cadence" n="13" title="Cadence & publishing OS"
      lead="A cadence that survives a bad week. Everything here is sized so one person can run it alongside building the product, because that is who runs it."
    >
      <h3>The week</h3>
      <Table
        head={['Day', 'Surface', 'Kind']}
        rows={[
          ['Monday', 'Newsletter + LinkedIn', 'The line, and a square carrying it'],
          ['Tuesday', 'X', 'Teaching thread or a mechanic'],
          ['Wednesday', 'LinkedIn + Instagram', 'Proof — a quote or a stat with a name on it'],
          ['Thursday', 'X + stories', 'Point of view, and a story asking for replies'],
          ['Friday', 'Changelog + stories', 'What shipped. Short, factual, no fanfare.'],
        ]}
      />

      <h3>The loop</h3>
      <ol>
        <li><strong>Collect.</strong> Every operator call produces one line worth publishing. Write it down that day or it is gone.</li>
        <li><strong>Draft.</strong> Batch on Monday morning. One sitting, the whole week.</li>
        <li><strong>Make.</strong> Open the studio, pick the template, switch the vertical, export the group as a ZIP.</li>
        <li><strong>Schedule.</strong> Queue everything at once. Nothing is published live except replies.</li>
        <li><strong>Review.</strong> Friday: what got replies, not what got likes.</li>
      </ol>

      <h3>Rules</h3>
      <ul>
        <li>Skipping is allowed. Posting filler is not.</li>
        <li>Never schedule a launch and a teaching post on the same day; they compete.</li>
        <li>If a post needs a thread to make sense, it was a carousel.</li>
        <li>Reply within the hour or not at all — a two-day-old reply reads as automated, which is a bad look for us specifically.</li>
      </ul>
    </Section>
  );
}
