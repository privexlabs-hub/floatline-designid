'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import { GROUPED } from '@/content/templates/registry';

export function TemplatePicker({
  selected,
  onSelect,
  searchRef,
}: {
  selected: string;
  onSelect: (id: string) => void;
  searchRef?: React.RefObject<HTMLInputElement | null>;
}) {
  const [q, setQ] = useState('');
  const query = useDeferredValue(q).trim().toLowerCase();

  const groups = useMemo(
    () =>
      GROUPED.map((g) => ({
        ...g,
        presets: query
          ? g.presets.filter(
              (p) => p.name.toLowerCase().includes(query) || g.group.toLowerCase().includes(query)
            )
          : g.presets,
      })).filter((g) => g.presets.length > 0),
    [query]
  );

  const count = groups.reduce((n, g) => n + g.presets.length, 0);

  return (
    <nav aria-label="Templates">
      <div style={{ padding: 'var(--sp-3) var(--sp-4)', position: 'sticky', top: 0, background: 'var(--bg-elev)', borderBottom: '1px solid var(--border)', zIndex: 1 }}>
        <div className="field" style={{ margin: 0 }}>
          <label htmlFor="tpl-search">Search templates</label>
          <input
            id="tpl-search"
            ref={searchRef}
            type="text"
            className="ed-search"
            placeholder="Press / to search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <span className="field-count">{count} templates</span>
        </div>
      </div>

      {groups.map((g) => (
        <section key={g.group}>
          <h2 className="ed-group fl-micro" style={{ margin: 0 }}>{g.group}</h2>
          {g.presets.map((p) => (
            <button
              key={p.id}
              type="button"
              className="ed-item"
              aria-current={p.id === selected}
              onClick={() => onSelect(p.id)}
            >
              {p.name}
            </button>
          ))}
        </section>
      ))}

      {count === 0 ? <p className="note" style={{ padding: 'var(--sp-4)' }}>No template matches “{q}”.</p> : null}
    </nav>
  );
}
