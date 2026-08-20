import { Artboard } from '../Artboard';
import { unit, Mark, Headline, Lede, Chip, ReceiptRule, RowList, Stat, Quote, Eyebrow } from '../primitives';
import { str, arr, type LayoutBaseProps } from './types';

/**
 * Email images run at 600px CSS width and are viewed on a phone at 2x, so type
 * scales off a 600 baseline rather than 1080. These export as flat images to be
 * dropped into a campaign — they are not HTML email templates.
 */
export type EmailShape = 'header' | 'announce' | 'newsletter' | 'event' | 'promo' | 'story' | 'ctaBanner' | 'footer' | 'onboarding' | 'digest';

export function EmailBlock(p: LayoutBaseProps) {
  const { w, h, surface, grain } = p;
  const u = unit(w * 1.9);
  const shape = (p.shape as EmailShape) ?? 'header';
  const title = str(p.title);

  return (
    <Artboard w={w} h={h} surface={surface} grain={grain}>
      <div style={{ position: 'relative', zIndex: 1, height: '100%', padding: 46 * u, display: 'flex', flexDirection: 'column', justifyContent: shape === 'header' || shape === 'footer' ? 'center' : 'space-between', gap: 22 * u }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 * u }}>
          <Mark size={40 * u} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 34 * u, color: 'var(--art-fg)', letterSpacing: '-0.03em' }}>floatline</span>
          {str(p.eyebrow) ? <span style={{ marginLeft: 'auto' }}><Eyebrow u={u}>{str(p.eyebrow)}</Eyebrow></span> : null}
        </div>

        {shape === 'header' ? null : (
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 * u }}>
            {shape === 'digest' ? (
              <>
                <Headline u={u} size={50}>{title}</Headline>
                <ReceiptRule u={u} opacity={0.7} />
                <RowList u={u} items={arr(p.items)} numbered={false} size={26} />
              </>
            ) : shape === 'story' ? (
              <>
                <Quote u={u} size={42}>“{str(p.quote)}”</Quote>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22 * u, color: 'var(--art-muted)' }}>{str(p.attribution)}</div>
              </>
            ) : shape === 'promo' ? (
              <>
                <Stat u={u} value={str(p.stat)} label={str(p.statLabel)} size={130} />
                <Headline u={u} size={48}>{title}</Headline>
              </>
            ) : (
              <>
                <Headline u={u} size={shape === 'ctaBanner' ? 56 : 50}>{title}</Headline>
                {str(p.body) ? <Lede u={u} size={27}>{str(p.body)}</Lede> : null}
                {arr(p.items).length ? <RowList u={u} items={arr(p.items)} numbered={shape === 'onboarding'} size={25} /> : null}
              </>
            )}
          </div>
        )}

        {shape === 'header' ? (
          <Headline u={u} size={52}>{title}</Headline>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 18 * u }}>
            {str(p.cta) ? <Chip u={u} tone="solid">{str(p.cta)}</Chip> : <span />}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 21 * u, color: 'var(--art-muted)' }}>{str(p.url, 'floatline.app')}</span>
          </div>
        )}
      </div>
    </Artboard>
  );
}
