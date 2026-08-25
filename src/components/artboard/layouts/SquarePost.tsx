import { Artboard } from '../Artboard';
import { unit, Frame, Wordmark, Eyebrow, Headline, Lede, Stat, Quote, RowList, ReceiptRule, CtaFooter, Chip, FloatBar, StatusDot, ReadFraction, Money, CustomerLogo } from '../primitives';
import { str, arr, type LayoutBaseProps } from './types';

/**
 * The workhorse. One component, ten shapes — selected by the preset's
 * `props.shape`, so a "big stat card" and a "customer quote" are the same
 * layout with different furniture rather than two files that drift apart.
 */
export type SquareShape =
  | 'statement' | 'stat' | 'quote' | 'list' | 'split'
  | 'announce' | 'compare' | 'meta' | 'progress' | 'question';

export function SquarePost(p: LayoutBaseProps) {
  const { w, h, surface, grain } = p;
  const u = unit(w);
  const shape = (p.shape as SquareShape) ?? 'statement';
  const pad = (p.pad as number) ?? 84;

  const eyebrow = str(p.eyebrow);
  const title = str(p.title);
  const bodyText = str(p.body);
  const cta = str(p.cta);
  const url = str(p.url);

  return (
    <Artboard w={w} h={h} surface={surface} grain={grain}>
      <Frame
        u={u}
        pad={pad}
        header={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 * u }}>
            <Wordmark u={u} size={30} />
            {eyebrow ? <Eyebrow u={u} tone="signal">{eyebrow}</Eyebrow> : null}
          </div>
        }
        footer={<><ReceiptRule u={u} /><div style={{ height: 26 * u }} /><CtaFooter u={u} cta={cta} url={url} /></>}
      >
        {shape === 'stat' ? (
          <>
            <Stat u={u} value={str(p.stat)} label={str(p.statLabel)} size={(p.statSize as number) ?? 200} />
            {title ? <Headline u={u} size={52}>{title}</Headline> : null}
            {bodyText ? <Lede u={u}>{bodyText}</Lede> : null}
          </>
        ) : shape === 'quote' ? (
          <>
            <Quote u={u} size={(p.quoteSize as number) ?? 58}>“{str(p.quote) || title}”</Quote>
            <ReceiptRule u={u} opacity={0.7} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 22 * u, flexWrap: 'wrap' }}>
              {p.logo !== undefined ? <CustomerLogo u={u} src={str(p.logo)} height={44} /> : null}
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24 * u, color: 'var(--art-muted)' }}>
                {str(p.attribution)}
              </div>
            </div>
          </>
        ) : shape === 'list' ? (
          <>
            <Headline u={u} size={(p.titleSize as number) ?? 64}>{title}</Headline>
            <ReceiptRule u={u} opacity={0.7} />
            <RowList u={u} items={arr(p.items)} numbered={p.numbered !== false} />
          </>
        ) : shape === 'compare' ? (
          <>
            <Headline u={u} size={58}>{title}</Headline>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 * u, marginTop: 8 * u }}>
              <div style={{ display: 'grid', gap: 16 * u, alignContent: 'start' }}>
                <Chip u={u} tone="outline">{str(p.leftLabel, 'Before')}</Chip>
                <RowList u={u} items={arr(p.leftItems)} size={25} />
              </div>
              <div style={{ display: 'grid', gap: 16 * u, alignContent: 'start' }}>
                <Chip u={u} tone="signal">{str(p.rightLabel, 'With Floatline')}</Chip>
                <RowList u={u} items={arr(p.rightItems)} size={25} />
              </div>
            </div>
          </>
        ) : shape === 'progress' ? (
          <>
            <Headline u={u} size={58}>{title}</Headline>
            {bodyText ? <Lede u={u}>{bodyText}</Lede> : null}
            <div style={{ display: 'grid', gap: 24 * u, marginTop: 12 * u }}>
              <FloatBar u={u} pct={Number(p.pct ?? 68)} label={str(p.barLabel)} />
              <div style={{ display: 'flex', gap: 28 * u, alignItems: 'center', flexWrap: 'wrap' }}>
                <StatusDot u={u} status="on-track" />
                <ReadFraction u={u} read={Number(p.read ?? 29)} total={Number(p.total ?? 32)} />
                {p.amount ? <Money u={u} amount={str(p.amount)} currency={p.currency} /> : null}
              </div>
            </div>
          </>
        ) : shape === 'split' ? (
          <>
            <Headline u={u} size={58}>{title}</Headline>
            <ReceiptRule u={u} opacity={0.7} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 34 * u }}>
              <div style={{ display: 'grid', gap: 14 * u, alignContent: 'start' }}>
                <Eyebrow u={u}>{str(p.leftLabel, 'Problem')}</Eyebrow>
                <Lede u={u} size={27}>{str(p.leftBody)}</Lede>
              </div>
              <div style={{ display: 'grid', gap: 14 * u, alignContent: 'start' }}>
                <Eyebrow u={u} tone="signal">{str(p.rightLabel, 'Solution')}</Eyebrow>
                <Lede u={u} size={27}>{str(p.rightBody)}</Lede>
              </div>
            </div>
          </>
        ) : shape === 'meta' ? (
          <>
            <Chip u={u} tone="signal">{str(p.badge, 'New')}</Chip>
            <Headline u={u} size={66}>{title}</Headline>
            {bodyText ? <Lede u={u}>{bodyText}</Lede> : null}
            {arr(p.items).length ? (
              <>
                <ReceiptRule u={u} opacity={0.7} />
                <RowList u={u} items={arr(p.items)} numbered={false} size={26} />
              </>
            ) : null}
          </>
        ) : shape === 'question' ? (
          <>
            <Headline u={u} size={(p.titleSize as number) ?? 74} weight={800}>{title}</Headline>
            {bodyText ? <Lede u={u} size={28}>{bodyText}</Lede> : null}
            {arr(p.items).length ? (
              <div style={{ display: 'flex', gap: 14 * u, flexWrap: 'wrap', marginTop: 8 * u }}>
                {arr(p.items).map((it, i) => <Chip key={i} u={u} tone={i === 0 ? 'signal' : 'outline'}>{it}</Chip>)}
              </div>
            ) : null}
          </>
        ) : shape === 'announce' ? (
          <>
            <Chip u={u} tone="signal">{str(p.badge, 'Launch')}</Chip>
            <Headline u={u} size={(p.titleSize as number) ?? 82} weight={800}>{title}</Headline>
            {bodyText ? <Lede u={u} size={30}>{bodyText}</Lede> : null}
          </>
        ) : (
          <>
            <Headline u={u} size={(p.titleSize as number) ?? 76}>{title}</Headline>
            {bodyText ? <Lede u={u}>{bodyText}</Lede> : null}
          </>
        )}
      </Frame>
    </Artboard>
  );
}
