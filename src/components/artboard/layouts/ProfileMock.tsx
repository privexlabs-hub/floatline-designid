import { Artboard } from '../Artboard';
import { unit, Mark, ReceiptRule, Chip } from '../primitives';
import { str, arr, type LayoutBaseProps } from './types';

/**
 * Not an exportable asset so much as a REFERENCE: how the avatar, cover and bio
 * sit together once a platform has cropped them. It catches the mistakes a
 * standalone artboard cannot — an avatar that collides with the LinkedIn cover,
 * a bio that overruns X's 160 characters.
 */
export function ProfileMock(p: LayoutBaseProps) {
  const { w, h, surface, grain } = p;
  const u = unit(w);
  const platform = str(p.platform, 'x');
  const bio = str(p.bio);
  const limit = platform === 'x' ? 160 : platform === 'instagram' ? 150 : 220;

  return (
    <Artboard w={w} h={h} surface={surface} grain={grain}>
      <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: h * 0.3, background: 'var(--art-accent)', display: 'grid', placeItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 54 * u, color: 'var(--art-accent-fg)', letterSpacing: '-0.03em' }}>floatline</span>
        </div>
        <div style={{ padding: `0 ${64 * u}px ${64 * u}px`, marginTop: -56 * u, display: 'grid', gap: 22 * u }}>
          <div style={{ width: 148 * u, height: 148 * u, borderRadius: 999, background: 'var(--art-bg)', display: 'grid', placeItems: 'center', border: `${6 * u}px solid var(--art-bg)` }}>
            <Mark size={128 * u} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 46 * u, color: 'var(--art-fg)', letterSpacing: '-0.025em' }}>{str(p.name, 'Floatline')}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24 * u, color: 'var(--art-muted)', marginTop: 6 * u }}>{str(p.handle, '@floatline')}</div>
          </div>
          <div style={{ fontSize: 27 * u, lineHeight: 1.42, color: 'var(--art-fg-2)' }}>{bio}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20 * u, color: bio.length > limit ? '#C8362A' : 'var(--art-muted)' }}>
            {bio.length} / {limit} characters
          </div>
          <ReceiptRule u={u} />
          <div style={{ display: 'flex', gap: 12 * u, flexWrap: 'wrap' }}>
            {arr(p.items).map((it, i) => <Chip key={i} u={u} tone="outline">{it}</Chip>)}
          </div>
        </div>
      </div>
    </Artboard>
  );
}
