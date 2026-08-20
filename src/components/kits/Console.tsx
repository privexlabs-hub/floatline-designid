'use client';

import { useState } from 'react';

/**
 * The operator's console.
 *
 * Ported from the imported kit, which was a fixed-width browser mock. This one
 * is responsive: the sidebar becomes a horizontal scroller and the table rows
 * fold to two columns below 760px, because the whole point of rebuilding the
 * kit was that the original could not be shown on a phone.
 */

type Status = 'on-track' | 'at-risk' | 'failed';
const DOT: Record<Status, string> = { 'on-track': '#29B26A', 'at-risk': '#E89B2C', failed: '#C8362A' };

const PAGES = ['Today', 'Broadcasts', 'Knowledge', 'Capacity', 'Members'] as const;
type Page = (typeof PAGES)[number];

const MEMBERS: { name: string; area: string; status: Status; amount: string; pct: number }[] = [
  { name: 'Bisi Adeyemi', area: 'Surulere', status: 'on-track', amount: '₦300,000', pct: 84 },
  { name: 'Chinedu Okafor', area: 'Akoka', status: 'at-risk', amount: '₦80,000', pct: 31 },
  { name: 'Musa Bello', area: 'Yaba', status: 'failed', amount: '₦0', pct: 6 },
  { name: 'Ngozi Eze', area: 'Ikeja', status: 'on-track', amount: '₦215,000', pct: 72 },
];

const CONTENT: Record<Page, { kpis: [string, string][]; body: React.ReactNode }> = {
  Today: {
    kpis: [['Read', '29 / 32'], ['Idle capacity', '₦300K'], ['At risk', '3'], ['Answered', '64%']],
    body: (
      <div>
        <h4>This morning</h4>
        <ul style={{ marginTop: 'var(--sp-3)', paddingLeft: 'var(--sp-5)', color: 'var(--fg-muted)' }}>
          <li>Terminal 19 (Akoka) at 23% of today&rsquo;s target. 1 day left.</li>
          <li>Bisi has ₦300,000 idle since 11am. Chinedu needs ₦80,000.</li>
          <li>3 members have not read yesterday&rsquo;s broadcast.</li>
        </ul>
      </div>
    ),
  },
  Broadcasts: {
    kpis: [['Sent today', '4'], ['Delivered', '126 / 128'], ['Bounced', '2'], ['Avg read', '38s']],
    body: <p>Every broadcast is a durable run. Close the tab and it still finishes. Bounces are reported by name, not counted.</p>,
  },
  Knowledge: {
    kpis: [['Answers', '42'], ['Auto-answered', '64%'], ['Awaiting approval', '12'], ['First reply', '40s']],
    body: <p>Curate an answer once and the network gets it instantly. Floatline drafts, you approve, and the next draft is better.</p>,
  },
  Capacity: {
    kpis: [['Declared', '₦1.4M'], ['Matched today', '₦620K'], ['Idle > 2h', '₦300K'], ['Matches', '38']],
    body: <p>Members declare what they have; others declare what they need. Pairing is by distance, size and history.</p>,
  },
  Members: {
    kpis: [['Members', '32'], ['On track', '24'], ['At risk', '5'], ['No-show', '3']],
    body: <p>Initials on a colour — never a generated face, never stock photography.</p>,
  },
};

export function Console() {
  const [page, setPage] = useState<Page>('Today');
  const { kpis, body } = CONTENT[page];

  return (
    <div className="kit-window">
      <div className="kit-window-bar">
        <i /><i /><i />
        <span className="kit-window-url">app.floatline.io/{page.toLowerCase()}</span>
      </div>
      <div className="kit-console">
        <aside className="kit-side">
          <div className="row" style={{ gap: 8 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo/floatline-mark.svg" alt="" width={26} height={26} />
            <strong style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>floatline</strong>
          </div>
          <nav className="kit-nav" aria-label="Console">
            {PAGES.map((p) => (
              <button key={p} type="button" aria-current={p === page} onClick={() => setPage(p)}>{p}</button>
            ))}
          </nav>
        </aside>

        <div className="kit-main">
          <div>
            <span className="fl-micro">{page}</span>
            <h3 style={{ marginTop: 4 }}>
              {page === 'Today' ? 'Good morning, Aisha' : page}
            </h3>
          </div>

          <div className="kit-kpis">
            {kpis.map(([label, value]) => (
              <div className="kit-kpi" key={label}>
                <span className="fl-micro">{label}</span>
                <b className="fl-money">{value}</b>
              </div>
            ))}
          </div>

          <hr className="receipt" style={{ margin: 0 }} />
          {body}

          <div>
            {MEMBERS.map((m) => (
              <div className="kit-row" key={m.name}>
                <span className="row" style={{ gap: 'var(--sp-2)', flexWrap: 'nowrap' }}>
                  <span className="kit-avatar">{m.name.split(' ').map((n) => n[0]).join('')}</span>
                  <span>
                    <strong style={{ fontSize: 'var(--fs-small)' }}>{m.name}</strong>
                    <span className="fl-micro" style={{ display: 'block' }}>{m.area}</span>
                  </span>
                </span>
                <span className="kit-pill"><i style={{ background: DOT[m.status] }} />{m.status.replace('-', ' ')}</span>
                <span className="fl-money" style={{ fontSize: 'var(--fs-small)' }}>{m.amount}</span>
                <span className="kit-bar"><i style={{ width: `${m.pct}%` }} /></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
