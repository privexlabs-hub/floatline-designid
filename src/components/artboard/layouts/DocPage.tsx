import { Artboard } from '../Artboard';
import {
  unit, Mark, Wordmark, Eyebrow, Headline, Lede, Quote, RowList, ReceiptRule,
  Chip, Stat, Panel, BarList, DataTable, PageFooter, CustomerLogo, FloatBar,
} from '../primitives';
import { str, arr, type LayoutBaseProps } from './types';

/**
 * A page of a long-form document, or a slide of a presentation.
 *
 * One component for both, because they are the same object at different aspect
 * ratios — a cover is a cover whether it is A4 or 16:9, and every size here is
 * proportional through `unit(w)` already. The `shape` prop selects the
 * furniture, exactly as SquarePost and EngagementPost do.
 *
 * The sequence passes `pageNumber`, `pageTotal`, `runningHeader` and, for the
 * contents page, `tocEntries` — so the table of contents is COMPUTED from the
 * real pages rather than typed by hand and left to rot.
 */
export type DocShape =
  | 'cover' | 'toc' | 'section' | 'body' | 'data' | 'quote'
  | 'findings' | 'recommendations' | 'caseStudy' | 'references'
  | 'back' | 'onepager' | 'agenda' | 'pricing';

export function DocPage(p: LayoutBaseProps) {
  const { w, h, surface, grain } = p;
  // Scaled off the SHORTER side, not the width.
  //
  // A page is constrained by whichever edge runs out first, and for a 16:9
  // slide that is the height — 1080px against A4's 1754. Keying on width gave
  // the slides type sized for a page half again as tall, and six of the nine
  // overflowed. Long pages are also read at arm's length rather than thumbed
  // past in a feed, so the baseline stays tighter than the social canvases.
  const u = unit(Math.min(w, h) * 1.34);
  const shape = (p.shape as DocShape) ?? 'body';
  const wide = w > h;

  const title = str(p.title);
  const bodyText = str(p.body);
  const pageNumber = p.pageNumber as number | undefined;
  const pageTotal = p.pageTotal as number | undefined;
  const header = str(p.runningHeader) || str(p.eyebrow);
  const numbering = p.numbering !== false;

  const toc = arr(p.tocEntries);
  const pad = (p.pad as number) ?? (wide ? 96 : 110);

  const footer =
    shape === 'cover' || shape === 'back' ? null : (
      <PageFooter u={u} header={header} page={pageNumber} total={pageTotal} show={numbering} />
    );

  return (
    <Artboard w={w} h={h} surface={surface} grain={grain}>
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          padding: pad * u,
          display: 'flex',
          flexDirection: 'column',
          gap: 34 * u,
        }}
      >
        {shape === 'cover' || shape === 'back' ? null : (
          <div style={{ flex: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 * u }}>
            <Wordmark u={u} size={26} showMark={false} />
            {str(p.eyebrow) ? <Eyebrow u={u} tone="signal">{str(p.eyebrow)}</Eyebrow> : null}
          </div>
        )}

        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: shape === 'cover' || shape === 'section' || shape === 'back' ? 'center' : 'flex-start',
            gap: 30 * u,
          }}
        >
          {shape === 'cover' ? (
            <>
              <Mark size={104 * u} />
              <div style={{ height: 16 * u }} />
              {str(p.badge) ? <Chip u={u} tone="signal">{str(p.badge)}</Chip> : null}
              <Headline u={u} size={wide ? 92 : 104} weight={800}>{title}</Headline>
              {bodyText ? <Lede u={u} size={34}>{bodyText}</Lede> : null}
              <div style={{ marginTop: 'auto', display: 'grid', gap: 20 * u, width: '100%' }}>
                <ReceiptRule u={u} />
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20 * u, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 24 * u, color: 'var(--art-muted)' }}>
                    {str(p.meta, 'Floatline')}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 24 * u, color: 'var(--art-muted)' }}>
                    {str(p.date)}
                  </span>
                </div>
              </div>
            </>
          ) : shape === 'toc' || shape === 'agenda' ? (
            <>
              <Headline u={u} size={64}>{title || (shape === 'agenda' ? 'Agenda' : 'Contents')}</Headline>
              <ReceiptRule u={u} opacity={0.7} />
              <div style={{ display: 'grid', gap: 20 * u, width: '100%' }}>
                {(toc.length ? toc : arr(p.items)).map((entry, i) => {
                  const [label, num] = entry.split('|').map((x) => x.trim());
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 14 * u }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22 * u, color: 'var(--art-signal-text)' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span style={{ fontSize: 28 * u, color: 'var(--art-fg)' }}>{label}</span>
                      <span style={{ flex: 1, borderBottom: `${Math.max(1, u)}px dotted var(--art-rule)`, transform: `translateY(${-6 * u}px)` }} />
                      {num ? (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22 * u, color: 'var(--art-muted)', fontFeatureSettings: '"tnum"' }}>
                          {num}
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </>
          ) : shape === 'section' ? (
            <>
              {str(p.badge) ? <Eyebrow u={u} tone="signal">{str(p.badge)}</Eyebrow> : null}
              <Headline u={u} size={wide ? 88 : 96} weight={800}>{title}</Headline>
              {bodyText ? <Lede u={u} size={32}>{bodyText}</Lede> : null}
            </>
          ) : shape === 'data' ? (
            <>
              <Headline u={u} size={54}>{title}</Headline>
              {bodyText ? <Lede u={u} size={26}>{bodyText}</Lede> : null}
              {str(p.stat) ? (
                // A grid, not a wrapping flex row: two long figures side by
                // side is the point, and wrapping made them stack and push the
                // footer off the page.
                <div style={{ display: 'grid', gridTemplateColumns: str(p.stat2) ? '1fr 1fr' : '1fr', gap: 32 * u }}>
                  <Stat u={u} value={str(p.stat)} label={str(p.statLabel)} size={78} />
                  {str(p.stat2) ? <Stat u={u} value={str(p.stat2)} label={str(p.stat2Label)} size={78} /> : null}
                </div>
              ) : null}
              {arr(p.bars).length ? <BarList u={u} rows={arr(p.bars)} /> : null}
              {arr(p.table).length ? <DataTable u={u} rows={arr(p.table)} /> : null}
              {str(p.source) ? (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18 * u, color: 'var(--art-muted)' }}>
                  Source · {str(p.source)}
                </span>
              ) : null}
            </>
          ) : shape === 'quote' ? (
            <>
              <Quote u={u} size={wide ? 64 : 58}>&ldquo;{str(p.quote) || title}&rdquo;</Quote>
              <ReceiptRule u={u} opacity={0.7} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 * u, flexWrap: 'wrap' }}>
                <CustomerLogo u={u} src={str(p.logo)} height={48} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 24 * u, color: 'var(--art-muted)' }}>
                  {str(p.attribution)}
                </span>
              </div>
            </>
          ) : shape === 'findings' || shape === 'recommendations' ? (
            <>
              <Headline u={u} size={58}>{title}</Headline>
              {bodyText ? <Lede u={u} size={26}>{bodyText}</Lede> : null}
              <ReceiptRule u={u} opacity={0.7} />
              <div style={{ display: 'grid', gap: 24 * u }}>
                {arr(p.items).map((it, i) => {
                  const [head, detail] = it.split('|').map((x) => x.trim());
                  return (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: `${52 * u}px 1fr`, gap: 20 * u }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 26 * u, color: 'var(--art-signal-text)', fontWeight: 600 }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <div style={{ fontSize: 28 * u, fontWeight: 700, color: 'var(--art-fg)', lineHeight: 1.3 }}>{head}</div>
                        {detail ? (
                          <div style={{ marginTop: 8 * u, fontSize: 25 * u, lineHeight: 1.45, color: 'var(--art-fg-2)' }}>{detail}</div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : shape === 'caseStudy' ? (
            <>
              <div className="row" style={{ display: 'flex', gap: 24 * u, alignItems: 'center', flexWrap: 'wrap' }}>
                <CustomerLogo u={u} src={str(p.logo)} height={56} />
                {str(p.badge) ? <Chip u={u} tone="outline">{str(p.badge)}</Chip> : null}
              </div>
              <Headline u={u} size={58}>{title}</Headline>
              <div style={{ display: 'grid', gap: 22 * u }}>
                {arr(p.items).map((it, i) => {
                  const [k, v] = it.split('|').map((x) => x.trim());
                  return (
                    <Panel key={i} u={u} tone={i === 0 ? 'raised' : 'outline'} pad={30}>
                      <Eyebrow u={u}>{k}</Eyebrow>
                      <div style={{ marginTop: 10 * u, fontSize: 26 * u, lineHeight: 1.42, color: 'var(--art-fg-2)' }}>{v}</div>
                    </Panel>
                  );
                })}
              </div>
            </>
          ) : shape === 'references' ? (
            <>
              <Headline u={u} size={54}>{title || 'References'}</Headline>
              <ReceiptRule u={u} opacity={0.7} />
              <div style={{ display: 'grid', gap: 16 * u }}>
                {arr(p.items).map((it, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: `${44 * u}px 1fr`, gap: 16 * u }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 20 * u, color: 'var(--art-muted)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ fontSize: 22 * u, lineHeight: 1.5, color: 'var(--art-fg-2)' }}>{it}</span>
                  </div>
                ))}
              </div>
            </>
          ) : shape === 'pricing' ? (
            <>
              <Headline u={u} size={58}>{title}</Headline>
              {bodyText ? <Lede u={u} size={26}>{bodyText}</Lede> : null}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 * u }}>
                {arr(p.items).slice(0, 3).map((it, i) => {
                  const [tier, price, note] = it.split('|').map((x) => x.trim());
                  return (
                    <Panel key={i} u={u} tone={i === 1 ? 'raised' : 'outline'} pad={30}>
                      <Eyebrow u={u} tone={i === 1 ? 'signal' : 'muted'}>{tier}</Eyebrow>
                      <div style={{ marginTop: 14 * u, fontFamily: 'var(--font-money)', fontFeatureSettings: '"tnum"', fontSize: 46 * u, fontWeight: 700, color: 'var(--art-fg)' }}>
                        {price}
                      </div>
                      <div style={{ marginTop: 10 * u, fontSize: 21 * u, color: 'var(--art-muted)', lineHeight: 1.4 }}>{note}</div>
                    </Panel>
                  );
                })}
              </div>
              {arr(p.table).length ? <DataTable u={u} rows={arr(p.table)} /> : null}
            </>
          ) : shape === 'onepager' ? (
            <>
              <Headline u={u} size={52} weight={800}>{title}</Headline>
              <Lede u={u} size={25}>{bodyText}</Lede>
              <ReceiptRule u={u} opacity={0.7} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 * u }}>
                <div style={{ display: 'grid', gap: 12 * u, alignContent: 'start' }}>
                  <Eyebrow u={u}>{str(p.leftLabel, 'The problem')}</Eyebrow>
                  <RowList u={u} items={arr(p.leftItems)} numbered={false} size={22} />
                </div>
                <div style={{ display: 'grid', gap: 12 * u, alignContent: 'start' }}>
                  <Eyebrow u={u} tone="signal">{str(p.rightLabel, 'With Floatline')}</Eyebrow>
                  <RowList u={u} items={arr(p.rightItems)} numbered={false} size={22} />
                </div>
              </div>
              {arr(p.bars).length ? (
                <>
                  <ReceiptRule u={u} opacity={0.7} />
                  <BarList u={u} rows={arr(p.bars)} />
                </>
              ) : null}
            </>
          ) : shape === 'back' ? (
            <>
              <Mark size={92 * u} />
              <div style={{ height: 20 * u }} />
              <Headline u={u} size={wide ? 80 : 84} weight={800}>{title}</Headline>
              {bodyText ? <Lede u={u} size={32}>{bodyText}</Lede> : null}
              <div style={{ marginTop: 'auto', width: '100%', display: 'grid', gap: 22 * u }}>
                <ReceiptRule u={u} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 * u, flexWrap: 'wrap' }}>
                  {str(p.cta) ? <Chip u={u} tone="solid">{str(p.cta)}</Chip> : <span />}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 24 * u, color: 'var(--art-muted)' }}>
                    {str(p.url, 'floatline.app')}
                  </span>
                </div>
              </div>
            </>
          ) : (
            /* body */
            <>
              <Headline u={u} size={56}>{title}</Headline>
              {bodyText ? <Lede u={u} size={27}>{bodyText}</Lede> : null}
              {str(p.body2) ? <Lede u={u} size={27}>{str(p.body2)}</Lede> : null}
              {arr(p.items).length ? (
                <>
                  <ReceiptRule u={u} opacity={0.7} />
                  <RowList u={u} items={arr(p.items)} numbered={p.numbered === true} size={26} />
                </>
              ) : null}
              {str(p.pullQuote) ? (
                <Panel u={u} tone="raised" pad={34}>
                  <Quote u={u} size={36}>&ldquo;{str(p.pullQuote)}&rdquo;</Quote>
                </Panel>
              ) : null}
              {arr(p.bars).length ? <BarList u={u} rows={arr(p.bars)} /> : null}
              {str(p.barLabel) ? <FloatBar u={u} pct={Number(p.pct ?? 68)} label={str(p.barLabel)} /> : null}
            </>
          )}
        </div>

        {footer ? <div style={{ flex: 'none' }}>{footer}</div> : null}
      </div>
    </Artboard>
  );
}
