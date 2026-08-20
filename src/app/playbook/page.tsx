import type { Metadata } from 'next';
import Link from 'next/link';
import { Toc } from '@/components/playbook/Toc';
import { SECTIONS } from '@/content/playbook';
import { BRAND } from '@/content/brand';

export const metadata: Metadata = {
  title: 'Brand playbook',
  description: 'Strategy, voice, visual identity, formats and governance for Floatline.',
  openGraph: { images: [{ url: '/brand/og/og-playbook.png', width: 1200, height: 630 }] },
};

export default function Page() {
  return (
    <main className="pb">
      <Toc />
      <div className="pb-body">
        <header style={{ marginBottom: 'var(--sp-6)' }}>
          <Link href="/" className="tag-link">← floatline</Link>
          <h1 className="fl-display-2" style={{ marginTop: 'var(--sp-4)' }}>brand playbook</h1>
          <p className="pb-lead">
            Eighteen sections covering how {BRAND.name} is positioned, how it speaks, how it looks
            and how all three are kept from drifting. Every example on this page is a live template
            from the studio, so nothing here can go stale.
          </p>
          <hr className="receipt" />
        </header>
        {SECTIONS.map(({ id, Component }) => <Component key={id} />)}
      </div>
    </main>
  );
}
