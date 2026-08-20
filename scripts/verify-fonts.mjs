/**
 * Offline gate — runs on `prebuild`. Never touches the network.
 *
 * Re-hashes every committed face against the manifest and asserts the variable
 * families are still variable. A build that ships fallback type is worse than a
 * build that fails, because every exported PNG is wrong and nothing says so.
 */
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'public/brand/fonts');
const CSS = path.join(ROOT, 'src/styles/fonts.css');

const fail = (m) => {
  console.error(`[verify-fonts] ${m}`);
  console.error('[verify-fonts] run `npm run fonts:fetch && npm run fonts:css`');
  process.exit(1);
};

let m;
try {
  m = JSON.parse(await readFile(path.join(DIR, 'fonts.manifest.json'), 'utf8'));
} catch {
  fail('public/brand/fonts/fonts.manifest.json is missing');
}

if (!m.fonts?.length) fail('the manifest lists no fonts');

for (const f of m.fonts) {
  let buf;
  try {
    buf = await readFile(path.join(DIR, f.file));
  } catch {
    fail(`missing font file: ${f.file}`);
  }
  if (buf.length !== f.bytes) fail(`${f.file}: expected ${f.bytes} bytes, found ${buf.length}`);
  const sum = createHash('sha256').update(buf).digest('hex');
  if (sum !== f.sha256) fail(`${f.file}: sha256 mismatch — the file changed since it was fetched`);
  if (buf.subarray(0, 4).toString('latin1') !== 'wOF2') fail(`${f.file}: not a WOFF2 file`);
  if (f.variable && !/^\d+\s+\d+$/.test(String(f.weight))) {
    fail(`${f.family} is pinned at weight ${f.weight}; it must be a variable range`);
  }
}

const onDisk = (await readdir(DIR)).filter((x) => x.endsWith('.woff2'));
const listed = new Set(m.fonts.map((f) => f.file));
for (const x of onDisk) if (!listed.has(x)) fail(`${x} is on disk but not in the manifest`);

let css;
try {
  css = await readFile(CSS, 'utf8');
} catch {
  fail('src/styles/fonts.css is missing');
}
for (const family of new Set(m.fonts.map((f) => f.family))) {
  if (!css.includes(`font-family: '${family}'`)) fail(`fonts.css declares no @font-face for ${family}`);
}
const declared = (css.match(/@font-face/g) || []).length;
if (declared !== m.fonts.length) {
  fail(`fonts.css has ${declared} @font-face rules but the manifest lists ${m.fonts.length}`);
}
// Only the live rules matter — the generated header quotes the source URLs it
// was built from, and those are a record, not a runtime request.
const live = css.replace(/\/\*[\s\S]*?\*\//g, '');
if (/fonts\.googleapis\.com|fonts\.gstatic\.com|@import/.test(live)) {
  fail('fonts.css loads a font off-origin — html-to-image cannot embed a cross-origin face');
}
for (const url of live.match(/url\('([^']+)'\)/g) || []) {
  if (!url.includes("'/brand/fonts/")) fail(`fonts.css references a non-local face: ${url}`);
}

console.log(`[verify-fonts] ok — ${m.fonts.length} faces, ${new Set(m.fonts.map((f) => f.family)).size} families, all same-origin`);
