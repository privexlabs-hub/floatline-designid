'use client';

/**
 * THE export pipeline. Every raster this app produces comes out of exportOne().
 *
 * There is exactly one of these on purpose. The moment a second export path
 * exists — a canvas route here, a carousel page there — the two drift, and the
 * same artboard starts producing a 3240px file from one screen and a 1080px
 * file from another. One primitive, one namer, no drift.
 */

import { MAX_PIXELS, megapixels, type Size } from './artboard-sizes';
import { SURFACE_BG, type Surface } from './tokens';

export const SCALES = [1, 2, 3] as const;
export type Scale = (typeof SCALES)[number];

export const FORMATS = ['png', 'jpeg', 'webp', 'svg', 'pdf'] as const;
export type Format = (typeof FORMATS)[number];

export const FORMAT_META: Record<Format, { label: string; ext: string; mime: string; note?: string }> = {
  png: { label: 'PNG', ext: 'png', mime: 'image/png' },
  jpeg: { label: 'JPEG', ext: 'jpg', mime: 'image/jpeg', note: 'No transparency — flattened onto the surface colour.' },
  webp: { label: 'WebP', ext: 'webp', mime: 'image/webp' },
  svg: { label: 'SVG', ext: 'svg', mime: 'image/svg+xml', note: 'An HTML snapshot inside a <foreignObject>, not vector type. Rendering varies between browsers.' },
  pdf: { label: 'PDF', ext: 'pdf', mime: 'application/pdf', note: 'A raster image inside a PDF page — the text is not selectable.' },
};

export const megapixelsOf = megapixels;
export { MAX_PIXELS };

export class ExportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExportError';
  }
}

export type ExportTarget = Size & {
  node: HTMLElement;
  /** Flatten colour for the formats that have no alpha. */
  surface?: Surface;
};

export type ExportOptions = {
  scale?: Scale;
  format?: Format;
  /** 0..1, JPEG and WebP only. */
  quality?: number;
  /** Reuse across a batch — see getSharedFontCSS. */
  fontEmbedCSS?: string;
  /** Called when the requested scale had to be reduced to fit the canvas limit. */
  onClamp?: (info: { requested: Scale; used: number }) => void;
};

/* ------------------------------------------------------------------ */
/* Canvas-area probe                                                   */
/* ------------------------------------------------------------------ */

const probeCache = new Map<string, boolean>();

/**
 * iOS Safari silently no-ops draws above roughly 16.7 MP and hands back a
 * BLANK image rather than throwing. A hardcoded constant would not catch that,
 * so we draw one pixel in the far corner and read it back.
 */
function canRasterise(w: number, h: number): boolean {
  const key = `${w}x${h}`;
  const cached = probeCache.get(key);
  if (cached !== undefined) return cached;

  let ok = false;
  const c = document.createElement('canvas');
  try {
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(w - 1, h - 1, 1, 1);
      ok = ctx.getImageData(w - 1, h - 1, 1, 1).data[3] !== 0;
    }
  } catch {
    ok = false;
  } finally {
    // Frees the backing store immediately. iOS holds onto it otherwise and the
    // next probe in a batch fails for the wrong reason.
    c.width = 1;
    c.height = 1;
  }

  probeCache.set(key, ok);
  return ok;
}

/** Step 3 -> 2 -> 1 until the browser will actually give us pixels. */
export function fitScale(w: number, h: number, desired: Scale = 1): { scale: number; clamped: boolean } {
  for (let s = desired; s >= 1; s--) {
    if (w * h * s * s <= MAX_PIXELS && canRasterise(w * s, h * s)) {
      return { scale: s, clamped: s !== desired };
    }
  }
  return { scale: 1, clamped: desired !== 1 };
}

/* ------------------------------------------------------------------ */
/* Settling                                                            */
/* ------------------------------------------------------------------ */

/**
 * Wait for fonts and one full paint. Without the double rAF the FIRST export of
 * a session renders in fallback type: html-to-image resolves its internal <img>
 * before a late-applied face has been used for layout.
 */
export async function settle(): Promise<void> {
  try {
    await document.fonts.ready;
  } catch {
    /* fonts.ready is unavailable in some embedded webviews; the rAFs still help */
  }
  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  );
}

/**
 * Blur any active contentEditable and drop the selection, so an uncommitted
 * keystroke or a blinking caret can never be baked into an export. Waits a
 * frame for an IME composition to flush.
 */
export async function commitActiveEdit(): Promise<void> {
  const active = document.activeElement;
  if (active instanceof HTMLElement && active.isContentEditable) active.blur();
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) sel.removeAllRanges();
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

/* ------------------------------------------------------------------ */
/* Font embedding                                                      */
/* ------------------------------------------------------------------ */

/**
 * Inline every @font-face as base64. This is the single most expensive step and
 * its result is identical for every artboard, so a batch computes it once and
 * threads it through. Requires SAME-ORIGIN fonts: a cross-origin sheet throws
 * SecurityError on .cssRules and the faces vanish silently.
 */
export async function getSharedFontCSS(node: HTMLElement): Promise<string> {
  const { getFontEmbedCSS } = await import('html-to-image');
  try {
    return await getFontEmbedCSS(node, { preferredFontFormat: 'woff2' });
  } catch (e) {
    console.warn('[export] font embedding failed; export will use fallback type', e);
    return '';
  }
}

/* ------------------------------------------------------------------ */
/* The primitive                                                       */
/* ------------------------------------------------------------------ */

export async function exportOne(target: ExportTarget, opts: ExportOptions = {}): Promise<Blob> {
  const { node, w, h, surface = 'paper' } = target;
  const { scale: desired = 1, format = 'png', quality = 0.94, fontEmbedCSS, onClamp } = opts;

  if (!node.isConnected) {
    throw new ExportError('The artboard is not in the document, so it cannot be measured.');
  }

  const fit = fitScale(w, h, desired);
  if (fit.clamped) onClamp?.({ requested: desired, used: fit.scale });

  if (megapixels(w * fit.scale, h * fit.scale) > MAX_PIXELS / 1_000_000) {
    throw new ExportError(
      `${w * fit.scale}×${h * fit.scale} is ${megapixels(w * fit.scale, h * fit.scale).toFixed(1)} MP, ` +
        `over the ${(MAX_PIXELS / 1_000_000).toFixed(1)} MP browser canvas limit. Export at 1x instead.`
    );
  }

  const htmlToImage = await import('html-to-image');
  const background = SURFACE_BG[surface];

  // pixelRatio is ALWAYS passed. Left to default it picks up devicePixelRatio,
  // and the same click produces a 1080px file on one machine and 2160px on a
  // retina one.
  const common = {
    width: w,
    height: h,
    pixelRatio: fit.scale,
    cacheBust: true,
    ...(fontEmbedCSS ? { fontEmbedCSS } : {}),
  } as const;

  node.setAttribute('data-capturing', 'true');
  try {
    let blob: Blob | null = null;

    if (format === 'png') {
      blob = await htmlToImage.toBlob(node, common);
    } else if (format === 'svg') {
      const dataUrl = await htmlToImage.toSvg(node, common);
      const svg = decodeURIComponent(dataUrl.slice(dataUrl.indexOf(',') + 1));
      blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    } else {
      // JPEG/WebP/PDF all need a flattened, opaque canvas. backgroundColor is
      // mandatory for JPEG: it has no alpha, so a transparent artboard would
      // otherwise rasterise onto black.
      const canvas = await htmlToImage.toCanvas(node, { ...common, backgroundColor: background });

      if (format === 'pdf') {
        const { jsPDF } = await import('jspdf');
        const pdf = new jsPDF({
          unit: 'px',
          format: [w, h],
          orientation: w >= h ? 'landscape' : 'portrait',
          compress: true,
        });
        pdf.addImage(canvas.toDataURL('image/jpeg', quality), 'JPEG', 0, 0, w, h, undefined, 'FAST');
        blob = pdf.output('blob');
      } else {
        const mime = FORMAT_META[format].mime;
        blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mime, quality));
      }
    }

    if (!blob || blob.size === 0) {
      throw new ExportError(
        'The browser returned no image data. This usually means the canvas was too large — try a lower scale.'
      );
    }
    return blob;
  } finally {
    node.removeAttribute('data-capturing');
  }
}

/* ------------------------------------------------------------------ */
/* Naming and saving                                                   */
/* ------------------------------------------------------------------ */

export function slugify(s: string, max = 48): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]+/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, max);
}

/** The single namer. The export dialog renders its manifest from this. */
export function filenameFor(args: {
  id: string;
  surface?: Surface;
  scale?: number;
  format: Format;
  slide?: number;
}): string {
  const { id, surface, scale = 1, format, slide } = args;
  const parts = ['floatline', slugify(id)];
  if (surface && surface !== 'paper') parts.push(surface);
  if (slide !== undefined) parts.push(`slide-${String(slide).padStart(2, '0')}`);
  const suffix = scale > 1 ? `@${scale}x` : '';
  return `${parts.join('-')}${suffix}.${FORMAT_META[format].ext}`;
}

export function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Safari cancels an in-flight download if the object URL is revoked
  // immediately, so this is deliberately delayed.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
