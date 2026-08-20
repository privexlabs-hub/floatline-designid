import { Section, Table, DoDont } from '@/components/playbook/parts';

export function SectionSeo() {
  return (
    <Section
      id="seo" n="14" title="SEO & discoverability"
      lead="Floatline is searched for by problem, not by category. Nobody types “workflow automation platform” — they type “send one message to all my agents”."
    >
      <h3>Query shapes worth owning</h3>
      <Table
        head={['Shape', 'Example', 'Answered by']}
        rows={[
          ['Job to be done', '“send one whatsapp message to many contacts”', 'A teaching post and a docs page'],
          ['Tool comparison', '“whatsapp broadcast vs group”', 'The comparison template, plus a real page'],
          ['Vertical + task', '“pos agent float management”', 'The agent-networks vertical page'],
          ['Failure', '“whatsapp broadcast not delivering”', 'A genuinely useful troubleshooting page'],
        ]}
      />

      <h3>On-page</h3>
      <ul>
        <li>Every page has an Open Graph card generated from the brand assets, at 1200×630. A page without one gets a grey box in every share.</li>
        <li>Titles state the job, not the brand: “Send one broadcast to your whole network · Floatline”.</li>
        <li>Alt text on every image, written as the sentence the image says. The studio exports it alongside batches.</li>
        <li>Docs and changelog are indexable. They are most of the long-tail surface area.</li>
      </ul>

      <h3>Hashtags</h3>
      <DoDont
        doTitle="Worth using"
        dontTitle="Not worth using"
        dos={[
          'Two or three, at the end, on Instagram and LinkedIn only',
          'Vertical-specific ones where a real community exists',
          'Location tags when the proof is local',
        ]}
        donts={[
          'Hashtags on X — they suppress reach and read as spam',
          'Stacks of fifteen generic tags',
          '#AI, #automation, #startup, #entrepreneur',
          'Branded hashtags nobody has ever typed',
        ]}
      />
    </Section>
  );
}
