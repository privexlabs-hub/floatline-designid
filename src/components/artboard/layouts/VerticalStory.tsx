import { Artboard } from '../Artboard';
import { unit, Wordmark, Eyebrow, Headline, Lede, Stat, Quote, RowList, ReceiptRule, Chip, FloatBar } from '../primitives';
import { str, arr, type LayoutBaseProps } from './types';

/**
 * 9:16. The safe area is the whole design problem here: 200px of platform
 * chrome at the top and 320px at the bottom, so the content column is
 * deliberately inset and vertically centred rather than stretched.
 */
export type StoryShape =
  | 'launch' | 'feature' | 'demo' | 'stat' | 'quote' | 'info'
  | 'behind' | 'countdown' | 'poll' | 'cta' | 'event';

export function VerticalStory(p: LayoutBaseProps) {
  const { w, h, surface, grain } = p;
  const u = unit(w);
  const shape = (p.shape as StoryShape) ?? 'launch';
  const title = str(p.title);
  const bodyText = str(p.body);

  // Matches SAFE_AREAS.vertical exactly — content lives inside the chrome.
  const safeTop = 200 * (h / 1920);
  const safeBottom = 320 * (h / 1920);

  return (
    <Artboard w={w} h={h} surface={surface} grain={grain}>
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          padding: `${safeTop}px ${88 * u}px ${safeBottom}px`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ flex: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 * u }}>
          <Wordmark u={u} size={30} />
          {str(p.eyebrow) ? <Eyebrow u={u} tone="signal">{str(p.eyebrow)}</Eyebrow> : null}
        </div>

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 34 * u }}>
          {shape === 'stat' ? (
            <Stat u={u} value={str(p.stat)} label={str(p.statLabel)} size={230} />
          ) : shape === 'quote' ? (
            <>
              <Quote u={u} size={62}>“{str(p.quote) || title}”</Quote>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26 * u, color: 'var(--art-muted)' }}>{str(p.attribution)}</div>
            </>
          ) : shape === 'countdown' ? (
            <>
              <Eyebrow u={u}>{str(p.badge, 'Live in')}</Eyebrow>
              <Stat u={u} value={str(p.stat, '3 days')} label={str(p.statLabel)} size={200} />
              <Headline u={u} size={62}>{title}</Headline>
            </>
          ) : shape === 'poll' ? (
            <>
              <Headline u={u} size={78} weight={800}>{title}</Headline>
              <div style={{ display: 'grid', gap: 20 * u }}>
                {arr(p.items).map((it, i) => <Chip key={i} u={u} tone={i === 0 ? 'signal' : 'outline'}>{it}</Chip>)}
              </div>
            </>
          ) : shape === 'demo' || shape === 'info' || shape === 'behind' ? (
            <>
              <Headline u={u} size={70}>{title}</Headline>
              {bodyText ? <Lede u={u} size={32}>{bodyText}</Lede> : null}
              {arr(p.items).length ? (
                <>
                  <ReceiptRule u={u} opacity={0.7} />
                  <RowList u={u} items={arr(p.items)} numbered={shape === 'demo'} size={30} />
                </>
              ) : null}
              {shape === 'demo' ? <FloatBar u={u} pct={Number(p.pct ?? 72)} label={str(p.barLabel)} /> : null}
            </>
          ) : (
            <>
              {str(p.badge) ? <Chip u={u} tone="signal">{str(p.badge)}</Chip> : null}
              <Headline u={u} size={92} weight={800}>{title}</Headline>
              {bodyText ? <Lede u={u} size={33}>{bodyText}</Lede> : null}
            </>
          )}
        </div>

        <div style={{ flex: 'none', display: 'grid', gap: 22 * u }}>
          <ReceiptRule u={u} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 * u }}>
            {str(p.cta) ? <Chip u={u} tone="solid">{str(p.cta)}</Chip> : <span />}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 24 * u, color: 'var(--art-muted)' }}>{str(p.url, 'floatline.app')}</span>
          </div>
        </div>
      </div>
    </Artboard>
  );
}
