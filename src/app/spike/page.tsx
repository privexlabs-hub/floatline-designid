import Spike from './Spike';

/** Verification harness. Deliberately not linked and not indexed. */
export const metadata = { title: 'Export spike', robots: { index: false, follow: false } };

export default function Page() {
  return <Spike />;
}
