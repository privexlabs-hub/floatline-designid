'use client';

import { createElement } from 'react';
import type { Root } from 'react-dom/client';
import type { Preset } from '@/content/templates/types';
import type { Doc } from '@/lib/use-editor-state';
import { LAYOUTS } from '@/content/templates/registry';

/**
 * Off-screen render host for bulk export.
 *
 * PARKED far off-canvas rather than hidden: html-to-image cannot measure a
 * `display: none` subtree, and a zero-size or clipped host produces an empty
 * PNG. `inert` and `aria-hidden` keep it out of the tab order and the
 * accessibility tree while it stays fully laid out.
 *
 * Templates render ONE AT A TIME through a separate React root, so bulk export
 * never touches the preview's transform, and a 1080×1920 capture is never in
 * flight alongside another — running them concurrently exhausts memory on
 * mobile Safari.
 */

let host: HTMLDivElement | null = null;
let root: Root | null = null;

async function ensureHost(): Promise<{ host: HTMLDivElement; root: Root }> {
  if (host && root) return { host, root };
  const { createRoot } = await import('react-dom/client');
  host = document.createElement('div');
  host.setAttribute('aria-hidden', 'true');
  host.setAttribute('inert', '');
  Object.assign(host.style, {
    position: 'fixed',
    left: '-20000px',
    top: '0',
    width: '0',
    height: '0',
    overflow: 'visible',
    pointerEvents: 'none',
  } satisfies Partial<CSSStyleDeclaration>);
  document.body.appendChild(host);
  root = createRoot(host);
  return { host, root };
}

export async function renderOffscreen(preset: Preset, doc: Doc): Promise<HTMLElement> {
  const { host: h, root: r } = await ensureHost();
  const Layout = LAYOUTS[preset.layout];

  await new Promise<void>((resolve) => {
    r.render(
      createElement(Layout, {
        key: preset.id,
        w: preset.w,
        h: preset.h,
        surface: doc.surface,
        grain: doc.grain,
        vertical: doc.vertical,
        currency: doc.currency,
        ...preset.props,
        ...doc.fields,
      })
    );
    // Two frames: one for React to commit, one for layout to settle.
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

  const node = h.querySelector<HTMLElement>('.artboard-export');
  if (!node) throw new Error(`off-screen render produced no artboard for ${preset.id}`);
  return node;
}

export function disposeOffscreen(): void {
  root?.unmount();
  host?.remove();
  root = null;
  host = null;
}
