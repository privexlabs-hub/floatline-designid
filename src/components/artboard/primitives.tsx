/**
 * Artboard primitives.
 *
 * TWO RULES, both load-bearing:
 *
 * 1. NOTHING HERE READS A RAW BRAND TOKEN. Only --art-*. That is what lets one
 *    layout render correctly on all seven surfaces instead of seven layouts.
 *
 * 2. EVERY SIZE IS PROPORTIONAL, expressed through unit(w). A headline set in
 *    absolute pixels looks right on the 1080 square and wrong on the 300×250
 *    MPU and the 3000×3000 podcast cover. Proportional sizing is what makes one
 *    component span a 100× area range.
 */
import type { CSSProperties, ReactNode } from 'react';
import { MARK } from '@/lib/brand-geometry';
import { useArt } from './art-context';
import { symbolOf, type CurrencyId } from '@/content/brand';

/** 1 unit = 1px on the 1080 square, scaled for every other canvas. */
export const unit = (w: number) => w / 1080;

type U = { u: number };

/* ------------------------------------------------------------------ */
/* Logo                                                                */
/* ------------------------------------------------------------------ */

/**
 * The mark, drawn inline from brand-geometry rather than loaded as a file.
 * An <img> would need html-to-image to fetch and inline it on every capture;
 * inline SVG is already in the DOM and always exports.
 */
/**
 * The mark, drawn inline from brand-geometry rather than loaded as a file.
 * An <img> would need html-to-image to fetch and inline it on every capture;
 * inline SVG is already in the DOM and always exports.
 *
 * NOTE: colours go through `style`, never the `fill` ATTRIBUTE. `var()` does
 * not resolve in an SVG presentation attribute — the browser silently falls
 * back to black, which is exactly what happened the first time this shipped:
 * every mark rasterised as a solid dark square.
 */
export function Mark({ size, tone = 'auto' }: { size: number; tone?: 'auto' | 'accent' }) {
  // Literals, never var(). See useArt / SURFACE_ART for why.
  const art = useArt();
  const ground = tone === 'accent' ? art.accent : art.fg;
  const face = art.bg;
  const signal = art.signal;

  const B = MARK.box;
  const span = MARK.nodes.count - 1;
  const nodes = Array.from({ length: MARK.nodes.count }, (_, i) => {
    const t = span > 0 ? i / span : 0;
    return (MARK.nodes.from + t * (MARK.nodes.to - MARK.nodes.from)) * B;
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${B} ${B}`}
      aria-label="Floatline"
      role="img"
      style={{ flex: 'none', display: 'block', overflow: 'visible' }}
    >
      <rect width={B} height={B} rx={MARK.corner * B} style={{ fill: ground }} />
      {/* Upper rail — the "line" half of the name. */}
      <rect
        x={MARK.rail.x * B} y={MARK.rail.y * B}
        width={MARK.rail.w * B} height={MARK.rail.h * B}
        rx={MARK.bar.radius * B}
        style={{ fill: face }}
      />
      {/* Float bar: a full track with a filled portion. */}
      <rect
        x={MARK.bar.x * B} y={MARK.bar.y * B}
        width={MARK.bar.w * B} height={MARK.bar.h * B}
        rx={MARK.bar.radius * B}
        style={{ fill: face, opacity: 0.34 }}
      />
      <rect
        x={MARK.bar.x * B} y={MARK.bar.y * B}
        width={MARK.bar.w * B * MARK.bar.fill} height={MARK.bar.h * B}
        rx={MARK.bar.radius * B}
        style={{ fill: signal }}
      />
      {/* Five nodes: the network the automation runs over. */}
      {nodes.map((cx, i) => (
        <circle
          key={i}
          cx={cx}
          cy={MARK.nodes.y * B}
          r={MARK.nodes.r * B}
          style={{ fill: i === MARK.nodes.accentIndex ? signal : face }}
        />
      ))}
    </svg>
  );
}

export function Wordmark({ u, size = 34, showMark = true }: U & { size?: number; showMark?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 * u }}>
      {showMark && <Mark size={size * u * 1.12} />}
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: size * u,
          letterSpacing: '-0.03em',
          color: 'var(--art-fg)',
          lineHeight: 1,
        }}
      >
        floatline
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Text                                                                */
/* ------------------------------------------------------------------ */

export function Eyebrow({ u, children, tone = 'muted' }: U & { children: ReactNode; tone?: 'muted' | 'signal' }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 20 * u,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        fontWeight: 500,
        color: tone === 'signal' ? 'var(--art-signal-text)' : 'var(--art-muted)',
      }}
    >
      {children}
    </div>
  );
}

export function Headline({ u, children, size = 78, weight = 700 }: U & { children: ReactNode; size?: number; weight?: number }) {
  return (
    <h1
      style={{
        fontFamily: 'var(--font-display)',
        fontWeight: weight,
        fontSize: size * u,
        lineHeight: 1.04,
        letterSpacing: '-0.024em',
        color: 'var(--art-fg)',
        margin: 0,
      }}
    >
      {children}
    </h1>
  );
}

export function Lede({ u, children, size = 30 }: U & { children: ReactNode; size?: number }) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-sans)',
        fontSize: size * u,
        lineHeight: 1.42,
        color: 'var(--art-fg-2)',
        margin: 0,
      }}
    >
      {children}
    </p>
  );
}

export function Quote({ u, children, size = 54 }: U & { children: ReactNode; size?: number }) {
  return (
    <blockquote
      style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: size * u,
        lineHeight: 1.16,
        letterSpacing: '-0.018em',
        color: 'var(--art-fg)',
        margin: 0,
      }}
    >
      {children}
    </blockquote>
  );
}

export function Stat({ u, value, label, size = 176 }: U & { value: ReactNode; label?: ReactNode; size?: number }) {
  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: size * u,
          lineHeight: 0.92,
          letterSpacing: '-0.04em',
          color: 'var(--art-signal-text)',
          fontFeatureSettings: '"tnum"',
        }}
      >
        {value}
      </div>
      {label ? (
        <div style={{ marginTop: 16 * u, fontSize: 26 * u, lineHeight: 1.35, color: 'var(--art-muted)' }}>{label}</div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Floatline motifs — the brand DNA, kept through the reposition       */
/* ------------------------------------------------------------------ */

/** The dashed divider. The brand's rhythm; used to separate every section. */
export function ReceiptRule({ u, opacity = 1 }: U & { opacity?: number }) {
  return <hr style={{ border: 0, borderTop: `${Math.max(1, 2 * u)}px dashed var(--art-rule)`, width: '100%', margin: 0, opacity }} />;
}

/**
 * The float bar, generalised to a capacity bar. A track with a filled portion —
 * the same shape that sits inside the logo.
 */
export function FloatBar({ u, pct, height = 22, label }: U & { pct: number; height?: number; label?: ReactNode }) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          width: '100%',
          height: height * u,
          borderRadius: 999,
          background: 'color-mix(in srgb, var(--art-fg) 16%, transparent)',
          overflow: 'hidden',
        }}
      >
        <div style={{ width: `${clamped}%`, height: '100%', borderRadius: 999, background: 'var(--art-signal)' }} />
      </div>
      {label ? (
        <div style={{ marginTop: 10 * u, fontSize: 20 * u, color: 'var(--art-muted)', fontFamily: 'var(--font-mono)' }}>{label}</div>
      ) : null}
    </div>
  );
}

export type Status = 'on-track' | 'at-risk' | 'failed';

const STATUS_COLOR: Record<Status, string> = {
  'on-track': '#29B26A',
  'at-risk': '#E89B2C',
  failed: '#C8362A',
};

/** Coloured dot + uppercase micro label. Never an emoji outside a chat surface. */
export function StatusDot({ u, status, label }: U & { status: Status; label?: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 * u }}>
      <span style={{ width: 14 * u, height: 14 * u, borderRadius: 999, background: STATUS_COLOR[status], flex: 'none' }} />
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 18 * u,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--art-muted)',
          fontWeight: 500,
        }}
      >
        {label ?? status.replace('-', ' ')}
      </span>
    </span>
  );
}

/** `29 / 32 read` — always with the slash and a space on each side. */
export function ReadFraction({ u, read, total, noun = 'read', size = 30 }: U & { read: number; total: number; noun?: string; size?: number }) {
  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: size * u, color: 'var(--art-fg-2)', fontFeatureSettings: '"tnum"' }}>
      {read} / {total} {noun}
    </span>
  );
}

/** Money. Symbol first, tabular figures, mono face. Never "NGN 25,000". */
export function Money({ u, amount, currency = 'NGN', size = 30 }: U & { amount: string | number; currency?: CurrencyId; size?: number }) {
  const n = typeof amount === 'number' ? amount.toLocaleString('en-US') : amount;
  return (
    <span style={{ fontFamily: 'var(--font-money)', fontFeatureSettings: '"tnum"', fontSize: size * u, color: 'var(--art-fg)' }}>
      {symbolOf(currency)}
      {n}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Containers                                                          */
/* ------------------------------------------------------------------ */

export function Chip({ u, children, tone = 'outline' }: U & { children: ReactNode; tone?: 'outline' | 'solid' | 'signal' }) {
  const base: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    // A chip is content-width. Without these it stretches to fill whenever it
    // lands in a grid or a stretch-aligned flex column, which is most layouts.
    width: 'fit-content',
    justifySelf: 'start',
    alignSelf: 'start',
    gap: 8 * u,
    padding: `${9 * u}px ${20 * u}px`,
    borderRadius: 999,
    fontSize: 21 * u,
    fontWeight: 600,
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
  };
  const tones: Record<string, CSSProperties> = {
    outline: { border: `${Math.max(1, 1.6 * u)}px solid var(--art-rule)`, color: 'var(--art-fg-2)' },
    solid: { background: 'var(--art-accent)', color: 'var(--art-accent-fg)' },
    signal: { background: 'var(--art-signal)', color: 'var(--art-bg)' },
  };
  return <span style={{ ...base, ...tones[tone] }}>{children}</span>;
}

export function RowList({ u, items, numbered = false, size = 28 }: U & { items: string[]; numbered?: boolean; size?: number }) {
  return (
    <div style={{ display: 'grid', gap: 18 * u, width: '100%' }}>
      {items.filter(Boolean).map((it, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: `${34 * u}px 1fr`, gap: 16 * u, alignItems: 'start' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: size * 0.78 * u,
              color: 'var(--art-signal-text)',
              lineHeight: 1.5,
              fontWeight: 500,
            }}
          >
            {numbered ? String(i + 1).padStart(2, '0') : '—'}
          </span>
          <span style={{ fontSize: size * u, lineHeight: 1.38, color: 'var(--art-fg-2)' }}>{it}</span>
        </div>
      ))}
    </div>
  );
}

export function Split({ u, left, right, ratio = '1fr 1fr' }: U & { left: ReactNode; right: ReactNode; ratio?: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: ratio, gap: 40 * u, alignItems: 'start', width: '100%' }}>
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}

export function Panel({ u, children, tone = 'raised', pad = 40 }: U & { children: ReactNode; tone?: 'raised' | 'outline'; pad?: number }) {
  const styles: Record<string, CSSProperties> =
    tone === 'raised'
      ? { s: { background: 'color-mix(in srgb, var(--art-fg) 6%, transparent)' } }
      : { s: { border: `${Math.max(1, 1.6 * u)}px solid var(--art-rule)` } };
  return (
    <div style={{ borderRadius: 20 * u, padding: pad * u, width: '100%', ...styles.s }}>
      {children}
    </div>
  );
}

export function CtaFooter({ u, cta, url: href, tone = 'solid' }: U & { cta?: string; url?: string; tone?: 'solid' | 'quiet' }) {
  if (!cta && !href) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 * u, width: '100%' }}>
      {cta ? (
        tone === 'solid' ? (
          <Chip u={u} tone="solid">{cta}</Chip>
        ) : (
          <Chip u={u} tone="outline">{cta}</Chip>
        )
      ) : <span />}
      {href ? (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22 * u, color: 'var(--art-muted)' }}>{href}</span>
      ) : null}
    </div>
  );
}

/** The standard artboard frame: consistent margin, header and footer slots. */
export function Frame({
  u,
  pad,
  children,
  header,
  footer,
}: U & { pad: number; children: ReactNode; header?: ReactNode; footer?: ReactNode }) {
  return (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        height: '100%',
        padding: pad * u,
        display: 'flex',
        flexDirection: 'column',
        gap: 32 * u,
      }}
    >
      {header ? <div style={{ flex: 'none' }}>{header}</div> : null}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28 * u }}>
        {children}
      </div>
      {footer ? <div style={{ flex: 'none' }}>{footer}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Long-form furniture                                                 */
/* ------------------------------------------------------------------ */

/**
 * A customer's own logo, or a product screenshot.
 *
 * Deliberately narrow. Non-negotiable #7 is "no stock photography and no
 * generated faces" — this exists for the two cases where a real asset is the
 * honest thing to show, and the empty state says so rather than collapsing to
 * nothing and leaving a hole in the layout.
 */
export function CustomerLogo({
  u,
  src,
  height = 64,
  label = 'Customer logo',
}: U & { src?: string; height?: number; label?: string }) {
  if (src && src.startsWith('data:')) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        style={{ height: height * u, width: 'auto', maxWidth: '100%', objectFit: 'contain', display: 'block' }}
      />
    );
  }
  return (
    <div
      style={{
        height: height * u,
        minWidth: height * u * 2.6,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `0 ${16 * u}px`,
        border: `${Math.max(1, 1.6 * u)}px dashed var(--art-rule)`,
        borderRadius: 8 * u,
        fontFamily: 'var(--font-mono)',
        fontSize: 16 * u,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--art-muted)',
      }}
    >
      {label}
    </div>
  );
}

/**
 * Labelled horizontal bars. The brand already has a data motif — the float bar
 * — so a report's charts are that shape repeated, not a charting library.
 * Each row is `Label | value | percent`.
 */
export function BarList({ u, rows, size = 24 }: U & { rows: string[]; size?: number }) {
  const parsed = rows
    .filter(Boolean)
    .map((r) => {
      const [label, value, pct] = r.split('|').map((x) => x?.trim() ?? '');
      return { label, value, pct: Math.max(0, Math.min(100, parseFloat(pct || value || '0') || 0)) };
    });

  return (
    <div style={{ display: 'grid', gap: 18 * u, width: '100%' }}>
      {parsed.map((row, i) => (
        <div key={i} style={{ display: 'grid', gap: 8 * u }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 * u, fontSize: size * u }}>
            <span style={{ color: 'var(--art-fg-2)' }}>{row.label}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontFeatureSettings: '"tnum"', color: 'var(--art-fg)', fontWeight: 600 }}>
              {row.value}
            </span>
          </div>
          <FloatBar u={u} pct={row.pct} height={14} />
        </div>
      ))}
    </div>
  );
}

/** A receipt-ruled table. Rows are `cell | cell | cell`; the first row is the head. */
export function DataTable({ u, rows, size = 22 }: U & { rows: string[]; size?: number }) {
  const parsed = rows.filter(Boolean).map((r) => r.split('|').map((c) => c.trim()));
  const [head, ...body] = parsed;
  if (!head) return null;

  return (
    <div style={{ width: '100%', display: 'grid', gap: 0 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `1.6fr repeat(${Math.max(1, head.length - 1)}, 1fr)`,
          gap: 16 * u,
          paddingBottom: 10 * u,
        }}
      >
        {head.map((c, i) => (
          <span
            key={i}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: size * 0.78 * u,
              letterSpacing: '0.09em',
              textTransform: 'uppercase',
              color: 'var(--art-muted)',
              textAlign: i === 0 ? 'left' : 'right',
            }}
          >
            {c}
          </span>
        ))}
      </div>
      <ReceiptRule u={u} />
      {body.map((row, r) => (
        <div key={r}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `1.6fr repeat(${Math.max(1, head.length - 1)}, 1fr)`,
              gap: 16 * u,
              padding: `${12 * u}px 0`,
            }}
          >
            {row.map((c, i) => (
              <span
                key={i}
                style={{
                  fontSize: size * u,
                  color: i === 0 ? 'var(--art-fg)' : 'var(--art-fg-2)',
                  fontWeight: i === 0 ? 600 : 400,
                  textAlign: i === 0 ? 'left' : 'right',
                  fontFamily: i === 0 ? 'var(--font-sans)' : 'var(--font-mono)',
                  fontFeatureSettings: i === 0 ? undefined : '"tnum"',
                }}
              >
                {c}
              </span>
            ))}
          </div>
          {r < body.length - 1 ? (
            <hr style={{ border: 0, borderTop: `${Math.max(1, u)}px solid var(--art-rule)`, margin: 0, opacity: 0.6 }} />
          ) : null}
        </div>
      ))}
    </div>
  );
}

/** Running header and page number, in the receipt-rule idiom used everywhere else. */
export function PageFooter({
  u,
  header,
  page,
  total,
  show = true,
}: U & { header?: string; page?: number; total?: number; show?: boolean }) {
  if (!show) return null;
  return (
    <div style={{ width: '100%', display: 'grid', gap: 14 * u }}>
      <ReceiptRule u={u} />
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20 * u, alignItems: 'baseline' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18 * u, color: 'var(--art-muted)', letterSpacing: '0.06em' }}>
          {header}
        </span>
        {page !== undefined ? (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18 * u, color: 'var(--art-muted)', fontFeatureSettings: '"tnum"' }}>
            {total !== undefined ? `${page} / ${total}` : page}
          </span>
        ) : null}
      </div>
    </div>
  );
}
