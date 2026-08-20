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
export function FieldPanel({
  preset,
  doc,
  onField,
  onSurface,
  onGrain,
  onVertical,
  onCurrency,
  onReset,
}: {
  preset: Preset;
  doc: Doc;
  onField: (k: string, v: unknown) => void;
  onSurface: (v: Surface) => void;
  onGrain: (v: boolean) => void;
  onVertical: (v: VerticalId) => void;
  onCurrency: (v: CurrencyId) => void;
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
            // Read to a data URL and keep it in the doc. Nothing is uploaded —
            // and a data URL is same-origin, so it survives the export canvas.
            const reader = new FileReader();
            reader.onload = () => onField(f.k, String(reader.result));
            reader.readAsDataURL(file);
          }} />
          <span className="note">Stays in your browser. Never uploaded.</span>
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
