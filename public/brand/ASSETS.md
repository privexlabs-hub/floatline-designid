# Floatline brand assets

Every brand file lives under this folder. Nothing brand-related lives anywhere
else in `public/`.

**Rasters are generated, never hand-placed.** `npm run assets:build` draws every
PNG from the SVG sources with `sharp`, so the favicon, the app icons and the
Open Graph cards cannot drift from the mark. The script also cross-checks the
logo SVGs against `src/lib/brand-geometry.ts` and fails if the drawn React
`<Mark/>` and the shipped files disagree.

---

## `logo/`

| File | Use |
|---|---|
| `floatline-mark.svg` | The mark alone, full colour. App icons, avatars, favicons. |
| `floatline-wordmark.svg` | Horizontal lockup on a light ground. The default. |
| `floatline-wordmark-dark.svg` | Horizontal lockup on a dark or brand-green ground. |
| `floatline-lockup-stacked.svg` | Stacked lockup, for square and centred placements. |
| `floatline-mark-mono.svg` | One colour; inherits `currentColor`. Print, embroidery, single-ink. |
| `floatline-mark-outline.svg` | Outline only. Etching, watermarks, single-weight contexts. |

The three lockups set their text in Bricolage Grotesque and **embed that face as
base64** at build time. A standalone SVG has no access to the site stylesheet, so
without it the wordmark renders in whatever the viewer happens to have — which
for a logo is simply wrong.

Clear space is **0.5× the mark's height** on every side. Minimum mark size is
20px; below 120px wide, drop the wordmark and use the mark alone.

## `favicon/`

| File | Notes |
|---|---|
| `favicon.svg` | A **deliberately simplified** mark: rounded square plus the two-tone float bar, no nodes. At 16px the five nodes close up and the full mark reads as a solid square. |
| `favicon-32.png`, `favicon-96.png` | Raster fallbacks, from `favicon.svg`. |
| `apple-touch-icon.png` | 180×180, from the full mark. |
| `icon-192.png`, `icon-512.png` | PWA icons, from the full mark. |
| `icon-maskable-512.png` | Android maskable. The mark is inset to 62% on a brand-green ground so the circle crop cannot clip it. |
| `site.webmanifest` | Web app manifest. |

## `og/`

1200×630 Open Graph cards for the site, the playbook and the studio. Drawn by
the asset script rather than exported from the studio, so `assets:build` works
with no browser and no running server.

## `textures/`

`pattern-receipt-paper.svg` — the dotted-and-dashed receipt ground, used at
6–8% opacity behind heroes and as the artboards' optional grain.
`paper-grain.svg` — a finer fractal-noise grain.

## `icons/`

Ten glyphs drawn in-house because they carry brand meaning nothing generic
does: `float-bar`, `capacity-bar`, `broadcast-fanout`, `trigger`, `branch`,
`run`, `webhook`, `connector`, `node-graph`, `receipt-rule`.

They are stroked with `currentColor`, so load them as a **CSS mask** rather than
an `<img>` if you want them to take a brand colour — an `<img>` cannot inherit
colour and will paint them black. The `.icon` class in `app.css` does this.

For everything else, Lucide is the line-icon source of truth. That is a
substitution, not a bespoke set — flag it before commissioning one.

## `fonts/`

24 self-hosted WOFF2 subsets plus `fonts.manifest.json`, which records each
face's source URL, family, weight, style, unicode range, byte length and
SHA-256. `npm run fonts:verify` re-hashes them on every build and fails if
anything has changed.

| Family | Weights | Role |
|---|---|---|
| Bricolage Grotesque | 200–800 variable (`opsz`, `wght`) | Display and headlines |
| Manrope | 200–800 variable (`wght`) | UI and body |
| IBM Plex Mono | 400, 500, 600 | Money, IDs, fractions, timestamps |

**They are self-hosted for a functional reason, not a preference.**
`html-to-image` embeds typefaces into an export by reading
`document.styleSheets[].cssRules`. A cross-origin sheet throws a `SecurityError`
there, which the library swallows — so a Google Fonts link would make every
exported asset silently ship in a fallback typeface.

Licensed under the SIL Open Font License 1.1.
