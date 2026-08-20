import { Artboard } from '../Artboard';
import { unit, Mark, Headline, Chip, Stat, FloatBar } from '../primitives';
import { str, arr, type LayoutBaseProps } from './types';

/**
 * 16:9 at thumbnail scale. Different rules from every other canvas: this is
 * read at ~210px wide in a sidebar, so there is room for roughly four words and
 * one supporting line. Everything here is deliberately oversized.
 */
export type ThumbShape = 'statement' | 'stat' | 'versus' | 'person' | 'list';

export function YouTubeThumb(p: LayoutBaseProps) {
  const { w, h, surface, grain } = p;
  const u = unit(w);
  const shape = (p.shape as ThumbShape) ?? 'statement';
  const title = str(p.title);

  return (
    <Artboard w={w} h={h} surface={surface} grain={grain}>
      <div style={{ position: 'relative', zIndex: 1, height: '100%', padding: 58 * u, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 * u }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 * u }}>
            <Mark size={54 * u} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 34 * u, color: 'var(--art-fg)', letterSpacing: '-0.03em' }}>floatline</span>
          </div>
          {str(p.badge) ? <Chip u={u} tone="signal">{str(p.badge)}</Chip> : null}
        </div>

        {shape === 'stat' ? (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 40 * u }}>
            <Stat u={u} value={str(p.stat)} size={210} />
            <Headline u={u} size={64} weight={800}>{title}</Headline>
          </div>
        ) : shape === 'versus' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 26 * u, alignItems: 'center' }}>
            <Headline u={u} size={72} weight={800}>{str(p.leftLabel)}</Headline>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 44 * u, color: 'var(--art-signal)' }}>vs</span>
            <Headline u={u} size={72} weight={800}>{str(p.rightLabel)}</Headline>
          </div>
        ) : shape === 'list' ? (
          <div style={{ display: 'grid', gap: 12 * u }}>
            <Headline u={u} size={82} weight={800}>{title}</Headline>
            <div style={{ display: 'flex', gap: 12 * u, flexWrap: 'wrap' }}>
              {arr(p.items).slice(0, 3).map((it, i) => <Chip key={i} u={u} tone="outline">{it}</Chip>)}
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 18 * u }}>
            <Headline u={u} size={(p.titleSize as number) ?? 96} weight={800}>{title}</Headline>
            {str(p.body) ? (
              <div style={{ fontSize: 32 * u, color: 'var(--art-muted)', lineHeight: 1.25 }}>{str(p.body)}</div>
            ) : null}
          </div>
        )}

        <FloatBar u={u} pct={Number(p.pct ?? 62)} height={14} />
      </div>
    </Artboard>
  );
}
