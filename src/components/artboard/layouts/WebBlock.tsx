import { Artboard } from '../Artboard';
import { unit, Wordmark, Eyebrow, Headline, Lede, Chip, ReceiptRule, RowList, Stat, Quote, Panel, FloatBar } from '../primitives';
import { str, arr, type LayoutBaseProps } from './types';

/**
 * Marketing-site imagery: hero, feature, product, testimonial, case study, CTA,
 * blog hero, Open Graph card, social share, banner. Wide canvases, so a
 * two-column split is the default rather than the exception.
 */
export type WebShape =
  | 'hero' | 'feature' | 'product' | 'testimonial' | 'caseStudy'
  | 'cta' | 'blogHero' | 'og' | 'share' | 'banner' | 'pricing' | 'integrations' | 'docs' | 'changelog';

export function WebBlock(p: LayoutBaseProps) {
  const { w, h, surface, grain } = p;
  const u = unit(w * 0.78);
  const shape = (p.shape as WebShape) ?? 'hero';
  const title = str(p.title);
  const wide = w / h > 2.2;

  return (
    <Artboard w={w} h={h} surface={surface} grain={grain}>
      <div style={{ position: 'relative', zIndex: 1, height: '100%', padding: `${(wide ? 52 : 76) * u}px ${84 * u}px`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 24 * u }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 * u }}>
          <Wordmark u={u} size={30} />
          {str(p.eyebrow) ? <Eyebrow u={u} tone="signal">{str(p.eyebrow)}</Eyebrow> : null}
        </div>

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24 * u }}>
          {shape === 'testimonial' ? (
            <>
              <Quote u={u} size={54}>“{str(p.quote)}”</Quote>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24 * u, color: 'var(--art-muted)' }}>{str(p.attribution)}</div>
            </>
          ) : shape === 'pricing' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 * u }}>
              {arr(p.items).slice(0, 3).map((it, i) => {
                const [tier, price, note] = it.split('|');
                return (
                  <Panel key={i} u={u} tone={i === 1 ? 'raised' : 'outline'} pad={30}>
                    <Eyebrow u={u} tone={i === 1 ? 'signal' : 'muted'}>{tier?.trim()}</Eyebrow>
                    <div style={{ marginTop: 14 * u, fontFamily: 'var(--font-money)', fontFeatureSettings: '"tnum"', fontSize: 52 * u, fontWeight: 700, color: 'var(--art-fg)' }}>{price?.trim()}</div>
                    <div style={{ marginTop: 10 * u, fontSize: 22 * u, color: 'var(--art-muted)', lineHeight: 1.35 }}>{note?.trim()}</div>
                  </Panel>
                );
              })}
            </div>
          ) : shape === 'integrations' ? (
            <>
              <Headline u={u} size={56}>{title}</Headline>
              <div style={{ display: 'flex', gap: 14 * u, flexWrap: 'wrap' }}>
                {arr(p.items).map((it, i) => <Chip key={i} u={u} tone="outline">{it}</Chip>)}
              </div>
            </>
          ) : shape === 'caseStudy' ? (
            <>
              <Headline u={u} size={54}>{title}</Headline>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 * u }}>
                {arr(p.items).slice(0, 3).map((it, i) => {
                  const [v, l] = it.split('|');
                  return <Panel key={i} u={u} tone="outline" pad={26}><Stat u={u} value={v?.trim() ?? ''} label={l?.trim()} size={72} /></Panel>;
                })}
              </div>
            </>
          ) : shape === 'feature' || shape === 'product' || shape === 'docs' || shape === 'changelog' ? (
            <div style={{ display: 'grid', gridTemplateColumns: wide ? '1fr' : '1.15fr 0.85fr', gap: 44 * u, alignItems: 'center' }}>
              <div style={{ display: 'grid', gap: 20 * u }}>
                {str(p.badge) ? <Chip u={u} tone="signal">{str(p.badge)}</Chip> : null}
                <Headline u={u} size={wide ? 52 : 60}>{title}</Headline>
                {str(p.body) ? <Lede u={u} size={28}>{str(p.body)}</Lede> : null}
              </div>
              {!wide ? (
                <Panel u={u} tone="raised" pad={34}>
                  <RowList u={u} items={arr(p.items)} numbered={shape === 'docs'} size={25} />
                  <div style={{ height: 22 * u }} />
                  <FloatBar u={u} pct={Number(p.pct ?? 74)} label={str(p.barLabel)} />
                </Panel>
              ) : null}
            </div>
          ) : (
            <>
              {str(p.badge) ? <Chip u={u} tone="signal">{str(p.badge)}</Chip> : null}
              <Headline u={u} size={wide ? 62 : 82} weight={800}>{title}</Headline>
              {str(p.body) ? <Lede u={u} size={wide ? 28 : 32}>{str(p.body)}</Lede> : null}
              {arr(p.items).length && !wide ? <RowList u={u} items={arr(p.items)} numbered={false} size={26} /> : null}
            </>
          )}
        </div>

        <div style={{ display: 'grid', gap: 20 * u }}>
          <ReceiptRule u={u} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 * u }}>
            {str(p.cta) ? <Chip u={u} tone="solid">{str(p.cta)}</Chip> : <span />}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22 * u, color: 'var(--art-muted)' }}>{str(p.url, 'floatline.app')}</span>
          </div>
        </div>
      </div>
    </Artboard>
  );
}
