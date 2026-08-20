'use client';

import { useState } from 'react';
import { Console } from '@/components/kits/Console';
import { ChatSurface, Bubble, BotCard } from '@/components/kits/Chat';
import { CHANNELS, type ChannelId } from '@/content/brand';

const THREADS: Record<ChannelId, { name: string; status: string; nodes: React.ReactNode }> = {
  whatsapp: {
    name: 'Floatline', status: 'Business account',
    nodes: (
      <>
        <Bubble from="them" time="11:02">need ₦80K cash at Akoka</Bubble>
        <BotCard
          title="Match found"
          rows={[['Bisi Adeyemi', '₦300,000 idle'], ['Distance', '1.2 km'], ['Last settled', '2 days ago']]}
          footer="matched in 4s · reply YES to connect"
        />
        <Bubble from="them" time="11:02">yes</Bubble>
        <Bubble from="me" time="11:02">Contact sent to both. Confirm when settled. ✅</Bubble>
      </>
    ),
  },
  sms: {
    name: 'FLOATLINE', status: 'SMS · no data needed',
    nodes: (
      <>
        <Bubble from="me" time="07:00">Terminal 19 (Akoka) at 23% of today&rsquo;s target. 1 day left.</Bubble>
        <Bubble from="them" time="07:04">send bisi to akoka</Bubble>
        <Bubble from="me" time="07:04">Done. Bisi notified, ETA 25 min.</Bubble>
      </>
    ),
  },
  voice: {
    name: 'Floatline', status: 'Voice · call transcript',
    nodes: (
      <>
        <Bubble from="me" time="07:00">Good morning. Three things need you today.</Bubble>
        <Bubble from="them" time="07:00">go on</Bubble>
        <Bubble from="me" time="07:01">Terminal 19 is behind. Bisi has three hundred thousand idle. Two members have not confirmed.</Bubble>
      </>
    ),
  },
  slack: {
    name: '#ops-network', status: 'Slack · back office',
    nodes: (
      <>
        <Bubble from="me" time="07:00">Morning digest is ready.</Bubble>
        <BotCard
          title="Digest · 32 members"
          rows={[['Read', '29 / 32'], ['Idle capacity', '₦300,000'], ['At risk', '3 terminals']]}
          footer="open the console for the full list"
        />
      </>
    ),
  },
  email: {
    name: 'digest@floatline.app', status: 'Email · daily',
    nodes: (
      <>
        <Bubble from="me">
          <strong>What your network did yesterday</strong>
          {'\n'}14 broadcasts · 96% read within 10 minutes · ₦4.2M matched.
        </Bubble>
        <BotCard title="Needs you today" rows={[['Terminal 19', '23% of target'], ['Unconfirmed', '2 members']]} footer="reply to this email to send a broadcast" />
      </>
    ),
  },
  webhook: {
    name: 'POST /runs', status: 'Webhook · machine to machine',
    nodes: (
      <>
        <Bubble from="them"><code>{'{ "trigger": "capacity.needed", "amount": 80000 }'}</code></Bubble>
        <Bubble from="me"><code>{'{ "run": "r_8f21", "status": "matched", "with": "m_bisi" }'}</code></Bubble>
      </>
    ),
  },
  api: {
    name: 'api.floatline.app', status: 'REST · your own client',
    nodes: (
      <>
        <Bubble from="them"><code>POST /v1/broadcasts</code></Bubble>
        <Bubble from="me"><code>{'{ "sent": 32, "delivered": 32, "read": 29 }'}</code></Bubble>
      </>
    ),
  },
};

export function Kits() {
  const [channel, setChannel] = useState<ChannelId>('whatsapp');
  const thread = THREADS[channel];

  return (
    <>
      <section className="ds-block">
        <div className="pb-num">01</div>
        <h2>The conversational surface</h2>
        <p className="pb-lead">
          The same workflow on every channel the product speaks over. Switch the channel and the
          surface changes to that client&rsquo;s real colours — we do not redesign someone else&rsquo;s
          app. Floatline&rsquo;s brand lives in the card the bot renders, not in a repainted client.
        </p>

        <div className="swatches" style={{ marginTop: 'var(--sp-4)' }} role="tablist" aria-label="Channel">
          {CHANNELS.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              className="swatch"
              aria-selected={channel === c.id}
              title={c.note}
              onClick={() => setChannel(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <p className="note" style={{ marginTop: 'var(--sp-3)' }}>
          {CHANNELS.find((c) => c.id === channel)?.note}
        </p>

        <div style={{ marginTop: 'var(--sp-5)' }}>
          <ChatSurface channel={channel} name={thread.name} status={thread.status} composer={channel !== 'webhook' && channel !== 'api'}>
            {thread.nodes}
          </ChatSurface>
        </div>
      </section>

      <section className="ds-block">
        <div className="pb-num">02</div>
        <h2>The console</h2>
        <p className="pb-lead">
          The operator&rsquo;s web surface: today&rsquo;s digest, broadcasts, the knowledge base,
          capacity across the network and the member list. Fully responsive — the imported kit was a
          fixed-width mock, which is the main reason it needed rebuilding.
        </p>
        <div style={{ marginTop: 'var(--sp-5)' }}>
          <Console />
        </div>
      </section>
    </>
  );
}
