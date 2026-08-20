'use client';

import type { ReactNode } from 'react';
import type { ChannelId } from '@/content/brand';

/**
 * The conversational surface, generalised.
 *
 * The imported kit was WhatsApp-only — WAHeader, WABubble, WABotCard. Since
 * Floatline is an automation product rather than a WhatsApp product, the
 * components became channel-neutral and the channel is a prop that switches
 * the surface tokens. That single change is the clearest expression of the
 * repositioning anywhere in the codebase.
 *
 * We do not redesign anyone's client: each channel uses its own real surface
 * colours, so a mock reads as the thing it is mocking.
 */

export function ChatSurface({ channel, name, status, children, composer = true }: {
  channel: ChannelId; name: string; status?: string; children: ReactNode; composer?: boolean;
}) {
  return (
    <div className="kit-phone">
      <div className="kit-screen" data-channel={channel}>
        <header className="kit-chat-header">
          <span className="kit-avatar" aria-hidden="true">FL</span>
          <span>
            <b>{name}</b>
            {status ? <small>{status}</small> : null}
          </span>
        </header>
        <div className="kit-thread">{children}</div>
        {composer ? (
          <div className="kit-composer">
            <input readOnly placeholder="Message" aria-label="Message (mock)" />
            <span className="kit-avatar" aria-hidden="true">→</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function Bubble({ from, time, children }: { from: 'me' | 'them'; time?: string; children: ReactNode }) {
  return (
    <div className="kit-bubble" data-from={from}>
      {children}
      {time ? <time>{time}</time> : null}
    </div>
  );
}

/**
 * A card the bot renders inside the thread. This is where Floatline's own
 * brand lives in a conversation — the surrounding client stays untouched.
 */
export function BotCard({ title, rows, footer }: { title: string; rows: [string, ReactNode][]; footer?: ReactNode }) {
  return (
    <div className="kit-card">
      <div className="kit-card-title">{title}</div>
      <hr className="fl-receipt-rule" style={{ margin: '2px 0' }} />
      {rows.map(([k, v]) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--sp-3)', fontSize: 'var(--fs-small)' }}>
          <span style={{ color: 'var(--fg-subtle)' }}>{k}</span>
          <span style={{ fontWeight: 600 }}>{v}</span>
        </div>
      ))}
      {footer ? (
        <>
          <hr className="fl-receipt-rule" style={{ margin: '2px 0' }} />
          <div style={{ fontSize: 'var(--fs-micro)', color: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)' }}>{footer}</div>
        </>
      ) : null}
    </div>
  );
}
