import { Section, Table, Cards } from '@/components/playbook/parts';
import { ArtboardFrame } from '@/components/playbook/ArtboardFrame';
import { CHANNELS } from '@/content/brand';

export function SectionChannels() {
  return (
    <Section
      id="channels" n="04" title="Channel strategy"
      lead="Floatline is channel-agnostic by design and channel-specific in practice. Every channel gets the same workflow and a different surface treatment, because a WhatsApp bubble and an SMS and a Slack message are not the same object."
    >
      <h3>The channels</h3>
      <Table
        head={['Channel', 'Why it exists in the product']}
        rows={CHANNELS.map((c) => [<strong key="l">{c.label}</strong>, c.note])}
      />

      <h3>Surface rules</h3>
      <p>
        We do not redesign someone else&rsquo;s chat client. When a mock shows a conversation, it
        uses that channel&rsquo;s real surface colours and bubble shapes — a WhatsApp mock sits on
        WhatsApp&rsquo;s tile background, not on Floatline paper. Floatline&rsquo;s brand shows up
        in what the <em>message</em> says and in the card the bot renders, never in a repainted
        client.
      </p>

      <Cards
        items={[
          { title: 'Emoji, and where they are allowed', body: 'Inside a conversation channel only. People read ✅ ⚠️ 🟢 faster than a text label there. In the console, in marketing and anywhere on the web, use a coloured dot and a micro label instead.' },
          { title: 'Language', body: 'The product understands however people actually write, including mixed language and Pidgin. It replies in the language the operator has set. Marketing copy never performs a dialect we do not authentically own.' },
          { title: 'Message length', body: 'A broadcast is read on a phone, often outdoors, often mid-task. Front-load the number and the action. If it does not fit in a notification preview, it is too long.' },
          { title: 'Fallback', body: 'A channel that fails falls back to the next one the member has, and the failure is reported by name. Silent fallback is worse than no fallback.' },
        ]}
      />

      <ArtboardFrame presetId="kt-chat-square" label="A conversation surface, channel-labelled" />
    </Section>
  );
}
