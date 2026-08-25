/**
 * Every route, at every width the design claims to support.
 *
 * Three failure modes, all of which are invisible on a 1440px laptop:
 *   - the page scrolls sideways (something is wider than the viewport)
 *   - an element is wider than the viewport and NOT inside a .scroll-x
 *   - an interactive target is smaller than 44px in either axis
 *
 * Fixed artboards are exempt from the width rule: they are artwork at true
 * pixel size and are meant to overflow — inside a .scroll-x, which is checked.
 */
import { mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { launch, goto, evaluate, ORIGIN } from './lib-cdp.mjs';

const OUT = path.resolve(import.meta.dirname, '../verify-out/responsive');
const ROUTES = ['/', '/playbook/', '/editor/', '/decks/', '/design-system/', '/ui-kits/'];
const WIDTHS = [320, 360, 414, 768, 1024, 1440, 1920];
const TAP_MIN = 44;

const fails = [];
const shots = process.argv.includes('--shots');

async function main() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  const { page, close } = await launch({ port: 9459 });
  try {
    // Confirm we are auditing THIS project. A different dev server holding the
    // port once produced a full run of failures for somebody else's markup,
    // which is a slow and confusing way to learn the port was taken.
    await goto(page, `${ORIGIN}/`);
    const title = await evaluate(page, 'document.title');
    if (!/floatline/i.test(title)) {
      console.error(`[audit-responsive] ${ORIGIN} is serving "${title}", not Floatline.`);
      console.error('[audit-responsive] run `npm run build && npm start` first.');
      process.exit(1);
    }

    for (const route of ROUTES) {
      for (const width of WIDTHS) {
        await page.send('Emulation.setDeviceMetricsOverride', {
          width, height: 900, deviceScaleFactor: 1, mobile: width < 700,
        });
        await goto(page, `${ORIGIN}${route}`);
        await evaluate(page, 'document.fonts.ready');
        await evaluate(page, 'new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');

        const report = JSON.parse(await evaluate(page, `(() => {
          const vw = document.documentElement.clientWidth;
          const overflow = document.documentElement.scrollWidth - vw;

          const wide = [];
          for (const el of document.querySelectorAll('body *')) {
            const r = el.getBoundingClientRect();
            if (r.width <= vw + 1) continue;
            // Artboards are true-size artwork; they may overflow inside an
            // explicitly scrollable ancestor, and nowhere else.
            if (el.closest('.scroll-x, .stage-scale, .stage-wrap, .ed-stage, .pb-frame-inner, [data-case]')) continue;
            wide.push(el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').filter(Boolean).slice(0,2).join('.') : '') + ' @' + Math.round(r.width) + 'px');
          }

          const small = [];
          for (const el of document.querySelectorAll('a[href], button, input, select, textarea, [role="tab"]')) {
            const r = el.getBoundingClientRect();
            if (r.width === 0 && r.height === 0) continue;      // hidden
            const cs = getComputedStyle(el);
            if (cs.display === 'none' || cs.visibility === 'hidden') continue;
            // An inline link inside a paragraph is text, not a tap target.
            if (el.tagName === 'A' && cs.display.startsWith('inline') && el.closest('p, li, td, figcaption')) continue;
            // A checkbox is 22px, but clicking its linked <label> activates it,
            // so the real target is the union of the two. Measuring the input
            // alone would report a failure that no pointer ever experiences.
            let box = r;
            if (el.id) {
              const lab = document.querySelector('label[for="' + CSS.escape(el.id) + '"]');
              if (lab) {
                const lr = lab.getBoundingClientRect();
                box = {
                  width: Math.max(r.right, lr.right) - Math.min(r.left, lr.left),
                  height: Math.max(r.bottom, lr.bottom) - Math.min(r.top, lr.top),
                };
              }
            }
            const wrapper = el.closest('label');
            if (wrapper) {
              const wr = wrapper.getBoundingClientRect();
              box = { width: Math.max(box.width, wr.width), height: Math.max(box.height, wr.height) };
            }

            if (box.height < ${TAP_MIN} - 0.5 || box.width < ${TAP_MIN} - 0.5) {
              small.push((el.textContent || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 28) + ' ' + Math.round(box.width) + '×' + Math.round(box.height));
            }
          }

          return JSON.stringify({ overflow, wide: wide.slice(0, 5), small: small.slice(0, 5), wideN: wide.length, smallN: small.length });
        })()`));

        const label = `${route} @${width}`;
        const problems = [];
        if (report.overflow > 1) problems.push(`page scrolls sideways by ${report.overflow}px`);
        if (report.wideN) problems.push(`${report.wideN} over-wide element(s) outside .scroll-x: ${report.wide.join('; ')}`);
        if (report.smallN) problems.push(`${report.smallN} tap target(s) under ${TAP_MIN}px: ${report.small.join('; ')}`);

        if (problems.length === 0) {
          console.log(`  ok   ${label}`);
        } else {
          console.error(`  FAIL ${label} — ${problems.join(' | ')}`);
          fails.push(`${label}: ${problems.join(' | ')}`);
          const { data } = await page.send('Page.captureScreenshot', { format: 'png' });
          await writeFile(path.join(OUT, `${route.replace(/\//g, '_')}${width}.png`), Buffer.from(data, 'base64'));
        }

        if (shots) {
          const { data } = await page.send('Page.captureScreenshot', { format: 'png' });
          await writeFile(path.join(OUT, `shot${route.replace(/\//g, '_')}${width}.png`), Buffer.from(data, 'base64'));
        }
      }
    }
  } finally {
    await close();
  }

  const total = ROUTES.length * WIDTHS.length;
  console.log(fails.length
    ? `\naudit-responsive: ${fails.length} of ${total} combinations FAILED — screenshots in verify-out/responsive/`
    : `\naudit-responsive: all ${total} route × width combinations pass`);
  process.exit(fails.length ? 1 : 0);
}

main().catch((e) => { console.error(`[audit-responsive] ${e.stack}`); process.exit(1); });
