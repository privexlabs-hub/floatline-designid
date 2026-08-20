'use client';

import { createContext, useContext } from 'react';
import { SURFACE_ART, type ArtPalette, type Surface } from '@/lib/tokens';

/**
 * Supplies the RESOLVED artboard palette to anything that cannot use CSS
 * custom properties — which in practice means inline SVG, because
 * html-to-image deep-clones SVG subtrees verbatim and `var()` inside them
 * never resolves in an export. See SURFACE_ART for the full explanation.
 *
 * HTML elements should keep using var(--art-*): those export correctly, and
 * routing them through here would just be a second way to say the same thing.
 */
const ArtContext = createContext<ArtPalette>(SURFACE_ART.paper);

export const ArtProvider = ArtContext.Provider;

export function useArt(): ArtPalette {
  return useContext(ArtContext);
}

export function paletteFor(surface: Surface): ArtPalette {
  return SURFACE_ART[surface];
}
