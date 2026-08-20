import { Section, Table } from '@/components/playbook/parts';
import { PRESETS } from '@/content/templates/registry';

export function SectionGovernance() {
  return (
    <Section
      id="governance" n="17" title="Governance & consistency"
      lead="Consistency here is enforced by the tools, not by memory. Where a rule can be a check that fails a build, it is one."
    >
      <h3>What is enforced automatically</h3>
      <Table
        head={['Rule', 'Enforced by']}
        rows={[
          ['Every template has a unique id and a listed group', <code key="a">content/templates/registry.ts</code>],
          ['Brand faces are self-hosted, unmodified and complete', <code key="b">scripts/verify-fonts.mjs</code> ],
          ['The logo SVGs match the geometry the React mark draws', <code key="c">scripts/build-brand-assets.mjs</code>],
          ['Exports are the exact pixel size claimed, in every format', <code key="d">scripts/verify-export.mjs</code>],
          ['The logo actually survives rasterisation', <code key="e">scripts/verify-export.mjs</code>],
          ['What you preview is what you download', <code key="f">scripts/verify-fidelity.mjs</code>],
          ['No route overflows or has an undersized tap target', <code key="g">scripts/audit-responsive.mjs</code>],
          ['No asset loads from a third party at runtime', <code key="h">scripts/verify-app.mjs</code>],
        ]}
      />

      <h3>What still needs a human</h3>
      <ul>
        <li>Whether a claim is true, and whether we may name the customer.</li>
        <li>Whether the copy sounds like the operator or like a marketer.</li>
        <li>Whether a new template earns its place or just adds a {PRESETS.length + 1}th.</li>
        <li>Whether a deviation from this playbook is a considered decision or a slip.</li>
      </ul>

      <h3>Changing the system</h3>
      <ol>
        <li>Change the token or the template — never the exported asset. An asset edited after export cannot be reproduced.</li>
        <li>Run <code>npm run verify</code> and <code>npm run audit</code>. Both must pass.</li>
        <li>Record the deviation in the README if it departs from what the imported design system says.</li>
        <li>Push the change back to the Claude Design project so the two do not fork.</li>
      </ol>

      <h3>Where the source of truth lives</h3>
      <p>
        Colour, type, spacing, radii and shadow are defined once in
        <code> src/styles/tokens.css</code>. TypeScript keeps a small typed mirror in
        <code> src/lib/tokens.ts</code> for the handful of values code genuinely needs — the surface
        list and the flatten colours. It is a mirror, not a generator, and it is small on purpose.
      </p>
    </Section>
  );
}
