'use client';

import { useMemo, useRef, useState } from 'react';
import type { Sequence } from '@/lib/sequences';
import { byId } from '@/content/templates/registry';
import {
  FORMATS, FORMAT_META, SCALES, MAX_PIXELS, megapixelsOf,
  commitActiveEdit, exportOne, exportPages, filenameFor, getSharedFontCSS,
  saveBlob, settle, slugify, type ExportTarget, type Format, type Scale,
} from '@/lib/export-image';

/**
 * Export for a sequence: every page as numbered files, or all of them as one
 * ordered PDF.
 *
 * The filenames use `filenameFor`'s `slide` parameter, which has existed since
 * the namer was written and had no caller until sequences arrived — so a deck
 * page and a single artboard are named by the same function, and cannot drift.
 */
export function SequenceExport({
  sequence,
  nodeFor,
}: {
  sequence: Sequence;
  /** Resolves a page index to its true-size offscreen node. */
  nodeFor: (index: number) => HTMLElement | null;
}) {
  const [scale, setScale] = useState<Scale>(1);
  const [formats, setFormats] = useState<Format[]>(['png']);
  const [asPdf, setAsPdf] = useState(true);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number; label: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const cancelled = useRef(false);

  const base = slugify(sequence.name) || 'sequence';

  const targets = useMemo(
    () =>
      sequence.pages.map((page, i) => {
        const preset = byId(page.presetId);
        return { page, preset, index: i };
      }),
    [sequence.pages]
  );

  const biggest = targets.reduce((mx, t) => Math.max(mx, (t.preset?.w ?? 0) * (t.preset?.h ?? 0)), 0);
  const overLimit = biggest * scale * scale > MAX_PIXELS;

  const manifest = useMemo(() => {
    const names: string[] = [];
    for (const t of targets) {
      for (const f of formats) {
        names.push(filenameFor({ id: base, scale, format: f, slide: t.index + 1 }));
      }
    }
    if (asPdf) names.push(`floatline-${base}.pdf`);
    return names;
  }, [targets, formats, asPdf, base, scale]);

  function collect(): ExportTarget[] {
    return targets.map((t) => {
      const node = nodeFor(t.index);
      if (!node || !t.preset) throw new Error(`Page ${t.index + 1} is not rendered yet — give it a moment.`);
      return { node, w: t.preset.w, h: t.preset.h, surface: t.page.doc.surface };
    });
  }

  async function run() {
    if (formats.length === 0 && !asPdf) {
      setError('Pick a format, a PDF, or both.');
      return;
    }
    setError(null);
    setNotice(null);
    setBusy(true);
    cancelled.current = false;

    try {
      await commitActiveEdit();
      await settle();
      const all = collect();
      const fontEmbedCSS = await getSharedFontCSS(all[0]!.node);

      const files: { name: string; blob: Blob }[] = [];
      const total = all.length * formats.length + (asPdf ? all.length : 0);
      let done = 0;

      for (const [i, target] of all.entries()) {
        for (const format of formats) {
          if (cancelled.current) throw new DOMException('cancelled', 'AbortError');
          const name = filenameFor({ id: base, scale, format, slide: i + 1 });
          setProgress({ done, total, label: name });
          files.push({
            name,
            blob: await exportOne(target, {
              scale, format, fontEmbedCSS,
              onClamp: ({ requested, used }) =>
                setNotice(`${requested}× was larger than this browser will rasterise. Exported at ${used}× instead.`),
            }),
          });
          done++;
        }
      }

      if (asPdf) {
        if (cancelled.current) throw new DOMException('cancelled', 'AbortError');
        setProgress({ done, total, label: `floatline-${base}.pdf` });
        const pdf = await exportPages(all, {
          scale, fontEmbedCSS,
          onProgress: (n) => setProgress({ done: done + n, total, label: `PDF · page ${n + 1} of ${all.length}` }),
        });
        files.push({ name: `floatline-${base}.pdf`, blob: pdf });
      }

      // One file downloads directly; more than one is worth an archive.
      if (files.length === 1) {
        saveBlob(files[0]!.blob, files[0]!.name);
      } else {
        setProgress({ done: total, total, label: 'Packaging…' });
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();
        for (const f of files) zip.file(f.name, f.blob);
        zip.file('alt-text.csv', altCsv(sequence, base, scale, formats[0] ?? 'png'));
        saveBlob(
          await zip.generateAsync({ type: 'blob', compression: 'STORE' }),
          `floatline-${base}-${scale}x.zip`
        );
      }
    } catch (e) {
      if ((e as Error).name === 'AbortError') setNotice('Export cancelled. Nothing was downloaded.');
      else setError((e as Error).message);
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  return (
    <section aria-label="Export sequence">
      <h2 className="fl-h4" style={{ marginBottom: 'var(--sp-3)' }}>Export</h2>

      <div className="field">
        <label>Scale</label>
        <div className="swatches">
          {SCALES.map((s) => (
            <button key={s} type="button" className="swatch" aria-pressed={scale === s} onClick={() => setScale(s)}>{s}×</button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>Each page as</label>
        <div className="swatches">
          {FORMATS.filter((f) => f !== 'pdf').map((f) => (
            <button
              key={f} type="button" className="swatch"
              aria-pressed={formats.includes(f)}
              onClick={() => setFormats((cur) => (cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f]))}
            >
              {FORMAT_META[f].label}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <div className="field-row">
          <input id="asPdf" type="checkbox" checked={asPdf} onChange={(e) => setAsPdf(e.target.checked)} />
          <label htmlFor="asPdf" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 'var(--fs-body)', fontWeight: 600 }}>
            One ordered PDF ({sequence.pages.length} pages)
          </label>
        </div>
        <span className="note">{FORMAT_META.pdf.note}</span>
      </div>

      {overLimit ? (
        <p className="warn">
          The largest page is {megapixelsOf(Math.sqrt(biggest) * scale, Math.sqrt(biggest) * scale).toFixed(1)} MP at {scale}×,
          over the browser canvas limit. Export at a lower scale.
        </p>
      ) : null}

      <div className="field">
        <label>Files ({manifest.length})</label>
        <div className="manifest">
          {manifest.slice(0, 40).map((n) => <div key={n}>{n}</div>)}
          {manifest.length > 40 ? <div>… and {manifest.length - 40} more</div> : null}
        </div>
      </div>

      {progress ? (
        <div className="field">
          <div className="progress"><i style={{ width: `${(progress.done / Math.max(1, progress.total)) * 100}%` }} /></div>
          <span className="field-count">{progress.done} / {progress.total} · {progress.label}</span>
        </div>
      ) : null}

      <div className="row">
        <button type="button" className="btn" data-tone="primary" disabled={busy || overLimit} onClick={run}>
          {busy ? 'Exporting…' : manifest.length === 1 ? 'Download' : `Download ${manifest.length} files`}
        </button>
        {busy ? (
          <button type="button" className="btn" onClick={() => { cancelled.current = true; }}>Cancel</button>
        ) : null}
      </div>

      {notice ? <p className="warn" style={{ marginTop: 'var(--sp-3)' }} role="status">{notice}</p> : null}
      {error ? <p className="err" style={{ marginTop: 'var(--sp-3)' }} role="alert">{error}</p> : null}
    </section>
  );
}

const cell = (s: string) => `"${s.replace(/"/g, '""')}"`;

function altCsv(sequence: Sequence, base: string, scale: Scale, format: Format): string {
  const rows = ['file,page,template,alt_text'];
  sequence.pages.forEach((page, i) => {
    const preset = byId(page.presetId);
    const generated = preset
      ? `${preset.name}. ${Object.values(page.doc.fields)
          .flatMap((v) => (Array.isArray(v) ? v.map(String) : [String(v ?? '')]))
          .map((s) => s.split('|')[0]!.trim())
          .filter((s) => s.length > 1 && !s.startsWith('data:') && !/^https?:|^[\w.-]+\.(app|io|com)$/.test(s))
          .join('. ')}`
      : '';
    rows.push(
      [
        cell(filenameFor({ id: base, scale, format, slide: i + 1 })),
        String(i + 1),
        cell(preset?.name ?? page.presetId),
        cell((page.doc.alt?.trim() || generated).replace(/\s+/g, ' ').slice(0, 900)),
      ].join(',')
    );
  });
  return rows.join('\n') + '\n';
}
