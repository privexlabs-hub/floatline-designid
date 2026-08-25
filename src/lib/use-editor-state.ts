'use client';

import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import type { Preset } from '@/content/templates/types';
import { defaultsOf } from '@/content/templates/types';
import { PRESETS, byId } from '@/content/templates/registry';
import type { Surface } from '@/lib/tokens';
import type { Format, Scale } from '@/lib/export-image';
import { DEFAULT_VERTICAL, type VerticalId } from '@/content/verticals';
import type { CurrencyId } from '@/content/brand';

const KEY = 'floatline.editor.v1';
const HISTORY_LIMIT = 50;

export type Doc = {
  fields: Record<string, unknown>;
  surface: Surface;
  grain: boolean;
  vertical: VerticalId;
  currency: CurrencyId;
  /**
   * Overrides the alt text a batch export would otherwise generate from the
   * field values. Platforms drop alt text on upload, so the sidecar CSV is
   * often the only copy that survives — worth being able to write by hand.
   */
  alt?: string;
};

export type Docs = Record<string, Doc>;

/** Split deliberately: only `docs` is undoable. Changing the export format
 *  should not consume an undo step the user wanted for their headline. */
type State = {
  history: { past: Docs[]; present: Docs; future: Docs[] };
  selected: string;
  scale: Scale;
  format: Format;
  quality: number;
  guides: boolean;
};

type Action =
  | { t: 'field'; id: string; k: string; v: unknown }
  | { t: 'surface'; id: string; v: Surface }
  | { t: 'grain'; id: string; v: boolean }
  | { t: 'vertical'; id: string; v: VerticalId }
  | { t: 'currency'; id: string; v: CurrencyId }
  | { t: 'alt'; id: string; v: string }
  | { t: 'reset'; id: string }
  | { t: 'undo' }
  | { t: 'redo' }
  | { t: 'select'; id: string }
  | { t: 'scale'; v: Scale }
  | { t: 'format'; v: Format }
  | { t: 'quality'; v: number }
  | { t: 'guides'; v: boolean }
  | { t: 'hydrate'; docs: Docs; selected?: string };

export const docFor = (p: Preset, docs: Docs): Doc =>
  docs[p.id] ?? {
    fields: defaultsOf(p),
    surface: p.surface,
    grain: false,
    vertical: p.vertical ?? DEFAULT_VERTICAL,
    currency: p.currency ?? 'NGN',
  };

function push(h: State['history'], next: Docs): State['history'] {
  return { past: [...h.past, h.present].slice(-HISTORY_LIMIT), present: next, future: [] };
}

function editDoc(state: State, id: string, patch: (d: Doc) => Doc): State {
  const p = byId(id);
  if (!p) return state;
  const current = docFor(p, state.history.present);
  return { ...state, history: push(state.history, { ...state.history.present, [id]: patch(current) }) };
}

function reducer(state: State, a: Action): State {
  switch (a.t) {
    case 'field':
      return editDoc(state, a.id, (d) => ({ ...d, fields: { ...d.fields, [a.k]: a.v } }));
    case 'surface':
      return editDoc(state, a.id, (d) => ({ ...d, surface: a.v }));
    case 'grain':
      return editDoc(state, a.id, (d) => ({ ...d, grain: a.v }));
    case 'vertical':
      return editDoc(state, a.id, (d) => ({ ...d, vertical: a.v }));
    case 'currency':
      return editDoc(state, a.id, (d) => ({ ...d, currency: a.v }));
    case 'alt':
      return editDoc(state, a.id, (d) => ({ ...d, alt: a.v }));
    case 'reset': {
      const p = byId(a.id);
      if (!p) return state;
      const next = { ...state.history.present };
      delete next[a.id];
      return { ...state, history: push(state.history, next) };
    }
    case 'undo': {
      const { past, present, future } = state.history;
      const prev = past.at(-1);
      if (!prev) return state;
      return { ...state, history: { past: past.slice(0, -1), present: prev, future: [present, ...future] } };
    }
    case 'redo': {
      const { past, present, future } = state.history;
      const next = future[0];
      if (!next) return state;
      return { ...state, history: { past: [...past, present], present: next, future: future.slice(1) } };
    }
    case 'select':
      return { ...state, selected: a.id };
    case 'scale':
      return { ...state, scale: a.v };
    case 'format':
      return { ...state, format: a.v };
    case 'quality':
      return { ...state, quality: a.v };
    case 'guides':
      return { ...state, guides: a.v };
    case 'hydrate':
      return {
        ...state,
        history: { past: [], present: a.docs, future: [] },
        selected: a.selected ?? state.selected,
      };
    default:
      return state;
  }
}

/**
 * Migrates a stored doc set onto the CURRENT catalog: drops presets that no
 * longer exist, drops fields a preset no longer declares, and backfills fields
 * it has gained. Without this, adding one field to a template breaks every
 * saved doc with a blank space where the new field should be.
 */
function revive(raw: unknown): Docs {
  if (!raw || typeof raw !== 'object') return {};
  const stored = raw as Record<string, Partial<Doc>>;
  const out: Docs = {};
  for (const p of PRESETS) {
    const d = stored[p.id];
    if (!d) continue;
    const defaults = defaultsOf(p);
    const fields: Record<string, unknown> = {};
    for (const f of p.fields) {
      fields[f.k] = f.k in (d.fields ?? {}) ? (d.fields as Record<string, unknown>)[f.k] : defaults[f.k];
    }
    out[p.id] = {
      fields,
      surface: d.surface ?? p.surface,
      grain: d.grain ?? false,
      vertical: d.vertical ?? p.vertical ?? DEFAULT_VERTICAL,
      currency: d.currency ?? p.currency ?? 'NGN',
      ...(d.alt ? { alt: d.alt } : {}),
    };
  }
  return out;
}

export function useEditorState() {
  const [state, dispatch] = useReducer(reducer, {
    history: { past: [], present: {}, future: [] },
    selected: PRESETS[0]!.id,
    scale: 1,
    format: 'png',
    quality: 0.94,
    guides: true,
  });

  const hydrated = useRef(false);

  // Read on mount only. `?t=<presetId>` is read off window.location rather than
  // useSearchParams so this component needs no Suspense boundary under static
  // export.
  useEffect(() => {
    let docs: Docs = {};
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) docs = revive(JSON.parse(raw));
    } catch {
      /* corrupt or unavailable storage is not worth failing the editor over */
    }
    const wanted = new URLSearchParams(window.location.search).get('t');
    const selected = wanted && byId(wanted) ? wanted : undefined;
    dispatch({ t: 'hydrate', docs, selected });
    hydrated.current = true;
  }, []);

  // Debounced persist. Writing on every keystroke makes typing janky on a
  // large doc set.
  const docs = state.history.present;
  useEffect(() => {
    if (!hydrated.current) return;
    const id = window.setTimeout(() => {
      try {
        window.localStorage.setItem(KEY, JSON.stringify(docs));
      } catch {
        /* quota exceeded — the editor keeps working, it just will not persist */
      }
    }, 400);
    return () => window.clearTimeout(id);
  }, [docs]);

  const preset = useMemo(() => byId(state.selected) ?? PRESETS[0]!, [state.selected]);
  const doc = useMemo(() => docFor(preset, docs), [preset, docs]);

  const undo = useCallback(() => dispatch({ t: 'undo' }), []);
  const redo = useCallback(() => dispatch({ t: 'redo' }), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod || e.key.toLowerCase() !== 'z') return;
      const target = e.target;
      // Let the browser's own undo win inside a text field.
      if (target instanceof HTMLElement && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, redo]);

  return {
    state,
    dispatch,
    docs,
    preset,
    doc,
    undo,
    redo,
    canUndo: state.history.past.length > 0,
    canRedo: state.history.future.length > 0,
  };
}
