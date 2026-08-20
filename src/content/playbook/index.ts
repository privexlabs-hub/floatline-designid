import { SectionThesis } from './01-thesis';
import { SectionArchitecture } from './02-architecture';
import { SectionPositioning } from './03-positioning';
import { SectionChannels } from './04-channels';
import { SectionProfiles } from './05-profiles';
import { SectionVoice } from './06-voice';
import { SectionVisual } from './07-visual';
import { SectionLogo } from './08-logo';
import { SectionContent } from './09-content';
import { SectionFormats } from './10-formats';
import { SectionVerticalVideo } from './11-vertical-video';
import { SectionNewsletter } from './12-newsletter';
import { SectionCadence } from './13-cadence';
import { SectionSeo } from './14-seo';
import { SectionCommunity } from './15-community';
import { SectionGuardrails } from './16-guardrails';
import { SectionGovernance } from './17-governance';
import { SectionDirection } from './18-direction';

export type TocEntry =
  | { kind: 'group'; label: string }
  | { kind: 'item'; id: string; n: string; label: string };

export const TOC: TocEntry[] = [
  { kind: 'group', label: '// I · STRATEGY' },
  { kind: 'item', id: 'thesis', n: '01', label: 'Brand thesis' },
  { kind: 'item', id: 'architecture', n: '02', label: 'Brand architecture' },
  { kind: 'item', id: 'positioning', n: '03', label: 'Positioning & category' },
  { kind: 'item', id: 'channels', n: '04', label: 'Channel strategy' },

  { kind: 'group', label: '// II · SURFACE' },
  { kind: 'item', id: 'profiles', n: '05', label: 'Profile system' },
  { kind: 'item', id: 'voice', n: '06', label: 'Voice & tone' },
  { kind: 'item', id: 'visual', n: '07', label: 'Visual identity' },
  { kind: 'item', id: 'logo', n: '08', label: 'Logo & lockups' },

  { kind: 'group', label: '// III · CONTENT' },
  { kind: 'item', id: 'content', n: '09', label: 'Content strategy' },
  { kind: 'item', id: 'formats', n: '10', label: 'Post formats & templates' },
  { kind: 'item', id: 'vertical-video', n: '11', label: 'Vertical video' },
  { kind: 'item', id: 'newsletter', n: '12', label: 'Newsletter system' },

  { kind: 'group', label: '// IV · OPERATING' },
  { kind: 'item', id: 'cadence', n: '13', label: 'Cadence & publishing OS' },
  { kind: 'item', id: 'seo', n: '14', label: 'SEO & discoverability' },
  { kind: 'item', id: 'community', n: '15', label: 'Community & engagement' },

  { kind: 'group', label: '// V · GOVERNANCE' },
  { kind: 'item', id: 'guardrails', n: '16', label: 'Brand guardrails' },
  { kind: 'item', id: 'governance', n: '17', label: 'Governance & consistency' },
  { kind: 'item', id: 'direction', n: '18', label: 'Creative direction summary' },
];

export const SECTIONS = [
  { id: 'thesis', Component: SectionThesis },
  { id: 'architecture', Component: SectionArchitecture },
  { id: 'positioning', Component: SectionPositioning },
  { id: 'channels', Component: SectionChannels },
  { id: 'profiles', Component: SectionProfiles },
  { id: 'voice', Component: SectionVoice },
  { id: 'visual', Component: SectionVisual },
  { id: 'logo', Component: SectionLogo },
  { id: 'content', Component: SectionContent },
  { id: 'formats', Component: SectionFormats },
  { id: 'vertical-video', Component: SectionVerticalVideo },
  { id: 'newsletter', Component: SectionNewsletter },
  { id: 'cadence', Component: SectionCadence },
  { id: 'seo', Component: SectionSeo },
  { id: 'community', Component: SectionCommunity },
  { id: 'guardrails', Component: SectionGuardrails },
  { id: 'governance', Component: SectionGovernance },
  { id: 'direction', Component: SectionDirection },
] as const;

/** The TOC and the section list must not drift. Asserted at module load. */
{
  const toc = TOC.filter((t) => t.kind === 'item').map((t) => (t as { id: string }).id);
  const sections = SECTIONS.map((s) => s.id);
  if (toc.length !== sections.length || toc.some((id, i) => id !== sections[i])) {
    throw new Error('playbook TOC and SECTIONS disagree — they must list the same ids in the same order');
  }
}
