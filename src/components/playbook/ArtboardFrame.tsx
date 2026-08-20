'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { LAYOUTS, byId } from '@/content/templates/registry';
import { defaultsOf } from '@/content/templates/types';
import type { Surface } from '@/lib/tokens';

/**
 * Renders a REAL preset from the studio's registry, scaled to fit.
 *
 * Deliberately not a screenshot or a bespoke illustration: the playbook can
 * only show an example the studio can actually produce, and it cannot go stale
 * when a template changes. The caption links straight to that template.
 */
export function ArtboardFrame({
  presetId,
  label,
  surface,
  maxHeight = 380,
}: {
  presetId: string;
  label?: string;
  surface?: Surface;
  maxHeight?: number;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.2);
  const preset = byId(presetId);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !preset) return;
    const fit = () => {
      const w = host.clientWidth;
      if (w) setScale(Math.min(w / preset.w, maxHeight / preset.h));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(host);
    return () => ro.disconnect();
  }, [preset, maxHeight]);

  if (!preset) return null;
  const Layout = LAYOUTS[preset.layout];

  return (
    <figure className="pb-frame">
      <div className="pb-frame-inner" ref={hostRef} style={{ height: preset.h * scale }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: preset.w, height: preset.h }}>
          <Layout
            w={preset.w}
            h={preset.h}
            surface={surface ?? preset.surface}
            {...preset.props}
            {...defaultsOf(preset)}
          />
        </div>
      </div>
      <figcaption>
        <span>{label ?? preset.name} · {preset.w}×{preset.h}</span>
        <Link href={`/editor/?t=${preset.id}`}>Open in the studio →</Link>
      </figcaption>
    </figure>
  );
}
