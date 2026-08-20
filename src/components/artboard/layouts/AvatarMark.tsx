import { Artboard } from '../Artboard';
import { unit, Mark } from '../primitives';
import { str, type LayoutBaseProps } from './types';

/**
 * 400x400, circle-cropped by every platform. Everything must sit inside the
 * inscribed circle.
 *
 * DEVIATION, deliberate: the brief listed an "Avatar · Radial (campaign)"
 * variant. Floatline's stated rule is "never invent a gradient — this is a
 * flat-colour brand on warm paper." So the campaign slot is the FLOAT variant
 * below: flat concentric bands built from the logo's own float bar. Same intent
 * (a louder, campaign-season avatar), no rule broken.
 */
export type AvatarShape = 'mark' | 'float' | 'monogram' | 'initials';

export function AvatarMark(p: LayoutBaseProps) {
  const { w, h, surface, grain } = p;
  const u = unit(w * 2.7);
  const shape = (p.shape as AvatarShape) ?? 'mark';
  const size = Math.min(w, h);

  return (
    <Artboard w={w} h={h} surface={surface} grain={grain}>
      <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'grid', placeItems: 'center' }}>
        {shape === 'float' ? (
          <div style={{ position: 'relative', width: size * 0.74, height: size * 0.74, display: 'grid', placeItems: 'center' }}>
            {[1, 0.72, 0.44].map((r, i) => (
              <span
                key={i}
                style={{
                  position: 'absolute',
                  width: size * 0.74 * r,
                  height: size * 0.74 * r,
                  borderRadius: 999,
                  background: i === 1 ? 'var(--art-signal)' : 'var(--art-fg)',
                  opacity: i === 0 ? 0.18 : 1,
                }}
              />
            ))}
            <Mark size={size * 0.3} />
          </div>
        ) : shape === 'monogram' ? (
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: size * 0.52, color: 'var(--art-fg)', letterSpacing: '-0.05em', lineHeight: 1 }}>
            f
          </span>
        ) : shape === 'initials' ? (
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: size * 0.3, color: 'var(--art-fg)', letterSpacing: '-0.02em' }}>
            {str(p.initials, 'AO')}
          </span>
        ) : (
          <Mark size={size * 0.62} tone={p.tone === 'accent' ? 'accent' : 'auto'} />
        )}
        <span style={{ display: 'none' }}>{u}</span>
      </div>
    </Artboard>
  );
}
