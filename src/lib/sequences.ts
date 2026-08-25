'use client';

import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { byId } from '@/content/templates/registry';
import { defaultsOf } from '@/content/templates/types';
import type { Preset } from '@/content/templates/types';
import { DEFAULT_VERTICAL, type VerticalId } from '@/content/verticals';
import type { CurrencyId } from '@/content/brand';
import type { Surface } from '@/lib/tokens';
import type { Doc } from '@/lib/use-editor-state';

/**
 * Ordered sequences of artboards — a carousel deck, a report, a pitch deck.
 *
 * One engine for all three, because they are the same problem: N pages in an
 * order the author controls, exported as one PDF or a numbered set. What
 * differs is the page templates and the canvas, and both of those are already
 * data.
 *
 * Kept beside `use-editor-state.ts` rather than folded into it. That module
 * keys one doc per preset, globally, which is exactly right for "edit the
 * Normal post template" and cannot express "page 3 and page 7 are both the body
 * template with different copy". Two shapes, two stores, one `Doc` type shared
 * between them.
 */

const KEY = 'floatline.sequences.v1';
const HISTORY_LIMIT = 50;

export type Page = {
  /**
   * Stable, and deliberately not the array index. Reorder, duplicate and delete
   * all shift indices; a ref map or a React key built on them silently
   * mismatches the moment a page moves.
   */
  id: string;
  presetId: string;
  doc: Doc;
};

export type SequenceKind = 'deck' | 'document';

export type Sequence = {
  id: string;
  kind: SequenceKind;
  name: string;
  pages: Page[];
  /** Document furniture. A deck ignores both. */
  numbering: boolean;
  runningHeader: string;
};

export type Sequences = Record<string, Sequence>;

let counter = 0;
/** Unique within a session, and stable once stored. */
export function newId(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter.toString(36)}`;
}

export function docForPreset(p: Preset): Doc {
  return {
    fields: defaultsOf(p),
    surface: p.surface,
    grain: false,
    vertical: p.vertical ?? DEFAULT_VERTICAL,
    currency: p.currency ?? 'NGN',
  };
}

export function pageFor(presetId: string): Page | null {
  const preset = byId(presetId);
  if (!preset) return null;
  return { id: newId('pg'), presetId, doc: docForPreset(preset) };
}

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

type State = {
  history: { past: Sequences[]; present: Sequences; future: Sequences[] };
  activeId: string | null;
  activePage: number;
};

export type Action =
  | { t: 'create'; sequence: Sequence }
  | { t: 'open'; id: string }
  | { t: 'remove'; id: string }
  | { t: 'rename'; v: string }
  | { t: 'settings'; numbering?: boolean; runningHeader?: string }
  | { t: 'addPage'; presetId: string; at?: number }
  | { t: 'duplicatePage'; index: number }
  | { t: 'deletePage'; index: number }
  | { t: 'movePage'; from: number; to: number }
  | { t: 'swapPreset'; index: number; presetId: string }
  | { t: 'selectPage'; index: number }
  | { t: 'field'; k: string; v: unknown }
  | { t: 'surface'; v: Surface }
  | { t: 'grain'; v: boolean }
  | { t: 'vertical'; v: VerticalId }
  | { t: 'currency'; v: CurrencyId }
  | { t: 'alt'; v: string }
  | { t: 'resetPage' }
  | { t: 'undo' }
  | { t: 'redo' }
  | { t: 'hydrate'; sequences: Sequences; activeId: string | null };

const push = (h: State['history'], next: Sequences): State['history'] => ({
  past: [...h.past, h.present].slice(-HISTORY_LIMIT),
  present: next,
  future: [],
});

/** Apply a change to the active sequence, or do nothing if there is not one. */
function editSequence(state: State, fn: (s: Sequence) => Sequence): State {
  const id = state.activeId;
  if (!id) return state;
  const current = state.history.present[id];
  if (!current) return state;
  return { ...state, history: push(state.history, { ...state.history.present, [id]: fn(current) }) };
}

function editPage(state: State, fn: (d: Doc) => Doc): State {
  return editSequence(state, (seq) => ({
    ...seq,
    pages: seq.pages.map((p, i) => (i === state.activePage ? { ...p, doc: fn(p.doc) } : p)),
  }));
}

const clampPage = (state: State, seq: Sequence | undefined): number =>
  Math.max(0, Math.min(state.activePage, (seq?.pages.length ?? 1) - 1));

function reducer(state: State, a: Action): State {
  switch (a.t) {
    case 'create':
      return {
        ...state,
        history: push(state.history, { ...state.history.present, [a.sequence.id]: a.sequence }),
        activeId: a.sequence.id,
        activePage: 0,
      };
    case 'open':
      return { ...state, activeId: a.id, activePage: 0 };
    case 'remove': {
      const next = { ...state.history.present };
      delete next[a.id];
      const remaining = Object.keys(next);
      return {
        ...state,
        history: push(state.history, next),
        activeId: state.activeId === a.id ? (remaining[0] ?? null) : state.activeId,
        activePage: 0,
      };
    }
    case 'rename':
      return editSequence(state, (s) => ({ ...s, name: a.v }));
    case 'settings':
      return editSequence(state, (s) => ({
        ...s,
        numbering: a.numbering ?? s.numbering,
        runningHeader: a.runningHeader ?? s.runningHeader,
      }));
    case 'addPage': {
      const page = pageFor(a.presetId);
      if (!page) return state;
      const at = a.at ?? state.activePage + 1;
      const next = editSequence(state, (s) => ({
        ...s,
        pages: [...s.pages.slice(0, at), page, ...s.pages.slice(at)],
      }));
      return { ...next, activePage: at };
    }
    case 'duplicatePage': {
      const seq = state.activeId ? state.history.present[state.activeId] : undefined;
      const source = seq?.pages[a.index];
      if (!source) return state;
      // Deep enough that a `lines` array is not shared with the original.
      const copy: Page = {
        id: newId('pg'),
        presetId: source.presetId,
        doc: { ...source.doc, fields: structuredClone(source.doc.fields) },
      };
      const next = editSequence(state, (s) => ({
        ...s,
        pages: [...s.pages.slice(0, a.index + 1), copy, ...s.pages.slice(a.index + 1)],
      }));
      return { ...next, activePage: a.index + 1 };
    }
    case 'deletePage': {
      const seq = state.activeId ? state.history.present[state.activeId] : undefined;
      if (!seq || seq.pages.length < 2) return state;
      const next = editSequence(state, (s) => ({ ...s, pages: s.pages.filter((_, i) => i !== a.index) }));
      const updated = next.activeId ? next.history.present[next.activeId] : undefined;
      return { ...next, activePage: clampPage({ ...next, activePage: Math.max(0, a.index - 1) }, updated) };
    }
    case 'movePage': {
      const seq = state.activeId ? state.history.present[state.activeId] : undefined;
      if (!seq) return state;
      const { from, to } = a;
      if (from === to || from < 0 || to < 0 || from >= seq.pages.length || to >= seq.pages.length) return state;
      const pages = [...seq.pages];
      const [moved] = pages.splice(from, 1);
      pages.splice(to, 0, moved!);
      const next = editSequence(state, (s) => ({ ...s, pages }));
      return { ...next, activePage: to };
    }
    case 'swapPreset': {
      const preset = byId(a.presetId);
      if (!preset) return state;
      return editSequence(state, (s) => ({
        ...s,
        pages: s.pages.map((p, i) =>
          i === a.index ? { ...p, presetId: a.presetId, doc: docForPreset(preset) } : p
        ),
      }));
    }
    case 'selectPage':
      return { ...state, activePage: a.index };
    case 'field':
      return editPage(state, (d) => ({ ...d, fields: { ...d.fields, [a.k]: a.v } }));
    case 'surface':
      return editPage(state, (d) => ({ ...d, surface: a.v }));
    case 'grain':
      return editPage(state, (d) => ({ ...d, grain: a.v }));
    case 'vertical':
      return editPage(state, (d) => ({ ...d, vertical: a.v }));
    case 'currency':
      return editPage(state, (d) => ({ ...d, currency: a.v }));
    case 'alt':
      return editPage(state, (d) => ({ ...d, alt: a.v }));
    case 'resetPage': {
      const seq = state.activeId ? state.history.present[state.activeId] : undefined;
      const page = seq?.pages[state.activePage];
      const preset = page ? byId(page.presetId) : undefined;
      if (!preset) return state;
      return editPage(state, () => docForPreset(preset));
    }
    case 'undo': {
      const { past, present, future } = state.history;
      const prev = past.at(-1);
      if (!prev) return state;
      const seq = state.activeId ? prev[state.activeId] : undefined;
      return {
        ...state,
        history: { past: past.slice(0, -1), present: prev, future: [present, ...future] },
        activePage: clampPage(state, seq),
      };
    }
    case 'redo': {
      const { past, present, future } = state.history;
      const next = future[0];
      if (!next) return state;
      const seq = state.activeId ? next[state.activeId] : undefined;
      return {
        ...state,
        history: { past: [...past, present], present: next, future: future.slice(1) },
        activePage: clampPage(state, seq),
      };
    }
    case 'hydrate':
      return {
        ...state,
        history: { past: [], present: a.sequences, future: [] },
        activeId: a.activeId,
        activePage: 0,
      };
    default:
      return state;
  }
}

/**
 * Migrate a stored set onto the current catalog: drop pages whose template has
 * left the registry, drop sequences that end up empty, and backfill fields a
 * template has gained. Without this, adding one field to a page template leaves
 * every saved document with a hole where it should be.
 */
function revive(raw: unknown): Sequences {
  if (!raw || typeof raw !== 'object') return {};
  const out: Sequences = {};
  for (const [id, value] of Object.entries(raw as Record<string, Partial<Sequence>>)) {
    if (!value || !Array.isArray(value.pages)) continue;
    const pages: Page[] = [];
    for (const p of value.pages as Page[]) {
      const preset = p?.presetId ? byId(p.presetId) : undefined;
      if (!preset) continue;
      const defaults = defaultsOf(preset);
      const fields: Record<string, unknown> = {};
      for (const f of preset.fields) {
        fields[f.k] = p.doc?.fields && f.k in p.doc.fields ? p.doc.fields[f.k] : defaults[f.k];
      }
      pages.push({
        id: p.id || newId('pg'),
        presetId: p.presetId,
        doc: {
          fields,
          surface: p.doc?.surface ?? preset.surface,
          grain: p.doc?.grain ?? false,
          vertical: p.doc?.vertical ?? preset.vertical ?? DEFAULT_VERTICAL,
          currency: p.doc?.currency ?? preset.currency ?? 'NGN',
          ...(p.doc?.alt ? { alt: p.doc.alt } : {}),
        },
      });
    }
    if (pages.length === 0) continue;
    out[id] = {
      id,
      kind: value.kind === 'document' ? 'document' : 'deck',
      name: value.name || 'Untitled',
      pages,
      numbering: value.numbering ?? true,
      runningHeader: value.runningHeader ?? '',
    };
  }
  return out;
}

export function useSequences() {
  const [state, dispatch] = useReducer(reducer, {
    history: { past: [], present: {}, future: [] },
    activeId: null,
    activePage: 0,
  });

  const hydrated = useRef(false);

  useEffect(() => {
    let sequences: Sequences = {};
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) sequences = revive(JSON.parse(raw));
    } catch {
      /* corrupt or unavailable storage should not take the page down */
    }
    const wanted = new URLSearchParams(window.location.search).get('s');
    const activeId = wanted && sequences[wanted] ? wanted : (Object.keys(sequences)[0] ?? null);
    dispatch({ t: 'hydrate', sequences, activeId });
    hydrated.current = true;
  }, []);

  const sequences = state.history.present;

  useEffect(() => {
    if (!hydrated.current) return;
    const id = window.setTimeout(() => {
      try {
        window.localStorage.setItem(KEY, JSON.stringify(sequences));
      } catch {
        /* quota exceeded — editing continues, it just will not persist */
      }
    }, 400);
    return () => window.clearTimeout(id);
  }, [sequences]);

  const active = state.activeId ? (sequences[state.activeId] ?? null) : null;
  const pageIndex = Math.max(0, Math.min(state.activePage, (active?.pages.length ?? 1) - 1));
  const page = active?.pages[pageIndex] ?? null;
  const preset = useMemo(() => (page ? (byId(page.presetId) ?? null) : null), [page]);

  const undo = useCallback(() => dispatch({ t: 'undo' }), []);
  const redo = useCallback(() => dispatch({ t: 'redo' }), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod || e.key.toLowerCase() !== 'z') return;
      const t = e.target;
      if (t instanceof HTMLElement && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, redo]);

  return {
    sequences,
    active,
    page,
    pageIndex,
    preset,
    dispatch,
    undo,
    redo,
    canUndo: state.history.past.length > 0,
    canRedo: state.history.future.length > 0,
  };
}
