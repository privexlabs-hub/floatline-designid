import type { ComponentType } from 'react';
import type { LayoutBaseProps } from '@/components/artboard/layouts/types';
import { SquarePost } from '@/components/artboard/layouts/SquarePost';
import { EngagementPost } from '@/components/artboard/layouts/EngagementPost';
import { CarouselSlide } from '@/components/artboard/layouts/CarouselSlide';
import { VerticalStory } from '@/components/artboard/layouts/VerticalStory';
import { PortraitPost } from '@/components/artboard/layouts/PortraitPost';
import { YouTubeThumb } from '@/components/artboard/layouts/YouTubeThumb';
import { CoverBanner } from '@/components/artboard/layouts/CoverBanner';
import { AvatarMark } from '@/components/artboard/layouts/AvatarMark';
import { AdCreative } from '@/components/artboard/layouts/AdCreative';
import { EmailBlock } from '@/components/artboard/layouts/EmailBlock';
import { WebBlock } from '@/components/artboard/layouts/WebBlock';
import { ProfileMock } from '@/components/artboard/layouts/ProfileMock';
import { KitShowcase } from '@/components/artboard/layouts/KitShowcase';

import type { LayoutId, Preset } from './types';
import { SQUARE_PRESETS } from './presets/square';
import { ENGAGEMENT_PRESETS } from './presets/engagement';
import { CAROUSEL_PRESETS } from './presets/carousel';
import { VERTICAL_PRESETS } from './presets/vertical';
import { PORTRAIT_PRESETS } from './presets/portrait';
import { YOUTUBE_PRESETS } from './presets/youtube';
import { COVER_PRESETS } from './presets/cover';
import { AVATAR_PRESETS } from './presets/avatar';
import { AD_PRESETS } from './presets/ads';
import { EMAIL_PRESETS } from './presets/email';
import { WEB_PRESETS } from './presets/web';
import { PROFILE_PRESETS } from './presets/profile';
import { KIT_PRESETS } from './presets/kits';

export const LAYOUTS: Record<LayoutId, ComponentType<LayoutBaseProps>> = {
  square: SquarePost,
  engagement: EngagementPost,
  carousel: CarouselSlide,
  vertical: VerticalStory,
  portrait: PortraitPost,
  ytThumb: YouTubeThumb,
  cover: CoverBanner,
  avatar: AvatarMark,
  ad: AdCreative,
  email: EmailBlock,
  web: WebBlock,
  profile: ProfileMock,
  kit: KitShowcase,
};

export const PRESETS: Preset[] = [
  ...SQUARE_PRESETS,
  ...ENGAGEMENT_PRESETS,
  ...CAROUSEL_PRESETS,
  ...VERTICAL_PRESETS,
  ...PORTRAIT_PRESETS,
  ...YOUTUBE_PRESETS,
  ...COVER_PRESETS,
  ...AVATAR_PRESETS,
  ...AD_PRESETS,
  ...EMAIL_PRESETS,
  ...WEB_PRESETS,
  ...PROFILE_PRESETS,
  ...KIT_PRESETS,
];

/** Group order in the picker — the headings from the brief, in its order. */
export const GROUP_ORDER = [
  'Square · 1080×1080',
  'Engagement · 1080×1080',
  'Carousel · 1080×1080',
  'Vertical · 1080×1920',
  'Portrait · 1080×1350',
  'YouTube · 1280×720',
  'Cover · Banners',
  'Avatar · 400×400',
  'Ads · Multi-format',
  'Email · Multi-format',
  'Web · Multi-format',
  'Profile · Reference',
  'Product · Kit showcase',
] as const;

export const GROUPED: { group: string; presets: Preset[] }[] = GROUP_ORDER.map((group) => ({
  group,
  presets: PRESETS.filter((p) => p.group === group),
}));

export const byId = (id: string): Preset | undefined => PRESETS.find((p) => p.id === id);

/**
 * Asserted at module load rather than left to a test. A duplicate id collides
 * silently in the ZIP and in localStorage — two artboards, one file, and the
 * second one wins. Better to fail the build.
 */
const seen = new Set<string>();
for (const p of PRESETS) {
  if (seen.has(p.id)) throw new Error(`duplicate preset id: ${p.id}`);
  seen.add(p.id);
  if (!GROUP_ORDER.includes(p.group as (typeof GROUP_ORDER)[number])) {
    throw new Error(`preset ${p.id} has an unlisted group: ${p.group}`);
  }
  if (!LAYOUTS[p.layout]) throw new Error(`preset ${p.id} names an unknown layout: ${p.layout}`);
  if (p.w <= 0 || p.h <= 0) throw new Error(`preset ${p.id} has a zero dimension`);
}
