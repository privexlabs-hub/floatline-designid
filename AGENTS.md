# Working in this repository

Read `README.md` first — particularly **The export contract** and **Two bugs
worth knowing about**. Both describe non-obvious constraints that are easy to
undo by accident.

## Non-negotiable

- **Never use `var(--*)` inside inline SVG in an artboard.** html-to-image
  deep-clones SVG verbatim, the custom property is undefined in the export, and
  `fill` silently falls back to black. Use `useArt()` and pass literals.
- **Artboard text containers must be full width.** A shrink-to-fit text box is
  pinned to its exact content width in the export and has no room to re-wrap.
  `npm run verify` fails if you break this.
- **No layout or primitive may read a raw brand token.** Only `--art-*`. That is
  what makes seven surfaces work from one component.
- **Fonts stay self-hosted.** A Google Fonts link makes every export ship in
  fallback type, silently.
- **One export path.** Everything goes through `exportOne()`. A second one will
  drift.

## Before you finish

```bash
npm run typecheck && npm run lint && npm run build
npm start &
npm run verify && npm run audit
```

If you change a token, change it in `src/styles/tokens.css` first. The typed
mirror in `src/lib/tokens.ts` is small on purpose; `verify-app` fails if the two
disagree about a surface.

If you change the brand narrative, change `src/content/brand.ts` or
`src/content/verticals.ts` — the playbook, the studio's defaults and the page
metadata all read from those, so the positioning is stated once.
