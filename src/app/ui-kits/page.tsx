import type { Metadata } from 'next';
import Link from 'next/link';
import { Kits } from './Kits';

export const metadata: Metadata = {
  title: 'UI kits',
  description: 'The Floatline brand applied to product surfaces — a multi-channel conversation and the operator console.',
};

export default function Page() {
  return (
    <main className="shell" style={{ paddingBlock: 'var(--sp-7) var(--sp-11)' }}>
      <Link href="/" className="tag-link">← floatline</Link>
      <h1 className="fl-display-2" style={{ marginTop: 'var(--sp-4)' }}>ui kits</h1>
      <p className="pb-lead">
        Live React, not screenshots. These are the two surfaces a network actually touches, rendered
        with the same tokens as everything else.
      </p>
      <hr className="receipt" />
      <Kits />
    </main>
  );
}
