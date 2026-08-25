'use client';

import { byId } from '@/content/templates/registry';
import { SURFACE_ART } from '@/lib/tokens';
import type { Page } from '@/lib/sequences';

/**
 * The page list.
 *
 * Chips coloured by each page's surface, not live thumbnails. A thumbnail per
 * page means re-rendering the whole sequence on every keystroke, and a
 * twenty-page A4 document is twenty 1240x1754 artboards; the colour and the
 * template name identify a page perfectly well without that cost.
 *
 * Reorder is buttons rather than drag: it works on a touch screen, it works
 * from the keyboard, and it needs no dependency.
 */
export function PageStrip({
  pages,
  active,
  onSelect,
  onMove,
  onDuplicate,
  onDelete,
}: {
  pages: Page[];
  active: number;
  onSelect: (i: number) => void;
  onMove: (from: number, to: number) => void;
  onDuplicate: (i: number) => void;
  onDelete: (i: number) => void;
}) {
  return (
    <ol className="strip" aria-label="Pages">
      {pages.map((page, i) => {
        const preset = byId(page.presetId);
        const art = SURFACE_ART[page.doc.surface];
        const current = i === active;
        return (
          <li key={page.id} className="strip-item" data-current={current}>
            <button
              type="button"
              className="strip-chip"
              aria-current={current}
              onClick={() => onSelect(i)}
              style={{ background: art.bg, color: art.fg, borderColor: current ? 'var(--accent)' : art.rule }}
            >
              <span className="strip-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="strip-name">{preset?.name ?? page.presetId}</span>
              <span aria-hidden="true" className="strip-bar" style={{ background: art.signal }} />
            </button>

            <div className="strip-actions">
              <button
                type="button" className="strip-act" title="Move up" aria-label={`Move page ${i + 1} up`}
                disabled={i === 0} onClick={() => onMove(i, i - 1)}
              >↑</button>
              <button
                type="button" className="strip-act" title="Move down" aria-label={`Move page ${i + 1} down`}
                disabled={i === pages.length - 1} onClick={() => onMove(i, i + 1)}
              >↓</button>
              <button
                type="button" className="strip-act" title="Duplicate" aria-label={`Duplicate page ${i + 1}`}
                onClick={() => onDuplicate(i)}
              >⧉</button>
              <button
                type="button" className="strip-act" title="Delete" aria-label={`Delete page ${i + 1}`}
                disabled={pages.length < 2} onClick={() => onDelete(i)}
              >✕</button>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
