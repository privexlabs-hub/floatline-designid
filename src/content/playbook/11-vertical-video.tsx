import { Section, Table, DoDont } from '@/components/playbook/parts';

export function SectionVerticalVideo() {
  return (
    <Section
      id="vertical-video" n="11" title="Vertical video"
      lead="Stories and reels are the only surface where Floatline moves. The motion rules are the same as everywhere else: functional, quick, no swooshes."
    >
      <h3>The frame</h3>
      <Table
        head={['Band', 'Pixels (of 1920)', 'What may go there']}
        rows={[
          ['Top chrome', '0 – 200', 'Nothing. The platform puts the avatar and handle here.'],
          ['Content', '200 – 1600', 'Everything. Headline, stat, quote, product.'],
          ['Bottom chrome', '1600 – 1920', 'Nothing. Caption, action row and reply field live here.'],
        ]}
      />

      <h3>Structure</h3>
      <ul>
        <li><strong>First second:</strong> the claim, in full, as text. Assume no sound and no patience.</li>
        <li><strong>Middle:</strong> one demonstration. A fraction moving from 0 / 32 to 29 / 32 beats any amount of narration.</li>
        <li><strong>Last two seconds:</strong> the ask, held long enough to read twice.</li>
        <li>Captions are burnt in. Platform auto-captions are unreliable with Nigerian English and with product nouns.</li>
      </ul>

      <h3>Motion</h3>
      <DoDont
        dos={[
          'Cuts, not transitions',
          'A counter that counts (steps(10, end)), a bar that fills',
          '120–280ms, snappy easing',
          'One bounce, once: the broadcast-sent confirmation',
        ]}
        donts={[
          'Swooshes, whooshes, parallax, Ken Burns',
          'Text that flies in letter by letter',
          'Anything longer than 280ms on product chrome',
          'Motion that continues under a voiceover for its own sake',
        ]}
      />

      <h3>Accessibility</h3>
      <p>
        Everything respects <code>prefers-reduced-motion</code>. Anything conveyed by motion is also
        conveyed by a number: the bar fills <em>and</em> the fraction updates.
      </p>
    </Section>
  );
}
