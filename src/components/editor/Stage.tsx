'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Preset } from '@/content/templates/types';
import type { Doc } from '@/lib/use-editor-state';
import { LAYOUTS } from '@/content/templates/registry';
import { CANVAS, SAFE_AREAS } from '@/lib/artboard-sizes';

/**
 * Renders the artboard at TRUE pixel size and scales it with a CSS transform.
 *
 * Never by resizing the node: an 1080px artboard laid out at 380px reflows, and
 * what you would be previewing is not what gets exported. Transform keeps the
 * layout identical and only changes what the screen shows.
 *
 * Safe-area guides are SIBLINGS of the export node, never children — a child
 * would be baked into every PNG.
 */

function safeAreaFor(preset: Preset) {
  // Matched on dimensions rather than a name stored on the preset, so a new
  // preset that reuses a known canvas inherits its guides automatically.
  for (const [name, area] of Object.entries(SAFE_AREAS)) {
    const canvas = (CANVAS as Record<string, { w: number; h: number }>)[name];
    if (canvas && canvas.w === preset.w && canvas.h === preset.h) return area;
  }
  return undefined;
}

export function Stage({
  preset,
  doc,
  guides,
  nodeRef,
}: {
  preset: Preset;
  doc: Doc;
  guides: boolean;
  nodeRef: React.RefObject<HTMLDivElement | null>;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [clipped, setClipped] = useState(false);

  const fit = useCallback(() => {
    const host = hostRef.current;
    if (!host) return;
    const avail = host.clientWidth;
    const availH = host.clientHeight || window.innerHeight * 0.7;
    if (!avail) return;
    setScale(Math.min(1, avail / preset.w, availH / preset.h));
  }, [preset.w, preset.h]);

  useEffect(() => {
    fit();
    const host = hostRef.current;
    if (!host) return;
    const ro = new ResizeObserver(fit);
    ro.observe(host);
    return () => ro.disconnect();
  }, [fit]);

  // A headline that overflows its artboard is invisible in the preview (the
  // artboard clips) but wrong in the export. Watch for it and say so.
  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const check = () => {
      const over = Array.from(node.querySelectorAll<HTMLElement>('*')).some(
        (el) => el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1
      );
      setClipped(over || node.scrollHeight > node.clientHeight + 1);
    };
    check();
    const mo = new MutationObserver(check);
    mo.observe(node, { subtree: true, childList: true, characterData: true, attributes: true });
    const ro = new ResizeObserver(check);
    ro.observe(node);
    return () => { mo.disconnect(); ro.disconnect(); };
  }, [nodeRef, preset.id, doc]);

  const Layout = LAYOUTS[preset.layout];
  const area = guides ? safeAreaFor(preset) : undefined;

  return (
    <div ref={hostRef} style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', minHeight: 0 }}>
      <div>
        <div
          className="stage-wrap"
          style={{ width: preset.w * scale, height: preset.h * scale }}
        >
          <div className="stage-scale" style={{ transform: `scale(${scale})`, width: preset.w, height: preset.h }}>
            <div ref={nodeRef}>
              <Layout
                key={preset.id}
                w={preset.w}
                h={preset.h}
                surface={doc.surface}
                grain={doc.grain}
                vertical={doc.vertical}
                currency={doc.currency}
                {...preset.props}
                {...doc.fields}
              />
            </div>
          </div>

          {area ? (
            <div
              className="stage-guide"
              style={{
                top: area.top * scale,
                right: area.right * scale,
                bottom: area.bottom * scale,
                left: area.left * scale,
              }}
            >
              <span className="stage-guide-label">Safe area · {area.note}</span>
            </div>
          ) : null}
        </div>

        <div className="row" style={{ marginTop: 'var(--sp-3)', justifyContent: 'space-between' }}>
          <span className="note" style={{ fontFamily: 'var(--font-mono)' }}>
            {preset.w} × {preset.h} · {Math.round(scale * 100)}%
          </span>
          <span className="note">{preset.group}</span>
        </div>

        {clipped ? (
          <div className="stage-clip" role="status">
            Content is overflowing this artboard — it will be cut off in the export. Shorten the copy.
          </div>
        ) : null}
      </div>
    </div>
  );
}
