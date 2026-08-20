'use client';

import { useEffect, useState } from 'react';
import { TOC } from '@/content/playbook';

/**
 * Scroll-spy index. The rootMargin biases the observer towards the top of the
 * viewport so the highlighted entry is the section you are READING, not merely
 * the one that most recently touched the bottom edge.
 */
export function Toc() {
  const [active, setActive] = useState<string>('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const ids = TOC.filter((t) => t.kind === 'item').map((t) => (t as { id: string }).id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button type="button" className="btn pb-toc-toggle" onClick={() => setOpen(true)} aria-expanded={open}>
        Contents
      </button>
      {open ? <button type="button" className="pb-scrim" aria-label="Close contents" onClick={() => setOpen(false)} /> : null}
      <nav className="pb-toc" data-open={open} aria-label="Playbook contents">
        {TOC.map((t) =>
          t.kind === 'group' ? (
            <div className="pb-toc-group" key={t.label}>{t.label}</div>
          ) : (
            <a key={t.id} href={`#${t.id}`} aria-current={active === t.id} onClick={() => setOpen(false)}>
              <i>{t.n}</i>
              <span>{t.label}</span>
            </a>
          )
        )}
      </nav>
    </>
  );
}
