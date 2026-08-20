import { Section, Cards, DoDont } from '@/components/playbook/parts';
import { ArtboardFrame } from '@/components/playbook/ArtboardFrame';
import { BRAND, CAPABILITIES } from '@/content/brand';

export function SectionThesis() {
  return (
    <Section
      id="thesis" n="01" title="Brand thesis"
      lead={`${BRAND.tagline} ${BRAND.promise}`}
    >
      <h3>The category</h3>
      <p>
        Floatline is a <strong>workflow automation</strong> brand. Not a messaging tool, not a
        WhatsApp bot, not a dashboard. The product happens to speak over WhatsApp because that is
        where most of the networks we serve already are — but the channel is an implementation
        detail of the category, never the category itself.
      </p>
      <p>
        The distinction matters commercially. A WhatsApp tool competes with every other WhatsApp
        tool on price. An automation layer competes on how much coordination work it removes, which
        is measured in hours and in money that stopped sitting idle.
      </p>

      <h3>What it does</h3>
      <Cards items={CAPABILITIES.map((c) => ({ title: c.title, body: c.body }))} />

      <h3>Who it is for</h3>
      <p>
        Anyone who coordinates a distributed group of people, terminals or vehicles and currently
        does it by hand. They are not a “user”. They are an <strong>operator</strong>: the person
        the whole network calls when something is unclear, and the bottleneck that creates.
      </p>

      <h3>The one-sentence version</h3>
      <p><em>{BRAND.elevator}</em></p>

      <DoDont
        doTitle="This is Floatline"
        dontTitle="This is not Floatline"
        dos={[
          'Automation that reaches people on the channel they already open',
          'Coordination measured in hours returned and value unstuck',
          'A record of what happened, whether or not it worked',
          'Calm, specific, operator-grade language',
        ]}
        donts={[
          'A chatbot builder, or “AI for WhatsApp”',
          'A dashboard people are supposed to enjoy visiting',
          'A CRM, a helpdesk, or a project tracker',
          'Anything that requires the network to install an app',
        ]}
      />

      <ArtboardFrame presetId="we-hero" label="The thesis, as a website hero" />
    </Section>
  );
}
