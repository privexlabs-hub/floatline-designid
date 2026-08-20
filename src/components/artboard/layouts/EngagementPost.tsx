import { Artboard } from '../Artboard';
import { unit, Frame, Wordmark, Eyebrow, Headline, Lede, Quote, RowList, ReceiptRule, CtaFooter, Chip, Stat, FloatBar, Panel } from '../primitives';
import { str, arr, type LayoutBaseProps } from './types';

/**
 * Engagement posts are square too, but they are built to be READ rather than
 * glanced at: denser type, more structure, a question or a claim that invites a
 * reply. Kept separate from SquarePost because the typographic scale genuinely
 * differs — merging them would mean a shape flag controlling font sizes, which
 * is where these files start to rot.
 */
export type EngagementShape =
  | 'story' | 'manifesto' | 'problem' | 'beforeAfter' | 'howItWorks'
  | 'proof' | 'faq' | 'mythFact' | 'tips' | 'opinion' | 'poll';

export function EngagementPost(p: LayoutBaseProps) {
  const { w, h, surface, grain } = p;
  const u = unit(w);
  const shape = (p.shape as EngagementShape) ?? 'story';
  const title = str(p.title);
  const bodyText = str(p.body);

  return (
    <Artboard w={w} h={h} surface={surface} grain={grain}>
      <Frame
        u={u}
        pad={(p.pad as number) ?? 80}
        header={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 * u }}>
            <Wordmark u={u} size={28} />
            <Eyebrow u={u} tone="signal">{str(p.eyebrow)}</Eyebrow>
          </div>
        }
        footer={<><ReceiptRule u={u} /><div style={{ height: 24 * u }} /><CtaFooter u={u} cta={str(p.cta)} url={str(p.url)} tone="quiet" /></>}
      >
        {shape === 'manifesto' ? (
          <>
            <Headline u={u} size={58}>{title}</Headline>
            <ReceiptRule u={u} opacity={0.7} />
            <RowList u={u} items={arr(p.items)} numbered={false} size={27} />
          </>
        ) : shape === 'problem' || shape === 'beforeAfter' ? (
          <div style={{ display: 'grid', gap: 26 * u }}>
            <Headline u={u} size={52}>{title}</Headline>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 * u }}>
              <Panel u={u} tone="outline" pad={32}>
                <Eyebrow u={u}>{str(p.leftLabel, shape === 'beforeAfter' ? 'Before' : 'The problem')}</Eyebrow>
                <div style={{ height: 16 * u }} />
                <RowList u={u} items={arr(p.leftItems)} numbered={false} size={24} />
              </Panel>
              <Panel u={u} tone="raised" pad={32}>
                <Eyebrow u={u} tone="signal">{str(p.rightLabel, shape === 'beforeAfter' ? 'After' : 'With Floatline')}</Eyebrow>
                <div style={{ height: 16 * u }} />
                <RowList u={u} items={arr(p.rightItems)} numbered={false} size={24} />
              </Panel>
            </div>
          </div>
        ) : shape === 'howItWorks' || shape === 'tips' ? (
          <>
            <Headline u={u} size={56}>{title}</Headline>
            {bodyText ? <Lede u={u} size={27}>{bodyText}</Lede> : null}
            <ReceiptRule u={u} opacity={0.7} />
            <RowList u={u} items={arr(p.items)} numbered size={27} />
          </>
        ) : shape === 'proof' ? (
          <>
            <Quote u={u} size={50}>“{str(p.quote)}”</Quote>
            <ReceiptRule u={u} opacity={0.7} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 * u }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 23 * u, color: 'var(--art-muted)' }}>{str(p.attribution)}</div>
              <Stat u={u} value={str(p.stat)} size={92} />
            </div>
          </>
        ) : shape === 'faq' || shape === 'mythFact' ? (
          <>
            <Headline u={u} size={50}>{title}</Headline>
            <div style={{ display: 'grid', gap: 22 * u }}>
              {arr(p.items).map((it, i) => {
                const [q, a] = it.split('|');
                return (
                  <Panel key={i} u={u} tone={i % 2 === 0 ? 'raised' : 'outline'} pad={30}>
                    <div style={{ fontSize: 27 * u, fontWeight: 700, color: 'var(--art-fg)', lineHeight: 1.3 }}>
                      {shape === 'mythFact' ? `Myth · ${q?.trim() ?? ''}` : q?.trim()}
                    </div>
                    {a ? (
                      <div style={{ marginTop: 12 * u, fontSize: 25 * u, lineHeight: 1.4, color: 'var(--art-fg-2)' }}>
                        {shape === 'mythFact' ? `Fact · ${a.trim()}` : a.trim()}
                      </div>
                    ) : null}
                  </Panel>
                );
              })}
            </div>
          </>
        ) : shape === 'poll' ? (
          <>
            <Headline u={u} size={62}>{title}</Headline>
            <div style={{ display: 'grid', gap: 16 * u, marginTop: 10 * u }}>
              {arr(p.items).map((it, i) => {
                const [label, pct] = it.split('|');
                return (
                  <div key={i} style={{ display: 'grid', gap: 10 * u }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26 * u, color: 'var(--art-fg-2)' }}>
                      <span>{label?.trim()}</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{pct?.trim()}</span>
                    </div>
                    <FloatBar u={u} pct={parseInt(pct ?? '0', 10)} height={16} />
                  </div>
                );
              })}
            </div>
          </>
        ) : shape === 'opinion' ? (
          <>
            <Chip u={u} tone="outline">{str(p.badge, 'Hot take')}</Chip>
            <Headline u={u} size={70} weight={800}>{title}</Headline>
            {bodyText ? <Lede u={u} size={28}>{bodyText}</Lede> : null}
          </>
        ) : (
          <>
            <Headline u={u} size={54}>{title}</Headline>
            <Lede u={u} size={28}>{bodyText}</Lede>
            {arr(p.items).length ? (
              <>
                <ReceiptRule u={u} opacity={0.7} />
                <RowList u={u} items={arr(p.items)} numbered={false} size={26} />
              </>
            ) : null}
          </>
        )}
      </Frame>
    </Artboard>
  );
}
