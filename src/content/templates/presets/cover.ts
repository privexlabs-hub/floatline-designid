import { CANVAS } from '@/lib/artboard-sizes';
import type { Preset, Field, Platform } from '../types';
import { title, body, cta, url } from '../fields';
import type { Surface } from '@/lib/tokens';
import type { Size } from '@/lib/artboard-sizes';

const G = 'Cover · Banners';

const cv = (
  id: string, name: string, size: Size, shape: string, fields: Field[],
  surface: Surface = 'paper', props: Record<string, unknown> = {}, platform?: Platform
): Preset => ({
  id: `cv-${id}`, group: G, name, layout: 'cover', ...size, surface,
  props: { shape, ...props }, fields, ...(platform ? { platform } : {}),
});

const lockup = (b: string) => [title(''), body(b, 90), url()];

export const COVER_PRESETS: Preset[] = [
  // insetLeft clears the avatar X overlays on the lower left of the header.
  cv('x-header', 'X / Twitter header', CANVAS.xHeader, 'lockup',
    [...lockup('Workflow automation for operators who run networks.')],
    'green', { align: 'left', insetLeft: 140 }, 'x'),

  // LinkedIn puts the profile photo over the lower left — 260px of it.
  cv('li-cover', 'LinkedIn cover', CANVAS.liCover, 'lockup',
    [...lockup('One line between you and every person, terminal and system you coordinate.')],
    'paper', { align: 'left', insetLeft: 200 }, 'linkedin'),

  cv('fb-cover', 'Facebook cover', CANVAS.fbCover, 'lockup',
    [...lockup('Automation for operators who run networks.')],
    'canvas', { align: 'left' }, 'facebook'),

  cv('yt-channel', 'YouTube channel art', CANVAS.ytChannel, 'statement',
    [title('automation for operators'), body('Broadcast · capacity · answers · digest', 90), url()],
    'green', { align: 'center' }, 'youtube'),

  cv('twitch', 'Twitch banner', CANVAS.twitchBanner, 'lockup',
    [...lockup('Building the coordination layer, live.')], 'ink', { align: 'center' }),

  cv('podcast', 'Podcast cover', CANVAS.podcastCover, 'square',
    [title('the operator’s line'), body('Conversations with people who run networks.', 90), url()],
    'green'),

  cv('newsletter', 'Newsletter header', CANVAS.newsletterHeader, 'statement',
    [title('the monday line'), body('One operating idea, every Monday.', 90), url()],
    'amber', { align: 'center' }, 'email'),

  cv('og', 'Website / Open Graph cover', CANVAS.ogCover, 'statement',
    [title('automation for operators who run networks'), body('Broadcast once. Match capacity. Answer once. Read the digest.', 90), url()],
    'paper', { align: 'center' }, 'web'),

  cv('event', 'Event banner', CANVAS.eventBanner, 'statement',
    [title('a network that runs itself'), body('Thursday · 16:00 WAT · free', 90), cta('Save a seat'), url()],
    'inverted', { align: 'center' }),

  cv('community', 'Community banner', CANVAS.communityBanner, 'statement',
    [title('operators, comparing notes'), body('Where people running networks work out loud.', 90), url()],
    'canvas', { align: 'center' }),

  /* ---- Added beyond the brief. ---- */

  cv('github', 'GitHub social preview', CANVAS.githubSocial, 'statement',
    [title('floatline'), body('The coordination layer for distributed networks. Frontend, docs and SDKs.', 90), url('github.com/floatline')],
    'ink', { align: 'left' }),

  cv('slack', 'Discord / Slack banner', CANVAS.twitchBanner, 'lockup',
    [...lockup('The operators’ room. Bring a real problem.')], 'canvas', { align: 'center' }),
];
