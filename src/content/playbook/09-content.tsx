import { Section, Cards, Table } from '@/components/playbook/parts';

export function SectionContent() {
  return (
    <Section
      id="content" n="09" title="Content strategy"
      lead="Floatline earns attention by being specific about a job most people do badly and quietly. The content is proof, not persuasion."
    >
      <h3>Four pillars</h3>
      <Cards
        items={[
          { title: 'The cost of coordinating by hand', body: 'Name the hours, the missed messages, the idle capacity. This is the pillar that makes someone recognise themselves.' },
          { title: 'How the work actually works', body: 'Anatomy of a run, what a delivery report should contain, why retries matter. Teaching, not teasing.' },
          { title: 'Operators, in their own words', body: 'Quotes, numbers and case studies with a name and a network size attached. No anonymous “a customer”.' },
          { title: 'Built in the open', body: 'Changelog, decisions we reversed, what we refuse to build. Credibility compounds faster than reach.' },
        ]}
      />

      <h3>Ratio</h3>
      <Table
        head={['Share', 'Kind', 'Why']}
        rows={[
          ['40%', 'Teaching', 'Earns the follow. Useful whether or not they buy.'],
          ['25%', 'Proof', 'Converts the follow. Numbers with names on them.'],
          ['20%', 'Point of view', 'Makes us worth following rather than bookmarking.'],
          ['15%', 'Product', 'Launches, changelog, direct asks. Enough to be findable, not enough to be a feed of press releases.'],
        ]}
      />

      <h3>Rules</h3>
      <ul>
        <li>Every claim carries its source in the asset itself, not in the caption. Captions get stripped when images are reshared.</li>
        <li>One idea per asset. A carousel is for a sequence; a square is for a single point.</li>
        <li>If a post would work for any automation company, it is not a Floatline post.</li>
        <li>Never post a number we have not seen ourselves.</li>
      </ul>
    </Section>
  );
}
