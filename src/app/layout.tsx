import type { Metadata, Viewport } from 'next';
import { BRAND } from '@/content/brand';

// Order matters: faces, then tokens, then everything that consumes them.
import '@/styles/fonts.css';
import '@/styles/tokens.css';
import '@/styles/breakpoints.css';
import '@/styles/artboard.css';
import '@/styles/app.css';
import '@/styles/editor.css';
import '@/styles/playbook.css';
import '@/styles/ui-kits.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://floatline.app'),
  title: { default: `${BRAND.name} — brand system`, template: `%s · ${BRAND.name}` },
  description: BRAND.promise,
  applicationName: BRAND.name,
  manifest: '/brand/favicon/site.webmanifest',
  icons: {
    icon: [
      { url: '/brand/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/brand/favicon/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/brand/favicon/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: {
    type: 'website',
    siteName: BRAND.name,
    title: `${BRAND.name} — ${BRAND.category.toLowerCase()}`,
    description: BRAND.tagline,
    images: [{ url: '/brand/og/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND.name} — ${BRAND.category.toLowerCase()}`,
    description: BRAND.tagline,
    images: ['/brand/og/og-default.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#F7F2E8',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
