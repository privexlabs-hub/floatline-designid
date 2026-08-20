import { Artboard } from '../Artboard';
import { unit, Mark, Wordmark, Headline, Lede, Chip, Stat, Quote, ReceiptRule, RowList } from '../primitives';
import { str, arr, type LayoutBaseProps } from './types';

/**
 * Paid creative across four very different canvases: 1:1 feed, 1200x628
 * landscape, 9:16 story, and the 300x250 MPU. The MPU is the constraint that
 * shapes this file — at 300px wide there is room for a mark, four words and a
 * button, so it gets its own branch rather than a squeezed version of the feed.
 */
export type AdShape = 'feed' | 'landscape' | 'story' | 'mpu';

export function AdCreative(p: LayoutBaseProps) {
  const { w, h, surface, grain } = p;
  const shape = (p.shape as AdShape) ?? 'feed';
  const u = shape === 'mpu' ? unit(w * 3.2) : shape === 'landscape' ? unit(w * 1.05) : unit(w);
  const title = str(p.title);

  if (shape === 'mpu') {
    return (
      <Artboard w={w} h={h} surface={surface} grain={grain}>
        <div style={{ position: 'relative', zIndex: 1, height: '100%', padding: 34 * u, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Mark size={40 * u} />
          <Headline u={u} size={46} weight={800}>{title}</Headline>
          <Chip u={u} tone="solid">{str(p.cta, 'Start free')}</Chip>
        </div>
      </Artboard>
    );
  }

  return (
    <Artboard w={w} h={h} surface={surface} grain={grain}>
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          padding: shape === 'story' ? `${200 * (h / 1920)}px ${80 * u}px ${320 * (h / 1920)}px` : 70 * u,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 26 * u,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 * u }}>
          <Wordmark u={u} size={30} />
          {str(p.badge) ? <Chip u={u} tone="signal">{str(p.badge)}</Chip> : null}
        </div>

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24 * u }}>
          {(p.shapeInner ?? p.kind) === 'stat' ? (
            <Stat u={u} value={str(p.stat)} label={str(p.statLabel)} size={shape === 'landscape' ? 150 : 190} />
          ) : (p.shapeInner ?? p.kind) === 'proof' ? (
            <>
              <Quote u={u} size={shape === 'landscape' ? 44 : 52}>“{str(p.quote)}”</Quote>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 23 * u, color: 'var(--art-muted)' }}>{str(p.attribution)}</div>
            </>
          ) : (
            <>
              <Headline u={u} size={shape === 'landscape' ? 62 : shape === 'story' ? 86 : 72} weight={800}>{title}</Headline>
              {str(p.body) ? <Lede u={u} size={shape === 'landscape' ? 27 : 30}>{str(p.body)}</Lede> : null}
              {arr(p.items).length ? <RowList u={u} items={arr(p.items)} numbered={false} size={26} /> : null}
            </>
          )}
        </div>

        <div style={{ display: 'grid', gap: 20 * u }}>
          <ReceiptRule u={u} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 * u }}>
            <Chip u={u} tone="solid">{str(p.cta, 'Start free')}</Chip>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22 * u, color: 'var(--art-muted)' }}>{str(p.url, 'floatline.app')}</span>
          </div>
        </div>
      </div>
    </Artboard>
  );
}
