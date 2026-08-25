'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { LAYOUTS, byId, PRESETS } from '@/content/templates/registry';
import { defaultsOf } from '@/content/templates/types';
import { exportOne, getSharedFontCSS, settle, type Format, type Scale } from '@/lib/export-image';

/**
 * Verification harness. Not linked from anywhere in the app — it exists so the
 * scripts can drive the REAL export primitive and assert on the actual bytes.
 *
 * Two modes:
 *  - default: a fixed set of adversarial cases, parked off-screen.
 *  - ?all=1: renders one preset at a time at (0,0) so a CDP screenshot of the
 *    live DOM can be diffed against the export of the same node.
 */
const ADVERSARIAL = ['cv-podcast', 've-quote', 'sq-normal', 'ad-mpu'] as const;

export default function Spike() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [single, setSingle] = useState<string | null>(null);
  const [all, setAll] = useState(false);

  useEffect(() => {
    // Read after the first paint. The prerendered HTML has no query string, so
    // this cannot be resolved during render without a hydration mismatch.
    const id = requestAnimationFrame(() =>
      setAll(new URLSearchParams(window.location.search).get('all') === '1')
    );
    return () => cancelAnimationFrame(id);
  }, []);

  const exportFn = useCallback(async (id: string, format: Format, scale: Scale) => {
    const host = hostRef.current;
    if (!host) throw new Error('spike host missing');
    const node = host.querySelector<HTMLElement>(`[data-case="${id}"] .artboard-export`);
    if (!node) throw new Error(`no artboard for ${id}`);
    const preset = byId(id);
    if (!preset) throw new Error(`no preset ${id}`);
    await settle();
    const fontEmbedCSS = await getSharedFontCSS(node);
    const blob = await exportOne(
      { node, w: preset.w, h: preset.h, surface: preset.surface },
      { format, scale, fontEmbedCSS, quality: 0.94 }
    );
    const buf = new Uint8Array(await blob.arrayBuffer());
    let bin = '';
    for (let i = 0; i < buf.length; i += 8192) bin += String.fromCharCode(...buf.subarray(i, i + 8192));
    return { base64: btoa(bin), size: blob.size, type: blob.type };
  }, []);

  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    w.__spikeExport = exportFn;

    /** Mount one preset at the origin and resolve its true size. */
    w.__spikeShow = (id: string) =>
      new Promise((resolve) => {
        const preset = byId(id);
        if (!preset) { resolve(null); return; }
        setSingle(id);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => resolve({ w: preset.w, h: preset.h, surface: preset.surface }))
        );
      });

    /** The full catalog, so verify-layout can walk every template. */
    w.__spikeIds = PRESETS.map((p) => p.id);

    /**
     * Build the clone html-to-image would export, put it in the document at true
     * size, and report anything whose content overflows its own box.
     *
     * This is the only place the export's real layout can be inspected. The DOM
     * cannot show it: html-to-image PINS every cloned element to its measured
     * width and height, so a box that fits on one line here can hold two lines
     * there and spill over whatever sits below. That is precisely the bug this
     * exists to catch, and it is invisible to any check run against the page.
     */
    /**
     * Find text blocks whose width came from their CONTENT rather than from
     * their parent — the shrink-to-fit pattern.
     *
     * This is a check on the CAUSE, not the symptom, and that is deliberate.
     * html-to-image pins every cloned element to its measured size, so a
     * heading in a shrink-to-fit column is pinned to exactly its own text
     * width: zero tolerance. A hair of metric difference in the export then
     * wraps it to a second line inside a box only tall enough for one, and the
     * overflow lands on top of whatever sits below.
     *
     * The symptom cannot be caught downstream. Injecting the clone into this
     * document does not reproduce it (our stylesheets are present here and
     * absent inside the exported foreignObject), and a whole-image pixel diff
     * cannot separate it from ordinary antialiasing noise — measured, on the
     * 3000×3000 cover, at a mean delta of 6.1 broken against 5.2 healthy.
     *
     * So the rule is structural: a wrapping text block must fill its parent's
     * content box. Those elements are block-level and should always stretch; if
     * one does not, something above it is sized by its content.
     */
    w.__spikeFragile = (id: string) => {
      const host = hostRef.current;
      if (!host) return { missing: true };
      const art = host.querySelector<HTMLElement>(`[data-case="${id}"] .artboard-export`);
      if (!art) return { missing: true };

      /** Content width of an element's box, excluding its own padding. */
      const contentWidth = (el: HTMLElement) => {
        const cs = getComputedStyle(el);
        return el.clientWidth - parseFloat(cs.paddingLeft || '0') - parseFloat(cs.paddingRight || '0');
      };

      // Content taller than the page. Distinct from the shrink-to-fit check
      // below: this one is visible on screen too, and is how a footer ends up
      // sitting on top of the last line of a long page.
      const overflow: string[] = [];
      const inner = art.firstElementChild as HTMLElement | null;
      if (inner && inner.scrollHeight > inner.clientHeight + 2) {
        overflow.push(
          `content is ${inner.scrollHeight - inner.clientHeight}px taller than the artboard — it will be clipped or collide`
        );
      }

      const fragile: string[] = [];

      /**
       * Does this text sit one hair away from needing another line?
       *
       * The export re-lays every pinned box at very slightly different metrics.
       * A block whose last line is nearly full therefore gains a line there and
       * not here — and because the height was pinned for the old line count,
       * the extra line lands on top of whatever follows.
       *
       * Rather than guess which metric moved, this measures the risk directly:
       * squeeze the element by 1.5% and see whether the line count goes up. If
       * it does, the copy is one rounding error from breaking.
       */
      const reWrapsWhenSqueezed = (el: HTMLElement): boolean => {
        const cs = getComputedStyle(el);
        const lh = parseFloat(cs.lineHeight);
        if (!lh || el.clientWidth < 40) return false;
        const before = Math.round(el.getBoundingClientRect().height / lh);
        if (before < 1) return false;
        const original = el.style.width;
        el.style.width = `${el.clientWidth * 0.985}px`;
        const after = Math.round(el.getBoundingClientRect().height / lh);
        el.style.width = original;
        return after > before;
      };

      for (const el of Array.from(art.querySelectorAll<HTMLElement>('h1, h2, h3, p, blockquote'))) {
        const cs = getComputedStyle(el);
        if (cs.whiteSpace === 'nowrap' || cs.display.startsWith('inline') || cs.position === 'absolute') continue;

        // Walk the whole chain up to the artboard. The narrow box is often an
        // ancestor rather than the text element itself: a heading fills its own
        // wrapper exactly, and it is the WRAPPER that was sized by its content.
        let node: HTMLElement = el;
        while (node !== art && node.parentElement) {
          const parent = node.parentElement;
          const avail = contentWidth(parent);
          const ps = getComputedStyle(parent);

          // Only a SINGLE-COLUMN context is suspicious. A child of a two-column
          // grid or a flex row is narrower than its parent by design, and
          // flagging those would condemn every split layout in the catalog.
          const tracks = ps.display.includes('grid')
            ? ps.gridTemplateColumns.split(' ').filter(Boolean).length
            : 1;
          const isRow = ps.display.includes('flex') && !ps.flexDirection.startsWith('column');
          const subdivides = tracks > 1 || isRow;
          const stretches = !['inline', 'inline-block', 'inline-flex'].includes(ps.display);

          if (stretches && !subdivides && avail > 0 && node.clientWidth < avail - 2) {
            fragile.push(
              `${el.tagName.toLowerCase()} "${(el.textContent ?? '').trim().slice(0, 26)}" sits in a ${Math.round(node.clientWidth)}px box inside a ${Math.round(avail)}px column — shrink-to-fit, so the export has no room to re-wrap`
            );
            break;
          }
          node = parent;
        }

        if (fragile.length < 3 && reWrapsWhenSqueezed(el)) {
          fragile.push(
            `${el.tagName.toLowerCase()} "${(el.textContent ?? '').trim().slice(0, 30)}" gains a line when squeezed 1.5% — the export will re-wrap it into a box pinned for fewer lines`
          );
        }
        if (fragile.length >= 3) break;
      }
      return { fragile: [...overflow, ...fragile] };
    };

    w.__spikeReady = true;
  }, [exportFn]);

  const ids = all ? (single ? [single] : []) : [...ADVERSARIAL];

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      // In `all` mode the artboard must be at the true origin so a CDP clip of
      // (0,0,w,h) captures exactly it. Otherwise park it far off-canvas.
      style={all
        ? { position: 'absolute', left: 0, top: 0, margin: 0 }
        : { position: 'fixed', left: -30000, top: 0 }}
    >
      {ids.map((id) => {
        const preset = byId(id);
        if (!preset) return null;
        const Layout = LAYOUTS[preset.layout];
        return (
          <div key={id} data-case={id}>
            <Layout
              w={preset.w}
              h={preset.h}
              surface={preset.surface}
              grain={!all && id === 'sq-normal'}
              {...preset.props}
              {...defaultsOf(preset)}
            />
          </div>
        );
      })}
    </div>
  );
}
