/**
 * The Phase 2 surfaces, driven through their real UI.
 *
 * Everything here clicks the same buttons a person would, rather than calling
 * the export functions directly — the point is to prove the wiring, not the
 * primitives, which verify-export already covers.
 *
 * Three things are asserted that nothing else can see:
 *   1. A deck exports as ONE pdf with one page per slide, in order.
 *   2. A document's PDF pages are real A4, not a 20-inch square. The page box is
 *      computed from each canvas's design resolution, and getting that wrong is
 *      invisible until someone prints it.
 *   3. An uploaded customer logo survives rasterisation into the file. The
 *      `image` field type shipped in Phase 1 with no producer and no consumer,
 *      so "it renders on screen" is not enough — it has to be in the PNG.
 */
import { writeFile, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { launch, goto, evaluate, ORIGIN } from './lib-cdp.mjs';

const OUT = path.resolve(import.meta.dirname, '../verify-out/sequences');

const fails = [];
const ok = (m) => console.log(`  ok   ${m}`);
const bad = (m) => { console.error(`  FAIL ${m}`); fails.push(m); };

/** A4 in points, to a tolerance that absorbs the 150dpi rounding. */
const A4 = { w: 595.28, h: 841.89 };
const near = (a, b, tol = 1.5) => Math.abs(a - b) <= tol;

const CAPTURE = `(() => {
  window.__cap = [];
  const orig = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (this.download && this.href.startsWith('blob:')) { window.__cap.push({ name: this.download, href: this.href }); return; }
    return orig.apply(this, arguments);
  };
  return 1;
})()`;

const WAIT_CAPTURE = `new Promise((res, rej) => {
  const started = Date.now();
  const t = setInterval(() => {
    if (window.__cap.length) { clearInterval(t); res(1); }
    else if (Date.now() - started > 120000) { clearInterval(t); rej(new Error('export never produced a file')); }
  }, 300);
})`;

const READ_CAPTURE = `(async () => {
  const c = window.__cap[0];
  const buf = new Uint8Array(await (await fetch(c.href)).arrayBuffer());
  let bin = ''; for (let i = 0; i < buf.length; i += 8192) bin += String.fromCharCode(...buf.subarray(i, i + 8192));
  return JSON.stringify({ name: c.name, base64: btoa(bin) });
})()`;

/** Start a named sequence from a clean slate and export it as a single PDF. */
async function exportStarter(page, starter) {
  // Cleared from the landing page, not from /decks — that route re-persists
  // whatever it is holding a few hundred milliseconds after mount, and would
  // simply write the old sequence straight back.
  await goto(page, `${ORIGIN}/`);
  await evaluate(page, `localStorage.removeItem('floatline.sequences.v1'); 1`);
  await goto(page, `${ORIGIN}/decks/`);
  await evaluate(page, 'document.fonts.ready');

  const pages = await evaluate(page, `(async () => {
    const b = [...document.querySelectorAll('.starter')].find(x => x.textContent.trim().startsWith(${JSON.stringify(starter)}));
    if (!b) throw new Error('no starter called ${starter}');
    b.click();
    await new Promise(r => setTimeout(r, 2000));
    return document.querySelectorAll('.strip-chip').length;
  })()`);

  await evaluate(page, CAPTURE);
  await evaluate(page, `(async () => {
    // Untick the per-page raster so the PDF is the only file, and downloads directly.
    const png = [...document.querySelectorAll('.swatch')].find(s => s.textContent.trim() === 'PNG' && s.getAttribute('aria-pressed') === 'true');
    if (png) png.click();
    await new Promise(r => setTimeout(r, 250));
    [...document.querySelectorAll('button')].find(x => /^Download/.test(x.textContent.trim())).click();
    return 1;
  })()`);
  await evaluate(page, WAIT_CAPTURE);
  const { name, base64 } = JSON.parse(await evaluate(page, READ_CAPTURE));
  return { pages, name, buf: Buffer.from(base64, 'base64') };
}

function pdfFacts(buf) {
  const s = buf.toString('latin1');
  return {
    isPdf: s.slice(0, 5) === '%PDF-',
    pages: (s.match(/\/Type\s*\/Page[^s]/g) || []).length,
    boxes: [...new Set(s.match(/MediaBox \[[^\]]*\]/g) || [])],
  };
}

async function main() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  const { page, close } = await launch({ port: 9486 });
  try {
    await page.send('Emulation.setDeviceMetricsOverride', { width: 1500, height: 1000, deviceScaleFactor: 1, mobile: false });

    /* 1 — a deck is one ordered PDF ------------------------------------ */
    {
      const { pages, name, buf } = await exportStarter(page, 'LinkedIn carousel');
      await writeFile(path.join(OUT, name), buf);
      const f = pdfFacts(buf);

      if (pages === 12) ok(`carousel deck built with ${pages} pages`);
      else bad(`carousel deck has ${pages} pages, expected 12`);

      if (f.isPdf) ok(`${name} is a PDF`);
      else bad(`${name} is not a PDF`);

      if (f.pages === pages) ok(`the PDF holds one page per slide (${f.pages})`);
      else bad(`the PDF holds ${f.pages} pages for ${pages} slides`);

      const box = /MediaBox \[0 0 ([\d.]+) ([\d.]+)\]/.exec(f.boxes[0] ?? '');
      if (box && near(+box[1], 810, 2) && near(+box[2], 810, 2)) ok('square pages are 810pt — 1080px at 96dpi');
      else bad(`square page box is ${f.boxes[0]}, expected 810 x 810`);
    }

    /* 2 — a document's PDF is real A4 ---------------------------------- */
    {
      const { pages, name, buf } = await exportStarter(page, 'Report');
      await writeFile(path.join(OUT, name), buf);
      const f = pdfFacts(buf);

      if (f.pages === pages) ok(`the report PDF holds one page per page (${f.pages})`);
      else bad(`the report PDF holds ${f.pages} pages for ${pages} pages`);

      if (f.boxes.length === 1) ok('every page in the report shares one page box');
      else bad(`the report mixes ${f.boxes.length} page sizes: ${f.boxes.join(' ')}`);

      const box = /MediaBox \[0 0 ([\d.]+) ([\d.]+)\]/.exec(f.boxes[0] ?? '');
      if (box && near(+box[1], A4.w) && near(+box[2], A4.h)) {
        ok(`document pages are ${(+box[1]).toFixed(0)} x ${(+box[2]).toFixed(0)}pt — real A4`);
      } else {
        bad(`document page box is ${f.boxes[0]}, expected A4 (${A4.w} x ${A4.h}pt)`);
      }
    }

    /* 3 — numbered, ordered filenames ---------------------------------- */
    {
      await goto(page, `${ORIGIN}/decks/`);
      await evaluate(page, 'document.fonts.ready');
      const names = JSON.parse(await evaluate(page, `(async () => {
        await new Promise(r => setTimeout(r, 800));
        return JSON.stringify([...document.querySelectorAll('.manifest div')].map(d => d.textContent));
      })()`));
      const numbered = names.filter((n) => /-slide-\d\d\./.test(n));
      if (numbered.length >= 2) ok(`export names are zero-padded and ordered (${numbered[0]} … )`);
      else bad(`no zero-padded slide filenames in the manifest: ${names.slice(0, 3).join(', ')}`);

      const sorted = [...numbered].sort();
      if (sorted.join() === numbered.join()) ok('filenames sort into page order');
      else bad('filenames do not sort into page order');
    }

    /* 4 — an uploaded logo reaches the file ---------------------------- */
    {
      // Magenta appears nowhere in the brand, so finding it proves embedding.
      const logo = path.join(OUT, 'fake-customer-logo.png');
      await writeFile(logo, await sharp({ create: { width: 800, height: 320, channels: 4, background: '#FF00AA' } }).png().toBuffer());

      await goto(page, `${ORIGIN}/editor/?t=sq-quote`);
      await evaluate(page, 'document.fonts.ready');
      await page.send('DOM.enable');
      const { root } = await page.send('DOM.getDocument', { depth: -1 });
      const { nodeId } = await page.send('DOM.querySelector', { nodeId: root.nodeId, selector: 'input[type="file"]' });
      if (!nodeId) {
        bad('the customer-logo field has no file input');
      } else {
        await page.send('DOM.setFileInputFiles', { files: [logo], nodeId });
        await new Promise((r) => setTimeout(r, 1500));

        const onArtboard = await evaluate(page, `!!document.querySelector('.stage-scale .artboard-export img')`);
        if (onArtboard) ok('the uploaded logo renders on the artboard');
        else bad('the uploaded logo does not render on the artboard');

        await evaluate(page, CAPTURE);
        await evaluate(page, `[...document.querySelectorAll('button')].find(b => /^Download/.test(b.textContent.trim())).click(); 1`);
        await evaluate(page, WAIT_CAPTURE);
        const { base64 } = JSON.parse(await evaluate(page, READ_CAPTURE));
        const buf = Buffer.from(base64, 'base64');
        await writeFile(path.join(OUT, 'with-customer-logo.png'), buf);

        const { data, info } = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
        let n = 0;
        for (let i = 0; i < info.width * info.height * 3; i += 3) {
          if (Math.abs(data[i] - 255) < 24 && data[i + 1] < 24 && Math.abs(data[i + 2] - 170) < 24) n++;
        }
        if (n > 500) ok(`the uploaded logo is in the exported PNG (${n} px)`);
        else bad(`the uploaded logo is missing from the export (${n} px)`);
      }
    }
  } finally {
    await close();
  }

  console.log(fails.length ? `\nverify-sequences: ${fails.length} FAILED` : '\nverify-sequences: all checks passed');
  process.exit(fails.length ? 1 : 0);
}

main().catch((e) => { console.error(`[verify-sequences] ${e.stack}`); process.exit(1); });
