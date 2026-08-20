/**
 * A minimal Chrome DevTools Protocol client over Node's built-in WebSocket.
 * Shared by every verification script. No puppeteer — one dependency fewer to
 * keep current, and everything these scripts do is four CDP domains wide.
 */
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const CHROME =
  process.env.CHROME_PATH ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

export const ORIGIN = process.env.ORIGIN || 'http://localhost:4321';

export async function launch({ port = 9455, downloadDir } = {}) {
  const profile = await mkdtemp(path.join(tmpdir(), 'floatline-cdp-'));
  const child = spawn(
    CHROME,
    [
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profile}`,
      '--headless=new',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-gpu',
      '--hide-scrollbars',
      'about:blank',
    ],
    { stdio: 'ignore' }
  );

  // Poll the debugger endpoint rather than sleeping a fixed amount.
  let ws = null;
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/version`);
      ws = (await r.json()).webSocketDebuggerUrl;
      if (ws) break;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  if (!ws) {
    child.kill();
    throw new Error(`Chrome did not expose a debugger on ${port}. Set CHROME_PATH if it is installed elsewhere.`);
  }

  const session = await connect(ws);
  const { targetId } = await session.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await session.send('Target.attachToTarget', { targetId, flatten: true });
  const page = wrap(session, sessionId);

  await page.send('Page.enable');
  await page.send('Runtime.enable');
  await page.send('Log.enable');
  if (downloadDir) {
    await page.send('Browser.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: downloadDir,
      eventsEnabled: true,
    });
  }

  return {
    page,
    session,
    async close() {
      try { session.close(); } catch { /* already gone */ }
      child.kill();
      // Chrome writes to its profile for a moment after SIGTERM, so removing it
      // immediately races and throws ENOTEMPTY — which would fail a suite whose
      // checks had all passed. Give it a beat, and never let cleanup decide the
      // exit code.
      for (let i = 0; i < 10; i++) {
        try {
          await rm(profile, { recursive: true, force: true });
          return;
        } catch {
          await new Promise((r) => setTimeout(r, 150));
        }
      }
    },
  };
}

function connect(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url);
    let id = 0;
    const pending = new Map();
    const listeners = [];

    socket.addEventListener('open', () =>
      resolve({
        send(method, params, sessionId) {
          return new Promise((res, rej) => {
            const msgId = ++id;
            pending.set(msgId, { res, rej });
            socket.send(JSON.stringify({ id: msgId, method, params: params ?? {}, ...(sessionId ? { sessionId } : {}) }));
          });
        },
        on(fn) { listeners.push(fn); },
        close() { socket.close(); },
      })
    );
    socket.addEventListener('error', reject);
    socket.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && pending.has(msg.id)) {
        const { res, rej } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) rej(new Error(`${msg.error.message} (${msg.error.code})`));
        else res(msg.result);
      } else {
        for (const fn of listeners) fn(msg);
      }
    });
  });
}

function wrap(session, sessionId) {
  return {
    send: (method, params) => session.send(method, params, sessionId),
    on: (fn) => session.on((msg) => { if (!msg.sessionId || msg.sessionId === sessionId) fn(msg); }),
  };
}

/** Evaluate in the page and return the JSON value, throwing on a page-side throw. */
export async function evaluate(page, expression) {
  const { result, exceptionDetails } = await page.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (exceptionDetails) {
    throw new Error(exceptionDetails.exception?.description || exceptionDetails.text);
  }
  return result.value;
}

export async function goto(page, url, { waitFor = 'load' } = {}) {
  const done = new Promise((resolve) => {
    page.on((msg) => {
      if (msg.method === (waitFor === 'load' ? 'Page.loadEventFired' : 'Page.domContentEventFired')) resolve();
    });
  });
  await page.send('Page.navigate', { url });
  await done;
  // Give React a moment to hydrate before anything is asserted.
  await evaluate(page, 'new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))');
}
