'use client';

import type { Preset } from '@/content/templates/types';
import type { Doc } from '@/lib/use-editor-state';
import { docFor, type Docs } from '@/lib/use-editor-state';
import {
  exportOne, filenameFor, getSharedFontCSS, saveBlob, settle,
  type Format, type Scale,
} from '@/lib/export-image';
import { str } from '@/components/artboard/layouts/types';

export type BatchProgress = { done: number; total: number; label: string };

export type BatchOptions = {
  presets: Preset[];
  docs: Docs;
  scale: Scale;
  formats: Format[];
  quality: number;
  /** Renders one preset at true size into an off-screen host. */
  renderOffscreen: (preset: Preset, doc: Doc) => Promise<HTMLElement>;
  onProgress?: (p: BatchProgress) => void;
  signal?: AbortSignal;
};

/**
 * Alt text for every asset in the kit.
 *
 * Platforms drop alt text when you upload a PNG, so whoever posts the image has
 * to retype it from memory — and usually does not. A sidecar CSV means the
 * words travel with the picture.
 */
function altTextFor(preset: Preset, doc: Doc): string {
  const parts = preset.fields
    .map((f) => doc.fields[f.k] ?? f.def)
    .flatMap((v) => (Array.isArray(v) ? v.map(String) : [str(v)]))
    .map((s) => s.split('|')[0]!.trim())
    .filter((s) => s.length > 1 && !/^https?:/.test(s) && !/^[\w.-]+\.(app|io|com)$/.test(s));
  return `${preset.name}. ${parts.join('. ')}`.replace(/\s+/g, ' ').slice(0, 900);
}

const csvCell = (s: string) => `"${s.replace(/"/g, '""')}"`;
const folderOf = (group: string) => group.replace(/[^\w]+/g, '-').replace(/^-|-$/g, '');

export async function exportBatch(opts: BatchOptions): Promise<Blob> {
  const { presets, docs, scale, formats, quality, renderOffscreen, onProgress, signal } = opts;

  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();

  const total = presets.length * formats.length;
  let done = 0;
  let fontEmbedCSS: string | undefined;
  const rows: string[] = ['file,group,preset,width,height,alt_text'];

  for (const preset of presets) {
    if (signal?.aborted) throw new DOMException('Export cancelled', 'AbortError');

    const doc = docFor(preset, docs);
    const node = await renderOffscreen(preset, doc);
    await settle();

    // Computed once for the whole batch: getFontEmbedCSS fetches and base64s
    // every face, and the result is identical for every artboard.
    fontEmbedCSS ??= await getSharedFontCSS(node);

    for (const format of formats) {
      if (signal?.aborted) throw new DOMException('Export cancelled', 'AbortError');
      onProgress?.({ done, total, label: `${preset.name} · ${format.toUpperCase()}` });

      const name = filenameFor({ id: preset.id, surface: doc.surface, scale, format });
      try {
        const blob = await exportOne(
          { node, w: preset.w, h: preset.h, surface: doc.surface },
          { scale, format, quality, fontEmbedCSS }
        );
        zip.file(`${folderOf(preset.group)}/${name}`, blob);
      } catch (e) {
        // One bad artboard must not lose the other 167. Record it and move on.
        zip.file(`_errors/${name}.txt`, `${(e as Error).message}\n`);
      }
      done++;
    }

    rows.push(
      [
        csvCell(filenameFor({ id: preset.id, surface: doc.surface, scale, format: formats[0]! })),
        csvCell(preset.group),
        csvCell(preset.name),
        String(preset.w * scale),
        String(preset.h * scale),
        csvCell(altTextFor(preset, doc)),
      ].join(',')
    );
  }

  zip.file('alt-text.csv', rows.join('\n') + '\n');
  onProgress?.({ done: total, total, label: 'Packaging…' });

  // STORE, not DEFLATE: PNG, JPEG, WebP and PDF are already compressed, so
  // deflating them only costs time.
  return zip.generateAsync({ type: 'blob', compression: 'STORE' });
}

export function saveZip(blob: Blob, label: string): void {
  saveBlob(blob, `floatline-${label}.zip`);
}
