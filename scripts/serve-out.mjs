/**
 * Serves the static `out/` bundle for verification.
 *
 * Deliberately not `npx serve`: this build uses trailingSlash, so `/editor/`
 * must resolve to `out/editor/index.html`, and it must do so with NO rewrite
 * fallback — a server that silently serves index.html for a missing path would
 * hide exactly the routing bug these scripts exist to catch.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../out');
const PORT = Number(process.env.PORT || 4321);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

/**
 * `next build` prints its route table before it has finished writing the static
 * export, so a server started the instant the build "finishes" can serve 404s
 * for routes whose index.html has not landed yet. Waiting for the known routes
 * turns a confusing 404 into a two-second pause.
 */
const EXPECTED = ['index.html', 'playbook/index.html', 'editor/index.html',
  'decks/index.html', 'design-system/index.html', 'ui-kits/index.html'];

async function waitForExport() {
  for (let i = 0; i < 60; i++) {
    const missing = [];
    for (const rel of EXPECTED) {
      if (!(await stat(path.join(ROOT, rel)).catch(() => null))) missing.push(rel);
    }
    if (missing.length === 0) return;
    if (i === 0) console.log(`waiting for the export to finish (${missing.length} routes not written yet)…`);
    await new Promise((r) => setTimeout(r, 500));
  }
  console.error('out/ is still incomplete after 30s — run `npm run build` first.');
  process.exit(1);
}

await waitForExport();

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let file = path.join(ROOT, decodeURIComponent(url.pathname));
  if (!file.startsWith(ROOT)) { res.writeHead(403).end('forbidden'); return; }
  try {
    const s = await stat(file).catch(() => null);
    if (s?.isDirectory()) file = path.join(file, 'index.html');
    else if (!s && !path.extname(file)) file = `${file}.html`;
    const body = await readFile(file);
    res.writeHead(200, {
      'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream',
      'cache-control': 'no-store',
    });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' }).end('404');
  }
});

/**
 * Fail loudly if the port is taken.
 *
 * Silently exiting here once let a DIFFERENT project's dev server keep port
 * 4321, and the responsive audit spent a full run reporting failures for
 * somebody else's markup. A server that cannot bind must say so.
 */
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`port ${PORT} is already in use — stop whatever is on it, or set PORT.`);
    console.error(`  lsof -ti :${PORT} | xargs kill`);
  } else {
    console.error(err.message);
  }
  process.exit(1);
});

server.listen(PORT, () => console.log(`serving out/ on http://localhost:${PORT}`));
