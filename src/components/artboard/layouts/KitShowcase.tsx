import { Artboard } from '../Artboard';
import { unit, Wordmark, Eyebrow, Headline, Lede, Chip, ReceiptRule, FloatBar, StatusDot, ReadFraction, Money, Mark } from '../primitives';
import { str, arr, type LayoutBaseProps } from './types';

/**
 * Product-surface marketing art.
 *
 * The other twelve layouts can say what Floatline does; none of them can SHOW
 * it. This one renders a simplified console or conversation surface inside a
 * device frame, drawn with the same primitives, so a launch post can carry the
 * actual product instead of another headline on paper.
 *
 * The mock is drawn, not screenshotted — a screenshot would need an image
 * fetched at capture time and would go stale the moment the console changes.
 */
export type KitShape = 'console' | 'chat';

function ChatBubble({ u, from, text, meta }: { u: number; from: 'them' | 'bot'; text: string; meta?: string }) {
  const bot = from === 'bot';
  return (
    <div style={{ display: 'flex', justifyContent: bot ? 'flex-start' : 'flex-end' }}>
      <div
        style={{
          maxWidth: '78%',
          background: bot ? 'var(--art-bg)' : 'color-mix(in srgb, var(--art-signal) 26%, var(--art-bg))',
          border: `${Math.max(1, 1.4 * u)}px solid var(--art-rule)`,
          borderRadius: 18 * u,
          padding: `${16 * u}px ${20 * u}px`,
          display: 'grid',
          gap: 8 * u,
        }}
      >
        <span style={{ fontSize: 23 * u, lineHeight: 1.4, color: 'var(--art-fg-2)' }}>{text}</span>
        {meta ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 17 * u, color: 'var(--art-muted)' }}>{meta}</span> : null}
      </div>
    </div>
  );
}

export function KitShowcase(p: LayoutBaseProps) {
  const { w, h, surface, grain } = p;
  const u = unit(w);
  const shape = (p.shape as KitShape) ?? 'console';

  return (
    <Artboard w={w} h={h} surface={surface} grain={grain}>
      <div style={{ position: 'relative', zIndex: 1, height: '100%', padding: 78 * u, display: 'flex', flexDirection: 'column', gap: 30 * u }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 * u }}>
          <Wordmark u={u} size={30} />
          {str(p.eyebrow) ? <Eyebrow u={u} tone="signal">{str(p.eyebrow)}</Eyebrow> : null}
        </div>

        <div style={{ display: 'grid', gap: 16 * u }}>
          <Headline u={u} size={58}>{str(p.title)}</Headline>
          {str(p.body) ? <Lede u={u} size={28}>{str(p.body)}</Lede> : null}
        </div>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            borderRadius: 22 * u,
            overflow: 'hidden',
            border: `${Math.max(1, 2 * u)}px solid var(--art-rule)`,
            background: 'color-mix(in srgb, var(--art-fg) 5%, transparent)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Device chrome — three dots for a browser, a channel bar for chat. */}
          <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 12 * u, padding: `${16 * u}px ${22 * u}px`, borderBottom: `${Math.max(1, 1.4 * u)}px solid var(--art-rule)` }}>
            {shape === 'console' ? (
              <>
                {[0, 1, 2].map((i) => <span key={i} style={{ width: 13 * u, height: 13 * u, borderRadius: 999, background: 'var(--art-rule)' }} />)}
                <span style={{ marginLeft: 14 * u, fontFamily: 'var(--font-mono)', fontSize: 19 * u, color: 'var(--art-muted)' }}>{str(p.url, 'app.floatline.io')}</span>
              </>
            ) : (
              <>
                <Mark size={30 * u} />
                <span style={{ fontSize: 22 * u, fontWeight: 700, color: 'var(--art-fg)' }}>{str(p.channelName, 'Floatline')}</span>
                <span style={{ marginLeft: 'auto' }}><Chip u={u} tone="outline">{str(p.channel, 'WhatsApp')}</Chip></span>
              </>
            )}
          </div>

          <div style={{ flex: 1, minHeight: 0, padding: 26 * u, display: 'grid', gap: 18 * u, alignContent: 'start' }}>
            {shape === 'console' ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 * u }}>
                  {arr(p.tiles, ['Broadcast|29 / 32 read', 'Capacity|68%', 'At risk|3']).map((t, i) => {
                    const [label, value] = t.split('|');
                    return (
                      <div key={i} style={{ borderRadius: 14 * u, padding: 20 * u, background: 'var(--art-bg)', border: `${Math.max(1, 1.4 * u)}px solid var(--art-rule)` }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 17 * u, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--art-muted)' }}>{label}</div>
                        <div style={{ marginTop: 10 * u, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 40 * u, color: 'var(--art-fg)', letterSpacing: '-0.03em' }}>{value}</div>
                      </div>
                    );
                  })}
                </div>
                <ReceiptRule u={u} opacity={0.8} />
                {arr(p.rows, ['Bisi Adeyemi|on-track|300000|84', 'Chinedu Okafor|at-risk|80000|31', 'Musa Bello|failed|0|6']).map((r, i) => {
                  const [name, status, amount, pct] = r.split('|');
                  return (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr', alignItems: 'center', gap: 16 * u }}>
                      <span style={{ fontSize: 23 * u, color: 'var(--art-fg)', fontWeight: 600 }}>{name}</span>
                      <StatusDot u={u} status={(status as 'on-track' | 'at-risk' | 'failed') ?? 'on-track'} />
                      <Money u={u} amount={Number(amount ?? 0).toLocaleString('en-US')} currency={p.currency} size={23} />
                      <FloatBar u={u} pct={Number(pct ?? 0)} height={14} />
                    </div>
                  );
                })}
              </>
            ) : (
              <>
                {arr(p.messages, [
                  'them|need ₦80K cash at Akoka',
                  'bot|Bisi has ₦300K idle 1.2km away. Send contact?|matched in 4s',
                  'them|yes',
                  'bot|Contact sent to both. Confirm when settled.|29 / 32 read',
                ]).map((m, i) => {
                  const [from, text, meta] = m.split('|');
                  return <ChatBubble key={i} u={u} from={from === 'bot' ? 'bot' : 'them'} text={text ?? ''} meta={meta} />;
                })}
              </>
            )}
          </div>
        </div>

        <div style={{ flex: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 * u }}>
          {str(p.cta) ? <Chip u={u} tone="solid">{str(p.cta)}</Chip> : <ReadFraction u={u} read={29} total={32} />}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22 * u, color: 'var(--art-muted)' }}>{str(p.footerUrl, 'floatline.app')}</span>
        </div>
      </div>
    </Artboard>
  );
}
