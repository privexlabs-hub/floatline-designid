import type { Metadata } from 'next';
import Editor from './Editor';
import { PRESETS } from '@/content/templates/registry';

export const metadata: Metadata = {
  title: 'Studio',
  description: `${PRESETS.length} on-brand templates with PNG, JPEG, WebP, SVG and PDF export. Everything runs in your browser.`,
};

export default function Page() {
  return <Editor />;
}
