'use client';

import type { CSSProperties, ReactNode } from 'react';
import type { Surface } from '@/lib/tokens';
import { ArtProvider, paletteFor } from './art-context';

/**
 * The export node, and nothing else.
 *
 * `.artboard-export` is what exportOne() rasterises, so anything that must NOT
 * appear in the file — safe-area guides, selection outlines, the stage's
 * backdrop — has to be a SIBLING of this element, never a child.
 */
export function Artboard({
  w,
  h,
  surface,
  grain = false,
  children,
  style,
}: {
  w: number;
  h: number;
  surface: Surface;
  grain?: boolean;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <ArtProvider value={paletteFor(surface)}>
      <div
        className="artboard-export"
        data-surface={surface}
        data-grain={grain ? 'true' : 'false'}
        style={{ width: w, height: h, ...style }}
      >
        {children}
      </div>
    </ArtProvider>
  );
}
