/**
 * Preview must equal export.
 *
 * The studio's whole promise is that the artboard on screen IS the file you
 * download. html-to-image does not re-run layout from your stylesheets — it
 * clones each node with its computed styles and PINS its measured width and
 * height. Anything whose size depends on the exact text metrics therefore has
 * zero tolerance in the export, and a sub-pixel difference silently re-wraps a
 * line inside a fixed-height box. That is invisible in every "is the PNG the
 * right size / is it blank" check, so it gets its own suite.
 *
 * Method: screenshot the REAL DOM artboard with CDP, export the SAME artboard
 * with the app's own pipeline, and compare the two rasters.
 */
import { mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { launch, goto, evaluate, ORIGIN } from './lib-cdp.mjs';

const OUT = path.resolve(import.meta.dirname, '../verify-out/fidelity');

/** One per layout — the point is coverage of layout code, not of copy. */
const CASES = [
  'sq-normal', 'en-manifesto', 'co-hook', 've-launch', 'po-announce',
  'yt-tutorial', 'cv-podcast', 'cv-li-cover', 'av-float', 'ad-mpu',
  'em-newsletter', 'we-hero', 'pr-x', 'kt-console-square',
];

/**
 * Compared at a COARSE resolution on purpose.
 *
 * html-to-image re-serialises font-size with less precision than the DOM holds
 * it (255.556px comes back as 254.9px), so glyph edges and the occasional
 * line-break position differ by a hair. Comparing at full resolution measures
 * that noise — 3-11% of pixels on a text-heavy artboard — and tells you nothing.
 *
 * What actually matters is STRUCTURAL: a mark that rasterises black, a blank
 * export, wholesale colour loss. Those survive a downscale; antialiasing does
 * not.
 *
 * The tolerance also has to absorb one thing that is NOT breakage: a long
 * paragraph occasionally breaking a line one word earlier in the export,
 * because html-to-image pins each element's measured width and re-lays the text
 * at a hair-different font size. The layout stays correct — nothing overlaps or
 * clips — so it passes here. The invariant that catches real collisions is
 * asserted directly, over the whole catalog, by scripts/verify-layout.mjs.
 */
/**
 * A fixed DOWNSCALE FACTOR, not a fixed output width.
 *
 * Downscaling every canvas to the same width made the 300×250 MPU far noisier
 * than the 3000×3000 podcast cover for no interesting reason: html-to-image's
 * ~1px baseline shift is a twentieth of a coarse pixel on a big canvas and a
 * whole one on a small canvas. Dividing by a constant makes that shift the same
 * fraction everywhere, so one tolerance is meaningful for every size.
 */
const COARSE_DIVISOR = 12;

/**
 * Mean per-pixel delta (0-255) allowed at that resolution. A one-pixel baseline
 * shift — which html-to-image's font-size rounding causes constantly — moves a
 * lot of INDIVIDUAL pixels but barely moves the mean once the image is boxed
 * down. A mark rasterising black, a heading colliding with the line below, or a
 * blank export all move it a long way.
 */
const TOLERANCE = 10;

const fails = [];

async function main() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  const { page, close } = await launch({ port: 9457 });
  try {
    await goto(page, `${ORIGIN}/spike/?all=1`);
    await evaluate(page, 'new Promise(r=>{const t=setInterval(()=>{if(window.__spikeReady){clearInterval(t);r();}},50);})');
    await evaluate(page, 'document.fonts.ready');

    for (const id of CASES) {
      const meta = await evaluate(page, `window.__spikeShow(${JSON.stringify(id)})`);
      if (!meta) { fails.push(`${id}: not renderable`); console.error(`  FAIL ${id}: not renderable`); continue; }

      // Cap the raster so a 3000x3000 comparison stays quick; both sides use
      // the same scale, so the comparison is still apples to apples.
      const scale = Math.min(1, 900 / Math.max(meta.w, meta.h));

      await page.send('Emulation.setDeviceMetricsOverride', {
        width: Math.ceil(meta.w), height: Math.ceil(meta.h),
        deviceScaleFactor: scale, mobile: false,
      });
      await evaluate(page, 'new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');

      const shot = await page.send('Page.captureScreenshot', {
        format: 'png',
        clip: { x: 0, y: 0, width: meta.w, height: meta.h, scale, captureBeyondViewport: true },
      });
      const domPng = Buffer.from(shot.data, 'base64');

      const res = await evaluate(page, `window.__spikeExport(${JSON.stringify(id)}, 'png', 1)`);
      const expPng = Buffer.from(res.base64, 'base64');

      const coarseW = Math.max(8, Math.round(meta.w / COARSE_DIVISOR));
      const coarseH = Math.max(8, Math.round(meta.h / COARSE_DIVISOR));
      const [a, b] = await Promise.all([
        sharp(domPng).resize(coarseW, coarseH, { fit: 'fill' }).removeAlpha().raw().toBuffer(),
        sharp(expPng).resize(coarseW, coarseH, { fit: 'fill' }).removeAlpha().raw().toBuffer(),
      ]);

      let sum = 0;
      let worst = 0;
      for (let i = 0; i < a.length; i++) {
        const d = Math.abs(a[i] - b[i]);
        sum += d;
        if (d > worst) worst = d;
      }
      const mean = sum / a.length;

      if (mean <= TOLERANCE) {
        console.log(`  ok   ${id}: preview matches export (mean Δ ${mean.toFixed(2)}, peak ${worst})`);
      } else {
        fails.push(`${id}: mean Δ ${mean.toFixed(2)}`);
        console.error(`  FAIL ${id}: preview and export differ — mean Δ ${mean.toFixed(2)}, peak ${worst}`);
        await writeFile(path.join(OUT, `${id}-dom.png`), domPng);
        await writeFile(path.join(OUT, `${id}-export.png`), expPng);
      }
    }
  } finally {
    await close();
  }

  console.log(fails.length ? `\nverify-fidelity: ${fails.length} FAILED — see verify-out/fidelity/` : '\nverify-fidelity: preview matches export everywhere');
  process.exit(fails.length ? 1 : 0);
}

main().catch((e) => { console.error(`[verify-fidelity] ${e.stack}`); process.exit(1); });
