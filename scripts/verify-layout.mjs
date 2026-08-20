/**
 * Every template in the catalog lays out without breaking.
 *
 * This is the precise guard against the failure mode that cost the most time to
 * find: html-to-image pins each cloned element to its measured size, so any
 * artboard whose text box is sized exactly to its content has ZERO tolerance —
 * a hair of metric difference re-wraps a line inside a fixed-height box and the
 * overflow lands on top of whatever is below it.
 *
 * The symptom is not observable from here, so this checks the CAUSE: for every
 * template, no wrapping text block may be narrower than the column that holds
 * it. See __spikeFragile in the spike page for why the alternatives do not work.
 */
import { launch, goto, evaluate, ORIGIN } from './lib-cdp.mjs';

const fails = [];

async function main() {
  const { page, close } = await launch({ port: 9466 });
  try {
    await page.send('Emulation.setDeviceMetricsOverride', { width: 1400, height: 1000, deviceScaleFactor: 1, mobile: false });
    await goto(page, `${ORIGIN}/spike/?all=1`);
    await evaluate(page, 'new Promise(r=>{const t=setInterval(()=>{if(window.__spikeReady){clearInterval(t);r();}},50);})');
    await evaluate(page, 'document.fonts.ready');

    const ids = JSON.parse(await evaluate(page, 'JSON.stringify(window.__spikeIds)'));
    console.log(`  checking ${ids.length} templates…`);

    for (const id of ids) {
      await evaluate(page, `window.__spikeShow(${JSON.stringify(id)})`);
      const report = JSON.parse(await evaluate(page, `JSON.stringify(window.__spikeFragile(${JSON.stringify(id)}))`));

      if (report.missing) { fails.push(`${id}: did not render`); console.error(`  FAIL ${id}: did not render`); continue; }
      if (report.fragile.length) {
        fails.push(`${id}: ${report.fragile.join('; ')}`);
        console.error(`  FAIL ${id} — ${report.fragile.join('; ')}`);
      }
    }

  } finally {
    await close();
  }

  console.log(fails.length ? `\nverify-layout: ${fails.length} template(s) FAILED` : '\nverify-layout: every template lays out cleanly, with slack to spare');
  process.exit(fails.length ? 1 : 0);
}

main().catch((e) => { console.error(`[verify-layout] ${e.stack}`); process.exit(1); });
