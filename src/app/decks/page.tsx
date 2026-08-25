import type { Metadata } from 'next';
import Decks from './Decks';

export const metadata: Metadata = {
  title: 'Decks & documents',
  description:
    'Ordered runs of artboards — carousels, reports, whitepapers, proposals and pitch decks. Reorder, edit and export as one PDF or as numbered files.',
};

export default function Page() {
  return <Decks />;
}
