import { Section, Cards } from '@/components/playbook/parts';
import { ArtboardFrame } from '@/components/playbook/ArtboardFrame';
import { BRAND } from '@/content/brand';

export function SectionDirection() {
  return (
    <Section
      id="direction" n="18" title="Creative direction summary"
      lead={`If you read one section, read this one. ${BRAND.tagline}`}
    >
      <Cards
        items={[
          { title: 'The category is automation', body: 'Not messaging, not WhatsApp, not chat. Channels are how the product reaches people; they are not what it is. Anything that reads as “WhatsApp tool” is off-brand now.' },
          { title: 'The buyer is an operator', body: 'Busy, mid-task, sceptical, and the bottleneck in their own network. Address them directly, in their own nouns, with numbers.' },
          { title: 'Warm paper, flat colour', body: 'Green, amber, red on warm paper with warm shadows. No gradients, no neon, no cold grey. A ledger, not a dashboard.' },
          { title: 'The motifs carry the brand', body: 'The float bar, the receipt rule, the status dot, the read fraction. Four shapes that make a layout unmistakably Floatline before a word is read.' },
          { title: 'Specific beats clever', body: '“₦300,000 idle since 11am” does more work than any headline we could write about it.' },
          { title: 'Calm', body: 'No exclamation points, no celebration, no urgency theatre. The product is for people whose day is already loud enough.' },
        ]}
      />

      <h3>The five-second test</h3>
      <p>
        Put any asset in front of someone for five seconds and take it away. If they cannot say what
        the product does and what number was on it, the asset failed — regardless of how it looks.
      </p>

      <ArtboardFrame presetId="co-close" label="Where every sequence ends" />
    </Section>
  );
}
