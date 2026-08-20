import { Artboard } from '../Artboard';
import { unit, Mark, Headline, Lede, Chip, ReceiptRule } from '../primitives';
import { str, type LayoutBaseProps } from './types';

/**
 * NOTE on widths — do not reintroduce shrink-to-fit here.
 * html-to-image pins every cloned element to its measured DOM size. A text
 * block sized by `align-items: flex-start` measures EXACTLY as wide as its
 * longest line, so the pinned width has zero tolerance: any sub-pixel metric
 * difference in the export context wraps the line, and because the height is
 * pinned too, the extra line overflows and collides with whatever is below it.
 * Every text container here is therefore explicitly full width.
 *
 * Every wide banner: X and LinkedIn headers, Facebook and Twitch covers,
 * YouTube channel art, podcast cover, newsletter header, OG cover, event and
 * community banners.
 *
 * The aspect ratios here span 0.35:1 (LinkedIn) to 1:1 (podcast), so type
 * scales off the SHORTER side. Scaling off width would give the podcast cover
 * an eight-pixel headline and the LinkedIn cover one that does not fit.
 */
export type CoverShape = 'lockup' | 'statement' | 'square';

export function CoverBanner(p: LayoutBaseProps) {
  const { w, h, surface, grain } = p;
  const u = unit(Math.min(w, h) * (h > w * 0.8 ? 1 : 2.2));
  const shape = (p.shape as CoverShape) ?? 'lockup';
  const align = (p.align as string) ?? 'center';
  const insetLeft = Number(p.insetLeft ?? 0);

  if (shape === 'square') {
    return (
      <Artboard w={w} h={h} surface={surface} grain={grain}>
        <div style={{ position: 'relative', zIndex: 1, height: '100%', padding: 90 * u, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'stretch' }}>
          <Mark size={130 * u} />
          <div style={{ display: 'grid', gap: 22 * u, width: '100%' }}>
            <Headline u={u} size={92} weight={800}>{str(p.title)}</Headline>
            {str(p.body) ? <Lede u={u} size={34}>{str(p.body)}</Lede> : null}
          </div>
          <div style={{ width: '100%', display: 'grid', gap: 20 * u }}>
            <ReceiptRule u={u} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 26 * u, color: 'var(--art-muted)' }}>{str(p.url, 'floatline.app')}</span>
          </div>
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
          paddingTop: 44 * u,
          paddingBottom: 44 * u,
          paddingRight: 64 * u,
          // LinkedIn overlays the profile photo on the lower left; X overlays
          // the avatar. Presets pass the inset so the lockup clears it.
          paddingLeft: (64 + insetLeft) * u,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'stretch',
          textAlign: align === 'center' ? 'center' : 'left',
          gap: 18 * u,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 * u, width: '100%', justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
          <Mark size={72 * u} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 60 * u, color: 'var(--art-fg)', letterSpacing: '-0.035em', lineHeight: 1 }}>
            floatline
          </span>
        </div>
        {shape === 'statement' && str(p.title) ? <Headline u={u} size={46}>{str(p.title)}</Headline> : null}
        {str(p.body) ? <Lede u={u} size={28}>{str(p.body)}</Lede> : null}
        {str(p.cta) ? (
          <div style={{ display: 'flex', justifyContent: align === 'center' ? 'center' : 'flex-start', width: '100%' }}>
            <Chip u={u} tone="signal">{str(p.cta)}</Chip>
          </div>
        ) : null}
      </div>
    </Artboard>
  );
}
