# Floatline — brand system

The Floatline brand playbook, asset studio, design-system reference and UI kits.
Built from the Claude Design project **Floatline Design System**
(`3ac21251-98ed-4818-969a-75397ae713fe`), which only runs inside Claude Design's
canvas runtime. This repository is that system rebuilt as a standalone static
site — and repositioned.

**Frontend only.** No backend, no API routes, no middleware, no image optimizer,
no telemetry. Nothing is fetched from a third party at runtime; that is asserted
by `npm run verify`, not assumed. Exports are rendered and encoded in the
browser and never uploaded.

---

## The repositioning

The imported system defined Floatline as *“a WhatsApp coordination layer for
Nigerian super-agents who manage 20–50 POS sub-agents.”* Every token comment,
voice rule and UI kit was written against that single vertical.

Floatline is now positioned **category-first**: a workflow automation brand
whose channels are many — WhatsApp, SMS, voice, email, Slack, webhooks, API —
and whose verticals are named and documented.

| Was | Is |
|---|---|
| “WhatsApp coordination layer” | Workflow automation for operators who run networks |
| Channel = WhatsApp | One of seven channels; the product is channel-agnostic |
| Audience = Nigerian super-agent | Anyone coordinating a distributed network |
| ₦ hardcoded | Currency-aware; ₦ remains the default in the agent-networks vertical |

**The roots are kept deliberately.** The name, the lowercase wordmark, brand
green `#0B6B3A`, amber `#E89B2C`, critical red `#C8362A`, warm paper `#F7F2E8`,
warm ink `#1A1410`, warm-tinted shadows, the **receipt rule**, the **float
bar**, the **status dot** and the **read fraction** all survive unchanged. They
are what keep this from becoming another blue-violet SaaS brand.

Agent networks — POS, float, super-agents, ₦ — is now the **flagship vertical**
of five, not the whole brand. The five live in `src/content/verticals.ts`, and
each supplies a copy pack the playbook and the studio both read, so switching
vertical re-fills all 168 templates with the right vocabulary.

---

## Routes

| Route | What it is |
|---|---|
| `/` | The five doors, and the thesis in one screen |
| `/playbook` | 18 sections: positioning, channels, voice, visual identity, formats, cadence, governance |
| `/editor` | The studio — 191 templates, live editing, real export |
| `/decks` | Ordered sequences — carousels, reports, whitepapers, proposals, pitch decks |
| `/design-system` | Foundations read back out of the live stylesheet, plus every downloadable asset |
| `/ui-kits` | The brand on product surfaces, as live responsive React |
| `/spike` | Not linked. The harness the verification scripts drive. |

---

## The studio

**191 templates across 14 layouts and 15 groups**, covering every format in the
brief plus the additions noted below.

| Group | Count | Group | Count |
|---|---|---|---|
| Square · 1080×1080 | 25 | Cover · Banners | 12 |
| Engagement · 1080×1080 | 23 | Avatar · 400×400 | 8 |
| Carousel · 1080×1080 | 12 | Ads · Multi-format | 13 |
| Vertical · 1080×1920 | 17 | Email · Multi-format | 11 |
| Portrait · 1080×1350 | 11 | Web · Multi-format | 14 |
| YouTube · 1280×720 | 15 | Profile · Reference | 3 |
| Document · A4 | 14 | Product · Kit showcase | 4 |
| Presentation · 1920×1080 | 9 | | |

Seven surfaces (paper, canvas, ink, green, amber, mono, inverted), an optional
receipt-paper grain, five verticals and six currencies apply to every template.
Artboard theming runs entirely through a handful of `--art-*` custom properties,
which is what lets one component render correctly on all seven grounds instead
of needing seven components.

Export is **PNG, JPEG, WebP, SVG and PDF at 1×, 2× and 3×** — one asset at a
time, a whole group, or all 191 as a ZIP with an `alt-text.csv` sidecar (because
platforms drop alt text on upload, and whoever posts the image will not retype
it). Alt text is generated from the copy and can be overridden per design.

---

## Decks and documents

A carousel and a report are the same problem — N artboards in an order somebody
controls — so `/decks` is one engine for both. Add, duplicate, reorder and delete
pages; export the whole run as **one ordered PDF** or as numbered files.

Eight starting points, each composed from templates that already exist rather
than from a second copy of the artwork: LinkedIn carousel, story sequence,
report, whitepaper, case study, proposal, one-pager and pitch deck.

- **The table of contents is computed**, not typed. It reads the real pages and
  their real numbers, so it cannot go stale when a page moves.
- **Covers and back pages are never numbered**, and numbering starts after the
  cover.
- **Pages carry stable ids.** The sibling project this pattern came from keys
  slides by array index and has no reorder at all; both were avoidable.
- **`filenameFor`'s `slide` parameter finally has a caller.** It shipped in
  Phase 1 and was never passed — a deck page and a single artboard are named by
  the same function.

### PDF page size

Page boxes are in **points, computed from each canvas's design resolution**, so
a report prints as real A4 (595 × 842pt at 150dpi) while a 1080px square is
810pt at 96dpi. jsPDF's `px` unit would have made every unit a CSS pixel, and an
A4 page drawn at 150dpi opened at 23 × 33 inches.

---

## Voice checking

The playbook's governance section says: *"Where a rule can be a check that fails
a build, it is one."* So the voice rules are now code, in `src/lib/voice.ts`,
read from the same `VOICE` and `NON_NEGOTIABLES` constants the playbook renders.

They run in two places from one definition:

- **In the studio**, as a panel under the fields. Each finding names the
  offending text, what to write instead, and the playbook section it comes from.
  Advisory — the playbook is explicit that a human judges whether copy *sounds*
  right, and a regex cannot.
- **As a build gate**, `npm run verify:voice`, over every template's default
  copy. It fails on `error` severity only: exclamation points, SaaS abstraction
  (`leverage`, `seamless`, `empower`, `unlock` …), `NGN 25,000` instead of
  `₦25,000`, and “users”.

Warn-level rules are deliberately outside the gate. *“64% of inbound answered
from the knowledge base”* is a real statistic with no meaningful denominator, and
a build that refused it would be wrong.

### The export contract

Everything routes through one primitive, `exportOne()` in
`src/lib/export-image.ts`. There is exactly one on purpose: both reference
projects this was ported from had grown a second export path, and the two
drifted until the same artboard produced a 3240px file from one screen and a
1080px file from another.

- **Exact dimensions.** `pixelRatio` is always passed explicitly. Left to
  default it picks up `devicePixelRatio`, and the same click yields 1080px on
  one machine and 2160px on a retina one.
- **The 16.7 MP canvas limit is probed, not assumed.** iOS Safari silently
  no-ops draws above it and returns a *blank* image rather than throwing, so the
  code draws one pixel in the far corner and reads it back. Scale steps 3 → 2 →
  1, and any clamp is reported in the UI rather than applied quietly.
- **Fonts settle first.** `document.fonts.ready` plus a double `rAF`. Without
  it the first export of a session renders in fallback type.
- **JPEG, WebP and PDF are flattened onto the surface colour.** They have no
  alpha; without an explicit background a transparent artboard rasterises onto
  black.
- **A batch computes the font embedding once.** It is the most expensive step
  and identical for every artboard.
- **Bulk export renders off-screen**, one artboard at a time, in a separate
  React root parked at `left: -20000px` — not `display: none`, which
  html-to-image cannot measure. One failed artboard writes to `_errors/` and the
  batch continues.

PDF is a raster image inside a PDF page: the text is not selectable. SVG is an
HTML snapshot in a `<foreignObject>`, not vector type. Both are stated in the
export panel, not hidden.

---

## Bugs worth knowing about

All were found by looking at exported pixels rather than at the screen, and each
has a guard that is proven to fail without the fix.

**1. Every logo rasterised as a solid black square.**
html-to-image deep-clones inline SVG subtrees *verbatim* — it does not apply
computed styles to them. So `fill: var(--art-bg)` survived the clone unresolved,
the custom property was undefined inside the exported `<foreignObject>`, and
`fill` fell back to its initial value: black. Nothing else noticed — the files
were the right size, non-blank and correctly typeset.
**Fix:** SVG colours come from `SURFACE_ART` as literals, via `useArt()`.
**Guard:** `verify-export` counts brand-amber pixels in the exported mark —
4,792 with the fix, 0 without.

**2. A heading collided with the paragraph below it, in the export only.**
html-to-image pins every cloned element to its measured width and height. A text
block sized by `align-items: flex-start` measures *exactly* as wide as its
longest line, so the pinned width has zero tolerance: a hair of metric
difference re-wrapped the line, and the second line overflowed a box only tall
enough for one.
**Fix:** artboard text containers are explicitly full width.
**Guard:** `verify-layout` checks the *cause* across all 168 templates — no
wrapping text block may sit in a box narrower than its single-column parent.

That guard checks the cause rather than the symptom because the symptom is not
observable from the page: injecting the clone into this document does not
reproduce it (our stylesheets are present here and absent inside the exported
`foreignObject`), and a whole-image pixel diff cannot separate it from ordinary
antialiasing — measured, on the 3000×3000 cover, at a mean delta of **6.1**
broken against **5.2** healthy.

**3. Text one rounding error from re-wrapping.**
The same pinning, a subtler trigger: a block whose *last line is nearly full*
gains a line in the export and spills, even though its container is full width.
A carousel headline that read across two lines on screen broke onto three in the
PDF and sat on top of the lede.
**Guard:** `verify-layout` squeezes every text block by 1.5% and fails if the
line count goes up — measuring the risk directly rather than guessing which
metric moved. It found six fragile templates out of 191, including the one that
broke.

**4. Content taller than its page.**
A document page whose copy overran its own artboard put the running footer on
top of the last line.
**Guard:** `verify-layout` also compares each artboard's scroll height to its
box. It found twelve on the day it was written — including one email template
that had been shipping broken since Phase 1.

---

## Verification

```bash
npm install
npm run fonts:fetch      # one-time: acquire the self-hosted faces
npm run fonts:css        # generate src/styles/fonts.css from the manifest
npm run assets:build     # favicons, app icons, OG cards, embedded wordmarks

npm run typecheck && npm run lint
npm run build            # prebuild gate: verify-fonts

npm start                # serves out/ on :4321
npm run verify           # app · voice · layout · export · sequences · fidelity
npm run verify:voice     # the copy gate on its own
npm run audit            # 6 routes × 7 widths
```

| Suite | What it proves |
|---|---|
| `verify-app` | Every route renders with no console errors; **zero third-party requests**; all three brand faces really load; `artboard.css` and `tokens.ts` agree on all 7 surfaces; **every text pair clears WCAG AA**. |
| `verify-voice` | No template ships copy that breaks a stated brand rule. |
| `verify-layout` | All 191 templates lay out with slack — nothing overflows its page, no shrink-to-fit box, no text a rounding error from re-wrapping. |
| `verify-export` | Exact pixel dimensions in all 5 formats at 1×–3×; non-blank; JPEG flattened onto the surface colour, not black; the logo survives rasterisation; webfonts embedded. |
| `verify-sequences` | A deck exports as one ordered PDF with a page per slide; a document's pages are real A4; filenames are zero-padded and sort into order; an uploaded customer logo is in the PNG. |
| `verify-fidelity` | What the stage shows is what the file contains, across 17 layouts. |
| `audit-responsive` | 6 routes × 7 widths. No sideways scroll, no over-wide element outside `.scroll-x`, no tap target under 44px. |

All headless-Chrome scripts drive Chrome over raw CDP through Node's built-in
`WebSocket` — no Puppeteer. Set `CHROME_PATH` if Chrome is installed elsewhere,
`ORIGIN` to point at a different server.

---

## Responsive

Breakpoints at 360 / 414 / 768 / 1024 / 1440 / 1920, audited at 320 as well.
Everything folds in a documented order: side annotations drop, the index rail
becomes a drawer that closes on Escape, grids go to one column, and the studio's
three panes become a stage with a bottom sheet.

**Fixed artboards are artwork at true pixel size and are never squeezed.** They
scale with a CSS transform inside a `.scroll-x` viewport — an 1080px artboard
laid out at 380px would reflow, and the preview would no longer be the file.

---

## Deviations from the imported design system

Each is a considered decision, not a slip.

1. **“Avatar · Radial (campaign)” is “Avatar · Float (campaign)”.** The brief
   listed a radial variant; the brand's own rule is *“never invent a gradient —
   this is a flat-colour brand on warm paper.”* The campaign slot is flat
   concentric bands built from the logo's float bar. Same intent, no rule broken.
2. **`--wa-*` became a family.** The imported tokens had one WhatsApp surface
   block. It now has siblings for SMS, Slack, email and web, and the chat kit
   takes a `channel` prop. Floatline is not a WhatsApp product.
3. **The favicon is a simplified mark.** The five nodes disappear below ~24px.
4. **`text-wrap: balance` is not used inside artboards.** It re-breaks lines in
   the export's detached rendering context, so the preview and the file disagree.
5. **A 13th layout, `kit`, was added.** The imported system's two richest
   artefacts are the console and the conversation surface, and nothing in the
   social catalog could show either.
6. **Templates were added beyond the brief** — integration, changelog, security,
   pricing, ROI, workflow anatomy, objection handling, tutorial, before/after,
   GitHub social, MPU, onboarding, digest, docs and more. Each is marked in its
   preset file.
7. **Lucide remains a substitution.** Ten brand glyphs are drawn in-house; there
   is still no bespoke Floatline icon set, and that should be flagged before
   anyone commissions one.
8. **`--fl-amber-800` was added to the ramp.** Amber `#E89B2C` on warm paper
   measures **2.06:1** — a WCAG failure even at display size — and it was being
   used for 20px eyebrow labels. No existing token changed: amber is still
   `#E89B2C` for the float bar, chip fills and the logo, where the text rules do
   not apply. Amber *type* on a light ground uses `#8A5A12`, the lightest amber
   that clears 4.5:1 on paper, canvas and the amber tint (5.30 / 5.57 / 5.27).
   `/design-system` shows the measurements.
9. **Image fields are for customer logos and product screenshots only.** The
   `image` type shipped in Phase 1 with no producer and no consumer. It is wired
   now, within non-negotiable #7 — avatars stay initials on a colour, and there
   is still no stock photography. Uploads are downscaled to 1600px before they
   enter `localStorage`, because a 4 MB photo becomes 5.5 MB of base64 and would
   evict everything else.

## Known limits

- PDF is raster; SVG is an HTML snapshot in a `<foreignObject>`.
- Template state persists to `localStorage` only. There is no cloud sync,
  because there is no backend.
- Images a user adds are read to a data URL and stay in the browser. They are
  never uploaded — and a data URL is same-origin, so it survives the export
  canvas.
- Platform sizes and safe areas were checked on **2026-08-19**
  (`VERIFIED_ON` in `src/lib/artboard-sizes.ts`). Platforms change crop rules
  without notice; re-check when that date is stale.
- The brand was originated in the imported system, not honoured from a prior
  identity. Confirm the name with the founder before launch.

Node 20+.
