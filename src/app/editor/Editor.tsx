'use client';

import { useEffect, useRef, useState } from 'react';
import { useEditorState } from '@/lib/use-editor-state';
import { Stage } from '@/components/editor/Stage';
import { TemplatePicker } from '@/components/editor/TemplatePicker';
import { FieldPanel } from '@/components/editor/FieldPanel';
import { ExportPanel } from '@/components/editor/ExportPanel';
import { PRESETS } from '@/content/templates/registry';
import Link from 'next/link';

export default function Editor() {
  const { state, dispatch, docs, preset, doc, undo, redo, canUndo, canRedo } = useEditorState();
  const nodeRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [railOpen, setRailOpen] = useState(false);

  // `/` focuses the template search, the way every tool with a long list does.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '/' ) return;
      const t = e.target;
      if (t instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName)) return;
      e.preventDefault();
      setRailOpen(true);
      searchRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="ed">
      <header className="ed-top">
        <button type="button" className="btn ed-rail-toggle" onClick={() => setRailOpen((v) => !v)} aria-expanded={railOpen}>
          Templates
        </button>
        <Link href="/" className="ed-brand">
          <strong style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--fl-green-900)', letterSpacing: '-0.03em' }}>
            floatline
          </strong>
          <span className="tag">Studio</span>
        </Link>
        <span className="note" style={{ marginLeft: 'auto' }}>{PRESETS.length} templates</span>
        <button type="button" className="btn" disabled={!canUndo} onClick={undo} title="Undo (⌘Z)">Undo</button>
        <button type="button" className="btn" disabled={!canRedo} onClick={redo} title="Redo (⇧⌘Z)">Redo</button>
      </header>

      {railOpen ? <button type="button" className="ed-scrim" aria-label="Close templates" onClick={() => setRailOpen(false)} /> : null}

      <aside className="ed-rail" data-open={railOpen}>
        <TemplatePicker
          selected={state.selected}
          searchRef={searchRef}
          onSelect={(id) => { dispatch({ t: 'select', id }); setRailOpen(false); }}
        />
      </aside>

      <main className="ed-stage">
        <Stage preset={preset} doc={doc} guides={state.guides} nodeRef={nodeRef} />
      </main>

      <aside className="ed-panel">
        <FieldPanel
          preset={preset}
          doc={doc}
          onField={(k, v) => dispatch({ t: 'field', id: preset.id, k, v })}
          onSurface={(v) => dispatch({ t: 'surface', id: preset.id, v })}
          onGrain={(v) => dispatch({ t: 'grain', id: preset.id, v })}
          onVertical={(v) => dispatch({ t: 'vertical', id: preset.id, v })}
          onCurrency={(v) => dispatch({ t: 'currency', id: preset.id, v })}
          onReset={() => dispatch({ t: 'reset', id: preset.id })}
        />
        <hr className="receipt" />
        <ExportPanel
          preset={preset}
          doc={doc}
          docs={docs}
          nodeRef={nodeRef}
          scale={state.scale}
          format={state.format}
          quality={state.quality}
          guides={state.guides}
          onScale={(v) => dispatch({ t: 'scale', v })}
          onFormat={(v) => dispatch({ t: 'format', v })}
          onQuality={(v) => dispatch({ t: 'quality', v })}
          onGuides={(v) => dispatch({ t: 'guides', v })}
        />
      </aside>
    </div>
  );
}
