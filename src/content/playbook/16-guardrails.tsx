import { Section, DoDont } from '@/components/playbook/parts';
import { NON_NEGOTIABLES } from '@/content/brand';

export function SectionGuardrails() {
  return (
    <Section
      id="guardrails" n="16" title="Brand guardrails"
      lead="The short list. Breaking one of these is a brand bug, and should be treated like any other bug — reported, fixed, and the cause understood."
    >
      <h3>Visual</h3>
      <ul>{NON_NEGOTIABLES.map((n) => <li key={n}>{n}</li>)}</ul>

      <h3>Claims</h3>
      <ul>
        <li>No number without a source we have seen. “Across 40 networks” is a source; “studies show” is not.</li>
        <li>No naming a customer without written permission, including in a screenshot.</li>
        <li>No implying autonomy the product does not have. It drafts and you approve, until you say otherwise.</li>
        <li>No comparison table where we choose the competitor&rsquo;s row for them. Quote their own documentation or do not include them.</li>
      </ul>

      <h3>Ethics</h3>
      <ul>
        <li>Real phone numbers, terminal IDs and names never appear in a mock. The studio&rsquo;s defaults are invented.</li>
        <li>Nothing in the studio uploads. Images a user adds are read to a data URL and stay in the browser.</li>
        <li>We do not use an operator&rsquo;s messages to train anything, and we say so on the trust page rather than in a footnote.</li>
        <li>No dark patterns in a broadcast: an unsubscribe or opt-out instruction is one message away, always.</li>
      </ul>

      <DoDont
        doTitle="Ship it"
        dontTitle="Send it back"
        dos={[
          'A claim with its source inside the image',
          'Money in the mono face, symbol first',
          'A receipt rule separating sections',
          'Copy that names the vertical’s own nouns',
        ]}
        donts={[
          'An exclamation point in product chrome',
          'An emoji outside a conversation surface',
          'Red used for anything that is not critical',
          'A gradient, however subtle',
        ]}
      />
    </Section>
  );
}
