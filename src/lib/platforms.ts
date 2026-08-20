import type { Platform } from '@/content/templates/types';

/**
 * Caption and alt-text limits, for the counters in the field panel. These are
 * the caption limits of the destination POST, not of the image — the image has
 * no limit. Checked 2026-08-19.
 */
export const PLATFORM_LIMITS: Record<Platform, { label: string; caption: number; alt: number }> = {
  x: { label: 'X', caption: 280, alt: 1000 },
  linkedin: { label: 'LinkedIn', caption: 3000, alt: 300 },
  instagram: { label: 'Instagram', caption: 2200, alt: 100 },
  youtube: { label: 'YouTube', caption: 5000, alt: 0 },
  facebook: { label: 'Facebook', caption: 63206, alt: 1000 },
  tiktok: { label: 'TikTok', caption: 2200, alt: 0 },
  email: { label: 'email', caption: 0, alt: 250 },
  web: { label: 'the web', caption: 0, alt: 250 },
};
