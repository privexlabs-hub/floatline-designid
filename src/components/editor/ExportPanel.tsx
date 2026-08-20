'use client';

import { useMemo, useRef, useState } from 'react';
import type { Preset } from '@/content/templates/types';
import type { Doc, Docs } from '@/lib/use-editor-state';
import { PRESETS } from '@/content/templates/registry';
import {
  FORMATS, FORMAT_META, SCALES, MAX_PIXELS, megapixelsOf,
  commitActiveEdit, exportOne, filenameFor, getSharedFontCSS, saveBlob, settle,
  type Format, type Scale,
} from '@/lib/export-image';
import { exportBatch, saveZip, type BatchProgress } from '@/lib/download-zip';
import { renderOffscreen, disposeOffscreen } from '@/lib/offscreen';

type Scope = 'one' | 'group' | 'all';

export function ExportPanel({
  preset,
  doc,
  docs,
  nodeRef,
  scale,
  format,
  quality,
  guides,
  onScale,
  onFormat,
  onQuality,
  onGuides,
}: {
  preset: Preset;
  doc: Doc;
  docs: Docs;
  nodeRef: React.RefObject<HTMLDivElement | null>;
  scale: Scale;
  format: Format;
  quality: number;
  guides: boolean;
  onScale: (v: Scale) => void;
  onFormat: (v: Format) => void;
  onQuality: (v: number) => void;
  onGuides: (v: boolean) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [progress, setProgress] = useState<BatchProgress | null>(null);
  const [scope, setScope] = useState<Scope>('one');
  const [zipFormats, setZipFormats] = useState<Format[]>(['png']);
  const abort = useRef<AbortController | null>(null);
  // Mirrored in state because JSX may not read a ref during render.
  const [cancellable, setCancellable] = useState(false);

  const scopePresets = useMemo(() => {
    if (scope === 'one') return [preset];
    if (scope === 'group') return PRESETS.filter((p) => p.group === preset.group);
    return PRESETS;
  }, [scope, preset]);

  const mp = megapixelsOf(preset.w * scale, preset.h * scale);
  const overLimit = mp > MAX_PIXELS / 1_000_000;

  const manifest = useMemo(
    () =>
      scope === 'one'
        ? [filenameFor({ id: preset.id, surface: doc.surface, scale, format })]
        : scopePresets.flatMap((p) =>
            zipFormats.map((f) => filenameFor({ id: p.id, surface: docs[p.id]?.surface ?? p.surface, scale, format: f }))
          ),
    [scope, scopePresets, zipFormats, preset, doc.surface, scale, format, docs]
  );

  async function downloadOne() {
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      // A blinking caret or an uncommitted keystroke would otherwise be baked in.
      await commitActiveEdit();
      const node = nodeRef.current?.querySelector<HTMLElement>('.artboard-export');
      if (!node) throw new Error('The artboard is not on screen yet.');
      await settle();
      const fontEmbedCSS = await getSharedFontCSS(node);
      const blob = await exportOne(
        { node, w: preset.w, h: preset.h, surface: doc.surface },
        {
          scale, format, quality, fontEmbedCSS,
          onClamp: ({ requested, used }) =>
            setNotice(`${requested}× was larger than this browser will rasterise. Exported at ${used}× instead.`),
        }
      );
      saveBlob(blob, filenameFor({ id: preset.id, surface: doc.surface, scale, format }));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function downloadBatch() {
    if (zipFormats.length === 0) {
      setError('Pick at least one format for the ZIP.');
      return;
    }
    setError(null);
    setNotice(null);
    setBusy(true);
    abort.current = new AbortController();
    setCancellable(true);
    try {
      await commitActiveEdit();
      const blob = await exportBatch({
        presets: scopePresets,
        docs,
        scale,
        formats: zipFormats,
        quality,
        renderOffscreen,
        onProgress: setProgress,
        signal: abort.current.signal,
      });
      saveZip(blob, scope === 'all' ? `kit-${scale}x` : `${preset.group.replace(/[^\w]+/g, '-').toLowerCase()}-${scale}x`);
    } catch (e) {
      if ((e as Error).name === 'AbortError') setNotice('Export cancelled. Nothing was downloaded.');
      else setError((e as Error).message);
    } finally {
      disposeOffscreen();
      setProgress(null);
      setBusy(false);
      abort.current = null;
      setCancellable(false);
    }
  }

  const meta = FORMAT_META[format];
  const lossy = format === 'jpeg' || format === 'webp';

  return (
    <section aria-label="Export">
      <h2 className="fl-h4" style={{ marginBottom: 'var(--sp-3)' }}>Export</h2>

      <div className="field">
        <label>Scope</label>
        <div className="swatches">
          {([
            ['one', 'This one'],
            ['group', `Group (${PRESETS.filter((p) => p.group === preset.group).length})`],
            ['all', `Everything (${PRESETS.length})`],
          ] as [Scope, string][]).map(([id, label]) => (
            <button key={id} type="button" className="swatch" aria-pressed={scope === id} onClick={() => setScope(id)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>Scale</label>
        <div className="swatches">
          {SCALES.map((s) => (
            <button key={s} type="button" className="swatch" aria-pressed={scale === s} onClick={() => onScale(s)}>{s}×</button>
          ))}
        </div>
        <span className="field-count">
          {preset.w * scale} × {preset.h * scale} · {mp.toFixed(1)} MP
        </span>
      </div>

      {scope === 'one' ? (
        <div className="field">
          <label>Format</label>
          <div className="swatches">
            {FORMATS.map((f) => (
              <button key={f} type="button" className="swatch" aria-pressed={format === f} onClick={() => onFormat(f)}>
                {FORMAT_META[f].label}
              </button>
            ))}
          </div>
          {meta.note ? <span className="note">{meta.note}</span> : null}
        </div>
      ) : (
        <div className="field">
          <label>Formats in the ZIP</label>
          <div className="swatches">
            {FORMATS.map((f) => (
              <button
                key={f}
                type="button"
                className="swatch"
                aria-pressed={zipFormats.includes(f)}
                onClick={() => setZipFormats((cur) => (cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f]))}
              >
                {FORMAT_META[f].label}
              </button>
            ))}
          </div>
        </div>
      )}

      {lossy && scope === 'one' ? (
        <div className="field">
          <label htmlFor="q">Quality · {Math.round(quality * 100)}%</label>
          <input id="q" type="range" min={0.5} max={1} step={0.01} value={quality}
            onChange={(e) => onQuality(Number(e.target.value))} />
        </div>
      ) : null}

      <div className="field">
        <div className="field-row">
          <input id="guides" type="checkbox" checked={guides} onChange={(e) => onGuides(e.target.checked)} />
          <label htmlFor="guides" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 'var(--fs-body)', fontWeight: 600 }}>
            Show safe-area guides
          </label>
        </div>
        <span className="note">Guides are drawn beside the artboard, never inside it — they cannot end up in a file.</span>
      </div>

      {overLimit ? (
        <p className="warn">
          {preset.w * scale} × {preset.h * scale} is {mp.toFixed(1)} MP, over the{' '}
          {(MAX_PIXELS / 1_000_000).toFixed(1)} MP browser canvas limit. Export at a lower scale.
        </p>
      ) : null}

      <div className="field">
        <label>Files ({manifest.length})</label>
        <div className="manifest">{manifest.slice(0, 60).map((n) => <div key={n}>{n}</div>)}
          {manifest.length > 60 ? <div>… and {manifest.length - 60} more</div> : null}
        </div>
      </div>

      {progress ? (
        <div className="field">
          <div className="progress"><i style={{ width: `${(progress.done / Math.max(1, progress.total)) * 100}%` }} /></div>
          <span className="field-count">{progress.done} / {progress.total} · {progress.label}</span>
        </div>
      ) : null}

      <div className="row">
        {scope === 'one' ? (
          <button type="button" className="btn" data-tone="primary" disabled={busy || overLimit} onClick={downloadOne}>
            {busy ? 'Exporting…' : `Download ${meta.label}`}
          </button>
        ) : (
          <button type="button" className="btn" data-tone="primary" disabled={busy} onClick={downloadBatch}>
            {busy ? 'Exporting…' : `Download ZIP (${manifest.length})`}
          </button>
        )}
        {busy && cancellable ? (
          <button type="button" className="btn" onClick={() => abort.current?.abort()}>Cancel</button>
        ) : null}
      </div>

      {notice ? <p className="warn" style={{ marginTop: 'var(--sp-3)' }} role="status">{notice}</p> : null}
      {error ? <p className="err" style={{ marginTop: 'var(--sp-3)' }} role="alert">{error}</p> : null}

      <p className="note" style={{ marginTop: 'var(--sp-4)' }}>
        Everything is rendered and encoded in this browser. Nothing is uploaded. A batch also writes
        an <code>alt-text.csv</code> beside the images, because platforms drop alt text on upload.
      </p>
    </section>
  );
}
