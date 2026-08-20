import { Section, Table, Cards } from '@/components/playbook/parts';
import { VERTICALS } from '@/content/verticals';

export function SectionArchitecture() {
  return (
    <Section
      id="architecture" n="02" title="Brand architecture"
      lead="One brand, one product, five named verticals. The verticals are marketing surfaces and copy packs — they are never sub-brands, and they never get their own logo."
    >
      <h3>The structure</h3>
      <p>
        Floatline is a <strong>branded house</strong>. There is one mark, one wordmark and one
        palette. A vertical changes the nouns, the proof and the examples; it does not change the
        identity. If a vertical ever needs its own look to make sense, that is evidence the
        positioning is wrong, not evidence we need a second brand.
      </p>

      <h3>The five verticals</h3>
      <p>
        Agent networks come first because it is the original story and the sharpest proof. The rest
        are the same four jobs in a different vocabulary.
      </p>
      <Table
        head={['Vertical', 'The operator', 'The network', 'Primary channels']}
        rows={VERTICALS.map((v) => [
          <strong key="l">{v.label}</strong>,
          v.operator,
          v.network,
          v.channels.join(' · '),
        ])}
      />

      <h3>What each vertical supplies</h3>
      <Cards
        items={[
          { title: 'A vocabulary', body: 'The nouns that vertical actually uses. A dispatcher has technicians and jobs; a super-agent has sub-agents and float. Using the wrong noun is the fastest way to sound like you have never met the buyer.' },
          { title: 'A proof point', body: 'One number, sourced, that this vertical recognises as meaningful. Never a generic “40% more efficient”.' },
          { title: 'A currency', body: 'Money examples are rendered in the currency that vertical works in. ₦ is the default for agent networks and stays there.' },
          { title: 'A default copy set', body: 'Every studio template reads its defaults from the selected vertical, so switching vertical re-fills 168 templates with the right language.' },
        ]}
      />

      <h3>Naming rules</h3>
      <ul>
        <li>The company and the product are both <strong>Floatline</strong>. There is no sub-product naming.</li>
        <li>The wordmark is lowercase — <code>floatline</code> — everywhere it is set as a logo.</li>
        <li>In running prose it is capitalised normally: “Floatline sends the broadcast.”</li>
        <li>Features are described, not branded. It is “the digest”, not “Floatline Digest™”.</li>
        <li>Never “FloatLine”, “Float Line”, “FL”, or an abbreviation of any kind.</li>
      </ul>
    </Section>
  );
}
