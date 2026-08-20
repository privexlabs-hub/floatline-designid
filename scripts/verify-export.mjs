/**
 * Proves the export pipeline produces the bytes it claims to.
 *
 * The important assertion is the third one: a PNG can be the right size and
 * still be wrong, because a font that failed to embed produces a file that is
 * perfectly valid and set in Helvetica. So we look at actual pixels.
 */
import { mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { launch, goto, evaluate, ORIGIN } from './lib-cdp.mjs';

const OUT = path.resolve(import.meta.dirname, '../verify-out/export');

/** id, expected canvas, and the surface's flatten colour for the JPEG check. */
const CASES = [
  { id: 'cv-podcast', w: 3000, h: 3000, format: 'png', scale: 1 },
  { id: 've-quote', w: 1080, h: 1920, format: 'jpeg', scale: 1, flatten: [26, 20, 16] },
  { id: 'sq-normal', w: 1080, h: 1080, format: 'png', scale: 2 },
  { id: 'sq-normal', w: 1080, h: 1080, format: 'webp', scale: 1 },
  { id: 'ad-mpu', w: 300, h: 250, format: 'png', scale: 3 },
  { id: 'sq-normal', w: 1080, h: 1080, format: 'pdf', scale: 1 },
  { id: 'sq-normal', w: 1080, h: 1080, format: 'svg', scale: 1 },
];

const fails = [];
const ok = (m) => console.log(`  ok   ${m}`);
const bad = (m) => { console.error(`  FAIL ${m}`); fails.push(m); };

const near = (a, b, tol = 26) => Math.abs(a - b) <= tol;

async function main() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  const { page, close } = await launch({ port: 9455 });
  try {
    await goto(page, `${ORIGIN}/spike/`);
    await evaluate(page, 'new Promise(r => { const t = setInterval(() => { if (window.__spikeReady) { clearInterval(t); r(); } }, 50); })');
    await evaluate(page, 'document.fonts.ready');

    const families = await evaluate(page, `JSON.stringify({
      display: document.fonts.check('700 48px "Bricolage Grotesque"'),
      sans: document.fonts.check('600 16px "Manrope"'),
      mono: document.fonts.check('500 16px "IBM Plex Mono"'),
    })`);
    const f = JSON.parse(families);
    for (const [k, v] of Object.entries(f)) {
      if (v) ok(`webfont loaded in page: ${k}`);
      else bad(`webfont NOT loaded in page: ${k}`);
    }

    for (const c of CASES) {
      const label = `${c.id} · ${c.format} @${c.scale}x`;
      let res;
      try {
        res = await evaluate(page, `window.__spikeExport(${JSON.stringify(c.id)}, ${JSON.stringify(c.format)}, ${c.scale})`);
      } catch (e) {
        bad(`${label}: export threw — ${e.message}`);
        continue;
      }

      const buf = Buffer.from(res.base64, 'base64');
      const file = path.join(OUT, `${c.id}-${c.format}-${c.scale}x.${c.format === 'jpeg' ? 'jpg' : c.format}`);
      await writeFile(file, buf);

      if (buf.length === 0) { bad(`${label}: zero bytes`); continue; }
      ok(`${label}: ${(buf.length / 1024).toFixed(0)} KB`);

      if (c.format === 'pdf') {
        if (buf.subarray(0, 4).toString('latin1') === '%PDF') ok(`${label}: valid PDF header`);
        else bad(`${label}: not a PDF`);
        continue;
      }
      if (c.format === 'svg') {
        const s = buf.toString('utf8');
        if (s.includes('<svg')) ok(`${label}: valid SVG root`);
        else bad(`${label}: not an SVG`);
        if (s.includes('foreignObject')) ok(`${label}: foreignObject present (as documented)`);
        continue;
      }

      // 1. Exact dimensions. pixelRatio is passed explicitly precisely so this
      //    never depends on the machine's devicePixelRatio.
      const img = sharp(buf);
      const meta = await img.metadata();
      const wantW = c.w * c.scale;
      const wantH = c.h * c.scale;
      if (meta.width === wantW && meta.height === wantH) ok(`${label}: exactly ${wantW}×${wantH}`);
      else bad(`${label}: expected ${wantW}×${wantH}, got ${meta.width}×${meta.height}`);

      // 2. Not blank. iOS-style silent failures return a valid, empty image.
      const stats = await img.stats();
      const spread = Math.max(...stats.channels.map((ch) => ch.max - ch.min));
      if (spread > 24) ok(`${label}: non-blank (channel spread ${spread})`);
      else bad(`${label}: looks blank (channel spread ${spread})`);

      // 3. JPEG has no alpha — a transparent artboard would rasterise onto
      //    BLACK. Check a corner really is the surface colour.
      if (c.flatten) {
        const { data } = await sharp(buf).extract({ left: 2, top: 2, width: 4, height: 4 }).raw().toBuffer({ resolveWithObject: true });
        const [r, g, b] = [data[0], data[1], data[2]];
        if (near(r, c.flatten[0]) && near(g, c.flatten[1]) && near(b, c.flatten[2])) {
          ok(`${label}: flattened onto the surface colour, not black`);
        } else {
          bad(`${label}: corner is rgb(${r},${g},${b}), expected ~rgb(${c.flatten.join(',')})`);
        }
      }
    }

    // 4. The MARK survived rasterisation.
    //    html-to-image deep-clones SVG subtrees VERBATIM — it does not resolve
    //    computed styles inside them. Any `var(--art-*)` in the logo therefore
    //    comes out undefined in the export and `fill` falls back to BLACK, so
    //    every mark rasterises as a solid dark square. Nothing else in this
    //    suite notices: the file is the right size, non-blank, and correctly
    //    typeset. So we look for the float bar's amber directly.
    {
      const shot = await evaluate(page, `window.__spikeExport('cv-podcast','png',1)`);
      const amber = await countNear(Buffer.from(shot.base64, 'base64'), [232, 155, 44], 30);
      if (amber > 200) ok(`logo float bar exported in brand amber (${amber} px)`);
      else bad(`logo float bar is missing from the export (${amber} amber px) — SVG fills must be literals, never var()`);

      const dark = await countNear(Buffer.from(shot.base64, 'base64'), [0, 0, 0], 18);
      if (dark < 2000) ok(`no black fallback block in the export (${dark} near-black px)`);
      else bad(`${dark} near-black pixels — an SVG fill probably fell back to its initial value`);
    }

    // 5. The webfont actually made it into the FILE, not just the page. A dark
    //    ink pixel count that collapses would mean fallback type or no type.
    const png = await evaluate(page, `window.__spikeExport('sq-normal','png',1)`);
    const inkPixels = await countDark(Buffer.from(png.base64, 'base64'));
    if (inkPixels > 4000) ok(`embedded type rendered (${inkPixels} dark pixels)`);
    else bad(`too few dark pixels (${inkPixels}) — type probably did not embed`);
  } finally {
    await close();
  }

  console.log(fails.length ? `\nverify-export: ${fails.length} FAILED` : '\nverify-export: all checks passed');
  process.exit(fails.length ? 1 : 0);
}

/** Pixels within `tol` of an RGB triple, on every channel. */
async function countNear(buf, [tr, tg, tb], tol) {
  const { data, info } = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let n = 0;
  for (let i = 0; i < info.width * info.height * 3; i += 3) {
    if (Math.abs(data[i] - tr) <= tol && Math.abs(data[i + 1] - tg) <= tol && Math.abs(data[i + 2] - tb) <= tol) n++;
  }
  return n;
}

async function countDark(buf) {
  const { data, info } = await sharp(buf).greyscale().raw().toBuffer({ resolveWithObject: true });
  let n = 0;
  for (let i = 0; i < info.width * info.height; i++) if (data[i] < 90) n++;
  return n;
}

main().catch((e) => { console.error(`[verify-export] ${e.stack}`); process.exit(1); });
