/**
 * Generates every raster brand asset from the SVG sources.
 *
 * No PNG is ever hand-placed in public/. They all come from here, so the
 * favicon and the app icon cannot drift from the mark, and regenerating after
 * a logo change is one command.
 *
 * The wordmark SVGs set their text in Bricolage Grotesque. A standalone SVG
 * has no access to the site's stylesheet, so this script inlines the font as a
 * base64 @font-face at the `<!-- @fontface -->` marker — otherwise the file
 * renders in whatever the viewer happens to have, which for a logo is wrong.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { MARK, LOCKUP } from '../src/lib/brand-geometry.ts';

const ROOT = path.resolve(import.meta.dirname, '..');
const BRAND = path.join(ROOT, 'public/brand');

const read = (p) => readFile(path.join(BRAND, p), 'utf8');

/** Cross-check the SVG sources against brand-geometry, so the two cannot drift. */
async function assertGeometry() {
  const mark = await read('logo/floatline-mark.svg');
  const expect = [
    [`rx="${MARK.corner * MARK.box}"`, 'corner radius'],
    [`y="${MARK.rail.y * MARK.box}"`, 'rail position'],
    [`width="${MARK.bar.w * MARK.box * MARK.bar.fill}"`, 'float bar fill'],
    [`cy="${MARK.nodes.y * MARK.box}"`, 'node row position'],
  ];
  for (const [needle, what] of expect) {
    if (!mark.includes(needle)) {
      throw new Error(
        `logo-mark.svg no longer matches brand-geometry.ts (${what}: expected ${needle}). ` +
          `Update both, or the React <Mark/> and the SVG files will drift.`
      );
    }
  }
  if (MARK.nodes.count !== (mark.match(/<circle/g) || []).length) {
    throw new Error('logo-mark.svg node count differs from MARK.nodes.count');
  }
}

/**
 * Inline the brand faces so a standalone SVG always sets correctly. Without
 * this a wordmark file renders in whatever the viewer happens to have, which
 * for a logo is simply wrong.
 *
 * `families` is a list so the OG cards can carry the body face too; the
 * wordmarks only need the display one.
 */
async function fontFaceCSS(families = ['Bricolage Grotesque']) {
  const manifest = JSON.parse(await read('fonts/fonts.manifest.json'));
  const blocks = [];
  for (const family of families) {
    // The largest subset is the latin one, which covers everything these
    // files set. Shipping all subsets would triple the file for no gain.
    const face = manifest.fonts
      .filter((f) => f.family === family)
      .sort((a, b) => a.bytes - b.bytes)
      .at(-1);
    if (!face) throw new Error(`no ${family} face in the manifest`);
    const b64 = (await readFile(path.join(BRAND, 'fonts', face.file))).toString('base64');
    blocks.push(`@font-face{font-family:'${family}';font-weight:${face.weight};src:url(data:font/woff2;base64,${b64}) format('woff2');}`);
  }
  return `<style>${blocks.join('')}</style>`;
}

async function main() {
  await assertGeometry();
  await mkdir(path.join(BRAND, 'favicon'), { recursive: true });
  await mkdir(path.join(BRAND, 'og'), { recursive: true });

  const css = await fontFaceCSS();
  const wordmarks = ['logo/floatline-wordmark.svg', 'logo/floatline-wordmark-dark.svg', 'logo/floatline-lockup-stacked.svg'];
  for (const w of wordmarks) {
    const src = await read(w);
    if (src.includes('<!-- @fontface -->')) {
      await writeFile(path.join(BRAND, w), src.replace('<!-- @fontface -->', css));
      console.log(`  embedded display face into ${w}`);
    }
  }

  const favicon = Buffer.from(await read('favicon/favicon.svg'));
  const mark = Buffer.from(await read('logo/floatline-mark.svg'));

  const rasters = [
    ['favicon/favicon-32.png', favicon, 32],
    ['favicon/favicon-96.png', favicon, 96],
    ['favicon/apple-touch-icon.png', mark, 180],
    ['favicon/icon-192.png', mark, 192],
    ['favicon/icon-512.png', mark, 512],
  ];
  for (const [out, buf, size] of rasters) {
    await sharp(buf, { density: 384 }).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(path.join(BRAND, out));
    console.log(`  ${out} — ${size}×${size}`);
  }

  // Maskable icons are cropped to a circle by Android, so the mark is inset to
  // the safe zone (80% of the canvas) on a full-bleed brand ground.
  const inset = Math.round(512 * 0.62);
  await sharp({ create: { width: 512, height: 512, channels: 4, background: '#0B6B3A' } })
    .composite([{ input: await sharp(mark, { density: 384 }).resize(inset, inset).png().toBuffer(), gravity: 'centre' }])
    .png()
    .toFile(path.join(BRAND, 'favicon/icon-maskable-512.png'));
  console.log('  favicon/icon-maskable-512.png — 512×512 (safe-zone inset)');

  // Open Graph cards. Drawn here rather than exported from the studio so that
  // `npm run assets:build` works with no browser and no running server.
  //
  // Headlines are written as EXPLICIT LINES. SVG <text> does not wrap, and
  // guessing at glyph widths to fake it is how the first version of this
  // shipped a title running off the right edge of the card.
  const ogs = [
    ['og-default.png', ['automation for operators', 'who run networks'], 'Broadcast once. Match capacity. Answer once. Read the digest.'],
    ['og-playbook.png', ['the floatline', 'brand playbook'], 'Strategy, voice, visual identity, formats and governance.'],
    ['og-editor.png', ['the floatline studio'], 'On-brand assets in every format, exported in your browser.'],
  ];
  const ogCss = await fontFaceCSS(['Bricolage Grotesque', 'Manrope']);
  const markPng = (await sharp(mark, { density: 384 }).resize(120, 120).png().toBuffer()).toString('base64');
  for (const [file, lines, sub] of ogs) {
    const top = 300 - (lines.length - 1) * 38;
    const heading = lines
      .map((line, i) => `<text x="80" y="${top + i * 76}" font-family="Bricolage Grotesque, sans-serif" font-weight="800" font-size="62" letter-spacing="-1.8" fill="#053D22">${esc(line)}</text>`)
      .join('\n  ');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  ${ogCss}
  <rect width="1200" height="630" fill="#F7F2E8"/>
  <image href="data:image/png;base64,${markPng}" x="80" y="72" width="88" height="88"/>
  <text x="184" y="132" font-family="Bricolage Grotesque, sans-serif" font-weight="700" font-size="48" letter-spacing="-1.5" fill="#053D22">floatline</text>
  ${heading}
  <text x="80" y="${top + lines.length * 76 + 4}" font-family="Manrope, sans-serif" font-weight="500" font-size="28" fill="#3D332B">${esc(sub)}</text>
  <line x1="80" y1="502" x2="1120" y2="502" stroke="#D6CCBE" stroke-width="2" stroke-dasharray="8 8"/>
  <rect x="80" y="536" width="256" height="10" rx="5" fill="#0B6B3A" opacity="0.25"/>
  <rect x="80" y="536" width="150" height="10" rx="5" fill="#E89B2C"/>
  <text x="1120" y="551" text-anchor="end" font-family="'IBM Plex Mono', monospace" font-size="22" fill="#6B5F54">floatline.app</text>
</svg>`;
    await sharp(Buffer.from(svg), { density: 144 }).png().toFile(path.join(BRAND, 'og', file));
    console.log(`  og/${file} — 1200×630`);
  }

  console.log(`\n[build-brand-assets] done · clear space ${LOCKUP.clearSpace}× mark height`);
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

main().catch((e) => { console.error(`[build-brand-assets] ${e.message}`); process.exit(1); });
