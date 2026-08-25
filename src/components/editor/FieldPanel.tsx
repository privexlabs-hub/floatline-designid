'use client';

import type { Preset, Field } from '@/content/templates/types';
import type { Doc } from '@/lib/use-editor-state';
import { SURFACES, type Surface } from '@/lib/tokens';
import { VERTICALS, verticalOf, type VerticalId } from '@/content/verticals';
import { CURRENCIES, type CurrencyId } from '@/content/brand';
import { PLATFORM_LIMITS } from '@/lib/platforms';

/**
 * Structured editing, not a canvas. Every field is declared by the preset, so a
 * template cannot grow a text box nobody can fill in and the export always has
 * a value for everything it renders.
 */
/**
 * Read an uploaded file to a data URL, downscaled so it can live in
 * localStorage without evicting everything else.
 *
 * 1600px on the long edge is comfortably above what any artboard needs — the
 * largest logo box in the catalog is a few hundred pixels at 3x — and turns a
 * multi-megabyte photo into tens of kilobytes.
 */
const MAX_EDGE = 1600;

async function downscaleToDataUrl(file: File): Promise<string> {
  const original = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('That file could not be read.'));
    reader.readAsDataURL(file);
  });

  // SVG has no intrinsic raster size to shrink, and is already small.
  if (file.type === 'image/svg+xml') return original;

  const img = new Image();
  img.src = original;
  try {
    await img.decode();
  } catch {
    return original; // undecodable here will fail visibly on the artboard
  }

  const scale = Math.min(1, MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
  if (scale === 1 && original.length < 400_000) return original;

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) return original;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // PNG keeps transparency, which a logo usually needs.
  return canvas.toDataURL('image/png');
}

export function FieldPanel({
  preset,
  doc,
  onField,
  onSurface,
  onGrain,
  onVertical,
  onCurrency,
  onAlt,
  onReset,
}: {
  preset: Preset;
  doc: Doc;
  onField: (k: string, v: unknown) => void;
  onSurface: (v: Surface) => void;
  onGrain: (v: boolean) => void;
  onVertical: (v: VerticalId) => void;
  onCurrency: (v: CurrencyId) => void;
  onAlt: (v: string) => void;
  onReset: () => void;
}) {
  const limit = preset.platform ? PLATFORM_LIMITS[preset.platform] : undefined;

  const renderField = (f: Field) => {
    const v = doc.fields[f.k];
    const id = `f-${preset.id}-${f.k}`;

    if (f.type === 'toggle') {
      return (
        <div className="field" key={f.k}>
          <div className="field-row">
            <input id={id} type="checkbox" checked={Boolean(v ?? f.def)} onChange={(e) => onField(f.k, e.target.checked)} />
            <label htmlFor={id} style={{ textTransform: 'none', letterSpacing: 0, fontSize: 'var(--fs-body)', fontWeight: 600 }}>{f.label}</label>
          </div>
        </div>
      );
    }

    if (f.type === 'select') {
      return (
        <div className="field" key={f.k}>
          <label htmlFor={id}>{f.label}</label>
          <select id={id} value={String(v ?? f.def)} onChange={(e) => onField(f.k, e.target.value)}>
            {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      );
    }

    if (f.type === 'lines') {
      const text = Array.isArray(v) ? v.join('\n') : String(v ?? f.def.join('\n'));
      return (
        <div className="field" key={f.k}>
          <label htmlFor={id}>{f.label}</label>
          <textarea id={id} value={text} rows={Math.min(10, Math.max(3, text.split('\n').length))}
            onChange={(e) => onField(f.k, e.target.value.split('\n'))} />
          <span className="field-count">one per line</span>
        </div>
      );
    }

    if (f.type === 'image') {
      return (
        <div className="field" key={f.k}>
          <label htmlFor={id}>{f.label}</label>
          <input id={id} type="file" accept="image/*" onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            // Downscaled before it reaches the doc. A data URL goes straight
            // into localStorage, and a 4 MB photo becomes ~5.5 MB of base64 —
            // enough to blow the quota and lose every other saved design.
            void downscaleToDataUrl(file).then((url) => onField(f.k, url));
            e.target.value = '';
          }} />
          {String(v ?? '').startsWith('data:') ? (
            <div className="row" style={{ gap: 'var(--sp-2)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={String(v)} alt="" style={{ height: 40, width: 'auto', maxWidth: 120, objectFit: 'contain', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)' }} />
              <button type="button" className="btn" style={{ minHeight: 36, padding: '0 var(--sp-3)' }} onClick={() => onField(f.k, '')}>Remove</button>
            </div>
          ) : null}
          <span className="note">
            Customer logos and product screenshots. Not stock photography and not
            generated faces — avatars stay initials on a colour. Stays in your
            browser; never uploaded.
          </span>
        </div>
      );
    }

    const text = String(v ?? f.def);
    const max = f.max;
    const over = max !== undefined && text.length > max;
    const Tag = f.type === 'textarea' ? 'textarea' : 'input';

    return (
      <div className="field" key={f.k}>
        <label htmlFor={id}>{f.label}</label>
        {Tag === 'textarea' ? (
          <textarea id={id} value={text} onChange={(e) => onField(f.k, e.target.value)} />
        ) : (
          <input id={id} type="text" value={text} onChange={(e) => onField(f.k, e.target.value)} />
        )}
        {max !== undefined ? (
          <span className="field-count" data-over={over}>{text.length} / {max}</span>
        ) : null}
      </div>
    );
  };

  const vertical = verticalOf(doc.vertical);

  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--sp-4)' }}>
        <h2 className="fl-h4" style={{ margin: 0 }}>{preset.name}</h2>
        <button type="button" className="btn" style={{ padding: '0 var(--sp-4)' }} onClick={onReset}>Reset</button>
      </div>

      <div className="field">
        <label>Surface</label>
        <div className="swatches">
          {SURFACES.map((s) => (
            <button key={s.id} type="button" className="swatch" aria-pressed={doc.surface === s.id}
              title={s.hint} onClick={() => onSurface(s.id)}>{s.label}</button>
          ))}
        </div>
      </div>

      <div className="field">
        <div className="field-row">
          <input id="grain" type="checkbox" checked={doc.grain} onChange={(e) => onGrain(e.target.checked)} />
          <label htmlFor="grain" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 'var(--fs-body)', fontWeight: 600 }}>
            Receipt-paper grain
          </label>
        </div>
      </div>

      <div className="field">
        <label htmlFor="vertical">Vertical</label>
        <select id="vertical" value={doc.vertical} onChange={(e) => onVertical(e.target.value as VerticalId)}>
          {VERTICALS.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
        </select>
        <span className="note">{vertical.summary}</span>
      </div>

      <div className="field">
        <label htmlFor="currency">Currency</label>
        <select id="currency" value={doc.currency} onChange={(e) => onCurrency(e.target.value as CurrencyId)}>
          {CURRENCIES.map((c) => <option key={c.id} value={c.id}>{c.symbol} · {c.label}</option>)}
        </select>
      </div>

      <div className="field">
        <label htmlFor="alt">Alt text</label>
        <textarea
          id="alt"
          value={doc.alt ?? ''}
          rows={2}
          placeholder="Generated from the copy above if left blank"
          onChange={(e) => onAlt(e.target.value)}
        />
        <span className="note">
          Travels with the image in the batch export&rsquo;s alt-text.csv. Platforms
          drop alt text on upload, so this is often the only copy that survives.
        </span>
      </div>

      <hr className="receipt" />

      {limit ? (
        <p className="note" style={{ marginBottom: 'var(--sp-4)' }}>
          Destined for {limit.label}. Caption limit {limit.caption} characters; alt text {limit.alt}.
        </p>
      ) : null}

      {preset.fields.map(renderField)}
    </div>
  );
}
