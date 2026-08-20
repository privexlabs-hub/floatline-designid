import { Artboard } from '../Artboard';
import { unit, Frame, Wordmark, Eyebrow, Headline, Lede, RowList, ReceiptRule, Chip, Stat, Quote } from '../primitives';
import { str, arr, type LayoutBaseProps } from './types';

/**
 * One slide of a deck. `role` decides the furniture; `index`/`total` render the
 * position marker so a ten-slide deck reads as a sequence rather than ten
 * unrelated squares.
 */
export type SlideRole =
  | 'hook' | 'problem' | 'insight' | 'solution' | 'proof'
  | 'steps' | 'examples' | 'data' | 'takeaways' | 'close';

export function CarouselSlide(p: LayoutBaseProps) {
  const { w, h, surface, grain } = p;
  const u = unit(w);
  const role = (p.role as SlideRole) ?? 'hook';
  const index = Number(p.index ?? 1);
  const total = Number(p.total ?? 10);
  const title = str(p.title);
  const bodyText = str(p.body);
  const big = role === 'hook' || role === 'close';

  return (
    <Artboard w={w} h={h} surface={surface} grain={grain}>
      <Frame
        u={u}
        pad={86}
        header={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 * u }}>
            <Wordmark u={u} size={27} showMark={big} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22 * u, color: 'var(--art-muted)', letterSpacing: '0.08em' }}>
              {String(index).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </div>
        }
        footer={
          role === 'close' ? (
            <>
              <ReceiptRule u={u} />
              <div style={{ height: 24 * u }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 * u }}>
                <Chip u={u} tone="solid">{str(p.cta, 'Start free')}</Chip>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22 * u, color: 'var(--art-muted)' }}>{str(p.url, 'floatline.app')}</span>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 8 * u }}>
              {Array.from({ length: total }, (_, i) => (
                <span
                  key={i}
                  style={{
                    height: 6 * u,
                    flex: 1,
                    borderRadius: 999,
                    background: i < index ? 'var(--art-signal)' : 'color-mix(in srgb, var(--art-fg) 18%, transparent)',
                  }}
                />
              ))}
            </div>
          )
        }
      >
        {str(p.eyebrow) ? <Eyebrow u={u} tone="signal">{str(p.eyebrow)}</Eyebrow> : null}
        {role === 'data' ? (
          <Stat u={u} value={str(p.stat)} label={str(p.statLabel)} size={190} />
        ) : role === 'proof' ? (
          <>
            <Quote u={u} size={48}>“{str(p.quote) || title}”</Quote>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 23 * u, color: 'var(--art-muted)' }}>{str(p.attribution)}</div>
          </>
        ) : (
          <>
            <Headline u={u} size={big ? 88 : 62} weight={big ? 800 : 700}>{title}</Headline>
            {bodyText ? <Lede u={u} size={big ? 30 : 28}>{bodyText}</Lede> : null}
            {arr(p.items).length ? (
              <>
                <ReceiptRule u={u} opacity={0.7} />
                <RowList u={u} items={arr(p.items)} numbered={role === 'steps'} size={27} />
              </>
            ) : null}
          </>
        )}
      </Frame>
    </Artboard>
  );
}
