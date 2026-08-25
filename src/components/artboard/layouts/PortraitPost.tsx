import { Artboard } from '../Artboard';
import { unit, Frame, Wordmark, Eyebrow, Headline, Lede, Stat, Quote, RowList, ReceiptRule, CtaFooter, Chip, Panel, CustomerLogo } from '../primitives';
import { str, arr, type LayoutBaseProps } from './types';

/** 4:5 — the tallest shape the feed shows in full. More room for a lede. */
export type PortraitShape =
  | 'announce' | 'product' | 'quote' | 'stat' | 'educational'
  | 'testimonial' | 'caseStudy' | 'cta' | 'compare' | 'cover' | 'hiring';

export function PortraitPost(p: LayoutBaseProps) {
  const { w, h, surface, grain } = p;
  const u = unit(w);
  const shape = (p.shape as PortraitShape) ?? 'announce';
  const title = str(p.title);
  const bodyText = str(p.body);

  return (
    <Artboard w={w} h={h} surface={surface} grain={grain}>
      <Frame
        u={u}
        pad={82}
        header={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 * u }}>
            <Wordmark u={u} size={30} />
            {str(p.eyebrow) ? <Eyebrow u={u} tone="signal">{str(p.eyebrow)}</Eyebrow> : null}
          </div>
        }
        footer={<><ReceiptRule u={u} /><div style={{ height: 24 * u }} /><CtaFooter u={u} cta={str(p.cta)} url={str(p.url)} /></>}
      >
        {shape === 'stat' ? (
          <>
            <Stat u={u} value={str(p.stat)} label={str(p.statLabel)} size={216} />
            <ReceiptRule u={u} opacity={0.7} />
            <Lede u={u}>{bodyText}</Lede>
          </>
        ) : shape === 'quote' || shape === 'testimonial' ? (
          <>
            <Quote u={u} size={56}>“{str(p.quote) || title}”</Quote>
            <ReceiptRule u={u} opacity={0.7} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 22 * u, flexWrap: 'wrap' }}>
              {p.logo !== undefined ? <CustomerLogo u={u} src={str(p.logo)} height={44} /> : null}
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 25 * u, color: 'var(--art-muted)' }}>{str(p.attribution)}</div>
            </div>
          </>
        ) : shape === 'caseStudy' ? (
          <>
            <Chip u={u} tone="outline">{str(p.badge, 'Case study')}</Chip>
            <Headline u={u} size={62}>{title}</Headline>
            <div style={{ display: 'grid', gap: 20 * u }}>
              {arr(p.items).map((it, i) => {
                const [k, v] = it.split('|');
                return (
                  <Panel key={i} u={u} tone={i === 0 ? 'raised' : 'outline'} pad={28}>
                    <Eyebrow u={u}>{k?.trim()}</Eyebrow>
                    <div style={{ marginTop: 10 * u, fontSize: 27 * u, lineHeight: 1.36, color: 'var(--art-fg-2)' }}>{v?.trim()}</div>
                  </Panel>
                );
              })}
            </div>
          </>
        ) : shape === 'compare' ? (
          <>
            <Headline u={u} size={60}>{title}</Headline>
            <ReceiptRule u={u} opacity={0.7} />
            <div style={{ display: 'grid', gap: 22 * u }}>
              <div><Chip u={u} tone="outline">{str(p.leftLabel, 'Without')}</Chip><div style={{ height: 14 * u }} /><RowList u={u} items={arr(p.leftItems)} numbered={false} size={26} /></div>
              <ReceiptRule u={u} opacity={0.6} />
              <div><Chip u={u} tone="signal">{str(p.rightLabel, 'With Floatline')}</Chip><div style={{ height: 14 * u }} /><RowList u={u} items={arr(p.rightItems)} numbered={false} size={26} /></div>
            </div>
          </>
        ) : shape === 'educational' ? (
          <>
            <Headline u={u} size={62}>{title}</Headline>
            {bodyText ? <Lede u={u} size={29}>{bodyText}</Lede> : null}
            <ReceiptRule u={u} opacity={0.7} />
            <RowList u={u} items={arr(p.items)} numbered size={28} />
          </>
        ) : (
          <>
            {str(p.badge) ? <Chip u={u} tone="signal">{str(p.badge)}</Chip> : null}
            <Headline u={u} size={(p.titleSize as number) ?? 76} weight={800}>{title}</Headline>
            {bodyText ? <Lede u={u} size={30}>{bodyText}</Lede> : null}
            {arr(p.items).length ? <RowList u={u} items={arr(p.items)} numbered={false} size={27} /> : null}
          </>
        )}
      </Frame>
    </Artboard>
  );
}
