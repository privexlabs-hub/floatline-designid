/**
 * The static bundle behaves: every route renders, nothing errors, the brand
 * faces are really loaded, and NOTHING is fetched from a third party.
 *
 * That last one is the point of the whole self-hosting exercise, so it is
 * asserted rather than assumed.
 */
import { launch, goto, evaluate, ORIGIN } from './lib-cdp.mjs';
import { SURFACE_ART } from '../src/lib/tokens.ts';

const ROUTES = ['/', '/playbook/', '/editor/', '/design-system/', '/ui-kits/'];

const fails = [];
const ok = (m) => console.log(`  ok   ${m}`);
const bad = (m) => { console.error(`  FAIL ${m}`); fails.push(m); };

async function main() {
  const { page, close } = await launch({ port: 9458 });
  try {
    await page.send('Network.enable');

    const requests = [];
    const consoleErrors = [];
    page.on((msg) => {
      if (msg.method === 'Network.requestWillBeSent') requests.push(msg.params.request.url);
      if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
        consoleErrors.push(`${msg.params.entry.url ?? ''} ${msg.params.entry.text}`);
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        consoleErrors.push(msg.params.exceptionDetails.exception?.description ?? msg.params.exceptionDetails.text);
      }
    });

    await page.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });

    for (const route of ROUTES) {
      const before = consoleErrors.length;
      await goto(page, `${ORIGIN}${route}`);
      await evaluate(page, 'document.fonts.ready');

      const title = await evaluate(page, 'document.title');
      const h1 = await evaluate(page, 'document.querySelector("h1, .fl-display-2, .fl-display-1")?.textContent?.trim() ?? ""');
      if (title && h1) ok(`${route} rendered — “${h1.slice(0, 46)}”`);
      else bad(`${route}: no title or no heading`);

      const errs = consoleErrors.slice(before);
      if (errs.length === 0) ok(`${route} no console errors`);
      else bad(`${route} console errors: ${errs.slice(0, 2).join(' | ')}`);
    }

    // Third-party requests. A single Google Fonts request here would mean the
    // export pipeline silently loses its typefaces.
    const foreign = [...new Set(requests)].filter((u) => u.startsWith('http') && !u.startsWith(ORIGIN));
    if (foreign.length === 0) ok(`no third-party requests across ${ROUTES.length} routes`);
    else bad(`third-party requests: ${foreign.slice(0, 4).join(', ')}`);

    // The faces are really available, not merely declared.
    //
    // `fonts.check` alone is not enough: a browser only downloads a face once
    // something on the page actually uses it, so a page that happens not to set
    // mono at weight 500 reports it missing even though the @font-face is
    // correct. `fonts.load` resolves that honestly — it fails if the face is
    // genuinely unavailable and succeeds if it merely had not been needed yet.
    const fonts = JSON.parse(await evaluate(page, `(async () => {
      const specs = {
        display: '800 48px "Bricolage Grotesque"',
        sans: '600 16px "Manrope"',
        mono: '500 16px "IBM Plex Mono"',
      };
      const out = {};
      for (const [k, spec] of Object.entries(specs)) {
        try {
          const faces = await document.fonts.load(spec, 'Ag ₦0123 29 / 32');
          out[k] = faces.length > 0 && document.fonts.check(spec);
        } catch { out[k] = false; }
      }
      return JSON.stringify(out);
    })()`));
    for (const [k, v] of Object.entries(fonts)) {
      if (v) ok(`brand face applied: ${k}`);
      else bad(`brand face NOT applied: ${k}`);
    }

    // tokens.css and the typed mirror must agree. They are two files stating
    // the same colours, and only one of them is used by the exporter.
    await goto(page, `${ORIGIN}/editor/`);
    await evaluate(page, 'document.fonts.ready');
    const live = JSON.parse(await evaluate(page, `(() => {
      const out = {};
      const host = document.createElement('div');
      host.style.cssText = 'position:fixed;left:-9999px';
      document.body.appendChild(host);
      for (const s of ${JSON.stringify(Object.keys(SURFACE_ART))}) {
        const el = document.createElement('div');
        el.className = 'artboard-export';
        el.dataset.surface = s;
        host.appendChild(el);
        const cs = getComputedStyle(el);
        out[s] = {
          bg: cs.getPropertyValue('--art-bg').trim(),
          fg: cs.getPropertyValue('--art-fg').trim(),
          signal: cs.getPropertyValue('--art-signal').trim(),
          accent: cs.getPropertyValue('--art-accent').trim(),
        };
      }
      host.remove();
      return JSON.stringify(out);
    })()`));

    // Next's CSS minifier shortens #FFFFFF to #fff, so compare normalised hex
    // rather than raw strings — otherwise this reports drift that is not there.
    const normHex = (v) => {
      const s = String(v).trim().toLowerCase();
      const m = /^#([0-9a-f]{3})$/.exec(s);
      return m ? `#${[...m[1]].map((c) => c + c).join('')}` : s;
    };

    let drift = 0;
    for (const [surface, expected] of Object.entries(SURFACE_ART)) {
      for (const key of ['bg', 'fg', 'signal', 'accent']) {
        const a = normHex(expected[key]);
        const b = normHex(live[surface]?.[key] ?? '');
        if (a !== b) { bad(`surface ${surface}.${key}: tokens.ts says ${a}, artboard.css says ${b || '(nothing)'}`); drift++; }
      }
    }
    if (drift === 0) ok(`artboard.css and tokens.ts agree on all ${Object.keys(SURFACE_ART).length} surfaces`);
  } finally {
    await close();
  }

  console.log(fails.length ? `\nverify-app: ${fails.length} FAILED` : '\nverify-app: all checks passed');
  process.exit(fails.length ? 1 : 0);
}

main().catch((e) => { console.error(`[verify-app] ${e.stack}`); process.exit(1); });
