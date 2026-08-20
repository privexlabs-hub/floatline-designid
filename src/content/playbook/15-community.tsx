import { Section, DoDont } from '@/components/playbook/parts';

export function SectionCommunity() {
  return (
    <Section
      id="community" n="15" title="Community & engagement"
      lead="Floatline's audience talks to each other far more than it talks to us. The job is to be useful in those conversations, not to run them."
    >
      <h3>Where</h3>
      <ul>
        <li><strong>Operator groups</strong> — the WhatsApp and Telegram groups where super-agents and dispatchers already compare notes. We are guests. We answer questions and do not pitch.</li>
        <li><strong>LinkedIn</strong> — where the buyer&rsquo;s peers are. Comments on other people&rsquo;s posts do more than our own posts.</li>
        <li><strong>X</strong> — where the build-in-public audience is. This is the changelog crowd, not the buyer.</li>
        <li><strong>The operators&rsquo; room</strong> — our own space, opened only once there is enough traffic that it is not an empty room with our logo on it.</li>
      </ul>

      <h3>Replying</h3>
      <DoDont
        dos={[
          'Answer the question even when the answer is a competitor',
          'Give the number, not the range, when you have it',
          'Say “we do not do that yet” plainly',
          'Take the correction publicly when we get something wrong',
        ]}
        donts={[
          'Reply with a link and nothing else',
          'Argue with a bad-faith quote-tweet',
          '“Great question!” or any acknowledgement that carries no content',
          'Answer at 2am to look responsive — it reads as automated',
        ]}
      />

      <h3>User-generated proof</h3>
      <p>
        The strongest asset we have is an operator showing their own morning. Ask for it directly,
        credit by name and network size, and never edit the number. If someone&rsquo;s result is
        unimpressive, publish it anyway or do not ask — selectively publishing only the good ones is
        how a proof pillar quietly becomes a marketing pillar.
      </p>
    </Section>
  );
}
