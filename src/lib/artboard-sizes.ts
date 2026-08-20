/**
 * Canvas sizes and platform safe areas.
 *
 * VERIFIED_ON is when these were last checked against first-party platform
 * docs. Platforms change crop rules without announcing it; when this date is
 * stale, re-check before trusting a safe area. Sizes are published UPLOAD
 * dimensions, not rendered display size.
 */
export const VERIFIED_ON = '2026-08-19';

export type Size = { w: number; h: number };

export const CANVAS = {
  square: { w: 1080, h: 1080 },
  portrait: { w: 1080, h: 1350 },
  vertical: { w: 1080, h: 1920 },
  landscape: { w: 1600, h: 900 },
  ytThumb: { w: 1280, h: 720 },
  avatar: { w: 400, h: 400 },

  xHeader: { w: 1500, h: 500 },
  liCover: { w: 1584, h: 396 },
  fbCover: { w: 820, h: 312 },
  ytChannel: { w: 2560, h: 1440 },
  twitchBanner: { w: 1200, h: 480 },
  podcastCover: { w: 3000, h: 3000 },
  newsletterHeader: { w: 1200, h: 400 },
  ogCover: { w: 1200, h: 630 },
  eventBanner: { w: 1920, h: 1080 },
  communityBanner: { w: 1920, h: 1080 },
  githubSocial: { w: 1280, h: 640 },

  adFeed: { w: 1080, h: 1080 },
  adLandscape: { w: 1200, h: 628 },
  adStory: { w: 1080, h: 1920 },
  adMpu: { w: 300, h: 250 },

  emailHeader: { w: 600, h: 200 },
  emailBody: { w: 600, h: 800 },
  emailBanner: { w: 1200, h: 400 },

  webHero: { w: 1600, h: 900 },
  webBanner: { w: 1920, h: 600 },
} as const satisfies Record<string, Size>;

export type CanvasName = keyof typeof CANVAS;

/**
 * Insets, in canvas pixels, that platform chrome may cover or crop.
 * Rendered as SIBLING guide overlays — never as children of the export node,
 * or the guides end up baked into the file.
 */
export type SafeArea = { top: number; right: number; bottom: number; left: number; note: string };

export const SAFE_AREAS: Partial<Record<CanvasName, SafeArea>> = {
  // Stories/Reels: the top bar carries avatar and handle, the bottom the
  // caption and action row.
  vertical: { top: 200, right: 80, bottom: 320, left: 80, note: 'Story / Reel UI chrome' },
  adStory: { top: 200, right: 80, bottom: 320, left: 80, note: 'Story ad UI chrome' },

  // YouTube channel art crops hard: only the centre band survives on TV and
  // mobile. 1546x423 centred inside 2560x1440.
  ytChannel: { top: 508, right: 507, bottom: 509, left: 507, note: 'Safe on all devices (1546×423)' },

  // The avatar circle-crops; keep the mark inside the inscribed circle.
  avatar: { top: 28, right: 28, bottom: 28, left: 28, note: 'Circle crop' },

  // LinkedIn overlays the profile photo on the lower-left of the cover.
  liCover: { top: 16, right: 16, bottom: 16, left: 260, note: 'Profile photo overlaps lower left' },

  // X crops the header by viewport and overlays the avatar.
  xHeader: { top: 24, right: 24, bottom: 90, left: 200, note: 'Avatar overlap + responsive crop' },

  // GitHub crops the social preview to roughly 2:1 in some surfaces.
  githubSocial: { top: 40, right: 60, bottom: 40, left: 60, note: 'Repo card crop' },
};

/** The largest canvas a browser will rasterise in one go. */
export const MAX_PIXELS = 16_777_216;

export function megapixels(w: number, h: number): number {
  return (w * h) / 1_000_000;
}
