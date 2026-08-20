import type { NextConfig } from 'next';

/**
 * Frontend only. No server, no API routes, no middleware, no ISR, no image
 * optimizer — the whole app is a static bundle in `out/`.
 *
 * NOTE: this pairs Next 16 with `output: 'export'`. The sibling project this
 * app's export pipeline is ported from (operator/OptbrandID) runs Next 16
 * WITHOUT static export; the project the static config is taken from
 * (okwe/okwe-knows) runs Next 15. The combination is therefore new here, not
 * inherited — `scripts/verify-app.mjs` and `scripts/verify-export.mjs` run
 * against the built `out/` bundle specifically to prove it.
 *
 * There is deliberately no `images` remote config: artboards never use
 * `next/image`. Every asset is a same-origin `/brand/**` file referenced by a
 * root-absolute path, which is what keeps html-to-image from tainting the
 * export canvas.
 */
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
