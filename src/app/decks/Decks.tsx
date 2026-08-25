'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { LAYOUTS, byId, GROUPED } from '@/content/templates/registry';
import { useSequences, newId, pageFor, type Sequence } from '@/lib/sequences';
import { STARTERS } from '@/content/sequences';
import { Stage } from '@/components/editor/Stage';
import { FieldPanel } from '@/components/editor/FieldPanel';
import { VoicePanel } from '@/components/editor/VoicePanel';
import { PageStrip } from '@/components/decks/PageStrip';
import { SequenceExport } from '@/components/decks/SequenceExport';

/**
 * Decks and documents — an ordered run of artboards.
 *
 * Reuses the studio's Stage, FieldPanel and VoicePanel unchanged; what is new
 * here is the ordering, the page furniture a document needs, and an export that
 * produces one PDF instead of N.
 */

/** Page props the SEQUENCE owns rather than the page — numbering, contents. */
function sequenceProps(seq: Sequence, index: number) {
  const preset = byId(seq.pages[index]!.presetId);
  const shape = preset?.props?.shape;

  // The contents page is computed from the real pages, so it cannot go stale.
  // Cover and contents are not numbered, which is also where numbering starts.
  const tocEntries =
    shape === 'toc' || shape === 'agenda'
      ? seq.pages
          .map((p, i) => ({ p, i }))
          .filter(({ p }) => {
            const s = byId(p.presetId)?.props?.shape;
            return s !== 'cover' && s !== 'toc' && s !== 'agenda' && s !== 'back';
          })
          .map(({ p, i }) => `${tocLabel(p)}|${pageNumberFor(seq, i) ?? ''}`)
      : undefined;

  return {
    pageNumber: pageNumberFor(seq, index),
    pageTotal: seq.pages.filter((_, i) => pageNumberFor(seq, i) !== undefined).length,
    runningHeader: seq.runningHeader,
    numbering: seq.numbering,
    ...(tocEntries ? { tocEntries } : {}),
  };
}

/**
 * What a page is called in the contents.
 *
 * Its headline if it has one — but a pull-quote page has no headline, only a
 * quote, so fall through to the eyebrow and finally to the template's own name
 * with its "Page · " prefix removed. Printing the raw template name is what the
 * first version did, and a contents line reading "Page · Pull quote" is not a
 * contents line.
 */
function tocLabel(p: { presetId: string; doc: { fields: Record<string, unknown> } }): string {
  const preset = byId(p.presetId);
  const first = (v: unknown) => String(v ?? '').split('\n')[0]!.trim();
  return (
    first(p.doc.fields.title) ||
    first(p.doc.fields.eyebrow) ||
    (preset?.name ?? '').replace(/^(Page|Slide)\s·\s/, '')
  );
}

/** Covers and back pages carry no number; numbering starts after the cover. */
function pageNumberFor(seq: Sequence, index: number): number | undefined {
  if (!seq.numbering) return undefined;
  let n = 0;
  for (let i = 0; i <= index; i++) {
    const shape = byId(seq.pages[i]!.presetId)?.props?.shape;
    if (shape === 'cover' || shape === 'back') continue;
    n += 1;
  }
  const shape = byId(seq.pages[index]!.presetId)?.props?.shape;
  return shape === 'cover' || shape === 'back' ? undefined : n;
}

export default function Decks() {
  const { sequences, active, page, pageIndex, preset, dispatch, undo, redo, canUndo, canRedo } = useSequences();
  const nodeRef = useRef<HTMLDivElement>(null);
  const stagingRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [adding, setAdding] = useState(false);

  const start = useCallback((starterId: string) => {
    const starter = STARTERS.find((s) => s.id === starterId);
    if (!starter) return;
    const pages = starter.pages.map(pageFor).filter((p): p is NonNullable<typeof p> => p !== null);
    if (pages.length === 0) return;
    dispatch({
      t: 'create',
      sequence: {
        id: newId('seq'),
        kind: starter.kind,
        name: starter.name,
        pages,
        numbering: starter.numbering,
        runningHeader: starter.runningHeader,
      },
    });
  }, [dispatch]);

  const nodeFor = useCallback((i: number) => {
    const host = stagingRefs.current[i];
    return host?.querySelector<HTMLElement>('.artboard-export') ?? null;
  }, []);

  const list = useMemo(() => Object.values(sequences), [sequences]);

  if (!active || !page || !preset) {
    return (
      <main className="shell dk-empty">
        <Link href="/" className="tag-link">← floatline</Link>
        <h1 className="fl-display-2" style={{ marginTop: 'var(--sp-4)' }}>decks &amp; documents</h1>
        <p className="pb-lead">
          An ordered run of artboards — a carousel that reads in sequence, or a
          report that reads as a document. Reorder, duplicate and delete pages,
          then export the whole thing as one PDF or as numbered files.
        </p>
        <hr className="receipt" />
        <h2 className="fl-h4">Start from</h2>
        <div className="starters" style={{ padding: 0, marginTop: 'var(--sp-4)' }}>
          {STARTERS.map((s) => (
            <button key={s.id} type="button" className="starter" onClick={() => start(s.id)}>
              <b>{s.name}</b>
              <span>{s.description}</span>
              <em>{s.pages.length} {s.pages.length === 1 ? 'page' : 'pages'} · {s.kind}</em>
            </button>
          ))}
        </div>
        {list.length > 0 ? (
          <>
            <hr className="receipt" />
            <h2 className="fl-h4">Saved</h2>
            <div className="starters" style={{ padding: 0, marginTop: 'var(--sp-4)' }}>
              {list.map((s) => (
                <button key={s.id} type="button" className="starter" onClick={() => dispatch({ t: 'open', id: s.id })}>
                  <b>{s.name}</b>
                  <em>{s.pages.length} pages · {s.kind}</em>
                </button>
              ))}
            </div>
          </>
        ) : null}
      </main>
    );
  }

  const extra = sequenceProps(active, pageIndex);

  return (
    <div className="dk">
      <header className="dk-top">
        <Link href="/" className="ed-brand">
          <strong style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--fl-green-900)', letterSpacing: '-0.03em' }}>
            floatline
          </strong>
        </Link>
        <input
          className="dk-name"
          value={active.name}
          aria-label="Sequence name"
          onChange={(e) => dispatch({ t: 'rename', v: e.target.value })}
        />
        <span className="note">{active.pages.length} pages</span>
        <button type="button" className="btn" onClick={() => setAdding((v) => !v)} aria-expanded={adding}>
          Add page
        </button>
        <button type="button" className="btn" disabled={!canUndo} onClick={undo} title="Undo (⌘Z)">Undo</button>
        <button type="button" className="btn" disabled={!canRedo} onClick={redo} title="Redo (⇧⌘Z)">Redo</button>
        <button
          type="button" className="btn"
          onClick={() => dispatch({ t: 'open', id: '' })}
          title="Back to the sequence list"
        >
          All sequences
        </button>
      </header>

      <aside className="dk-rail">
        {adding ? (
          <div className="field" style={{ padding: 'var(--sp-3)' }}>
            <label htmlFor="add-page">Insert after page {pageIndex + 1}</label>
            <select
              id="add-page"
              defaultValue=""
              onChange={(e) => {
                if (!e.target.value) return;
                dispatch({ t: 'addPage', presetId: e.target.value });
                setAdding(false);
              }}
            >
              <option value="" disabled>Choose a template…</option>
              {GROUPED.filter((g) => g.presets.length).map((g) => (
                <optgroup key={g.group} label={g.group}>
                  {g.presets.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </optgroup>
              ))}
            </select>
          </div>
        ) : null}
        <PageStrip
          pages={active.pages}
          active={pageIndex}
          onSelect={(i) => dispatch({ t: 'selectPage', index: i })}
          onMove={(from, to) => dispatch({ t: 'movePage', from, to })}
          onDuplicate={(i) => dispatch({ t: 'duplicatePage', index: i })}
          onDelete={(i) => dispatch({ t: 'deletePage', index: i })}
        />
      </aside>

      <main className="dk-stage">
        <Stage
          key={page.id}
          preset={{ ...preset, props: { ...preset.props, ...extra } }}
          doc={page.doc}
          guides={false}
          nodeRef={nodeRef}
        />
      </main>

      <aside className="dk-panel">
        <div className="field">
          <label htmlFor="running">Running header</label>
          <input
            id="running" type="text" value={active.runningHeader}
            onChange={(e) => dispatch({ t: 'settings', runningHeader: e.target.value })}
          />
        </div>
        <div className="field">
          <div className="field-row">
            <input
              id="numbering" type="checkbox" checked={active.numbering}
              onChange={(e) => dispatch({ t: 'settings', numbering: e.target.checked })}
            />
            <label htmlFor="numbering" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 'var(--fs-body)', fontWeight: 600 }}>
              Page numbers and footer
            </label>
          </div>
          <span className="note">Covers and back pages are never numbered.</span>
        </div>

        <hr className="receipt" />

        <FieldPanel
          preset={preset}
          doc={page.doc}
          onField={(k, v) => dispatch({ t: 'field', k, v })}
          onSurface={(v) => dispatch({ t: 'surface', v })}
          onGrain={(v) => dispatch({ t: 'grain', v })}
          onVertical={(v) => dispatch({ t: 'vertical', v })}
          onCurrency={(v) => dispatch({ t: 'currency', v })}
          onAlt={(v) => dispatch({ t: 'alt', v })}
          onReset={() => dispatch({ t: 'resetPage' })}
        />

        <hr className="receipt" />
        <VoicePanel preset={preset} doc={page.doc} />
        <hr className="receipt" />
        <SequenceExport sequence={active} nodeFor={nodeFor} />
      </aside>

      {/*
        Every page, laid out offscreen at true size.

        The exporter rasterises real DOM, so a multi-page export needs every page
        actually laid out — display:none or unmounting gives html-to-image
        nothing to measure. Parked far off-canvas keeps it laid out and off every
        screen; inert and aria-hidden keep it out of the tab order and the
        accessibility tree.
      */}
      <div aria-hidden="true" inert style={{ position: 'fixed', left: -30000, top: 0, pointerEvents: 'none' }}>
        {active.pages.map((pg, i) => {
          const pr = byId(pg.presetId);
          if (!pr) return null;
          const Layout = LAYOUTS[pr.layout];
          const props = sequenceProps(active, i);
          return (
            <div key={pg.id} ref={(el) => { stagingRefs.current[i] = el; }}>
              <Layout
                w={pr.w}
                h={pr.h}
                surface={pg.doc.surface}
                grain={pg.doc.grain}
                vertical={pg.doc.vertical}
                currency={pg.doc.currency}
                {...pr.props}
                {...props}
                {...pg.doc.fields}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
