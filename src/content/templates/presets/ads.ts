import { CANVAS, type Size } from '@/lib/artboard-sizes';
import type { Preset, Field } from '../types';
import { text, area, lines, title, body, cta, url, badge, eyebrow } from '../fields';
import type { Surface } from '@/lib/tokens';

const G = 'Ads · Multi-format';

const ad = (
  id: string, name: string, size: Size, shape: string, fields: Field[],
  surface: Surface = 'paper', kind = 'statement'
): Preset => ({
  id: `ad-${id}`, group: G, name, layout: 'ad', ...size, surface,
  props: { shape, kind }, fields,
});

export const AD_PRESETS: Preset[] = [
  ad('launch', 'Ad · Product launch', CANVAS.adFeed, 'feed', [
    badge('Live'), title('floatline is live'),
    body('Workflow automation for operators who run networks. Start with one channel.'),
    cta('Start free'), url(),
  ], 'green'),

  ad('feature', 'Ad · Feature announcement', CANVAS.adLandscape, 'landscape', [
    badge('New'), title('capacity matching, across channels'),
    body('Members declare what they have. Floatline finds who needs it.'),
    cta('See it work'), url(),
  ]),

  ad('lead-gen', 'Ad · Lead generation', CANVAS.adFeed, 'feed', [
    badge('Free guide'), title('the coordination audit'),
    body('Nine questions that show where your morning actually goes.'),
    lines('items', 'Points', ['No signup for the first section', 'Takes six minutes', 'Built from 40 operator interviews']),
    cta('Get the audit'), url(),
  ], 'canvas'),

  ad('awareness', 'Ad · Brand awareness', CANVAS.adLandscape, 'landscape', [
    title('coordination is work'),
    body('It should be paid for in software, not in hours.'),
    cta('See how'), url(),
  ], 'ink'),

  ad('retargeting', 'Ad · Retargeting', CANVAS.adFeed, 'feed', [
    badge('Still deciding?'), title('one channel. one list. one broadcast.'),
    body('Fifteen minutes to the first send. No card, and nothing to install on anyone’s phone.'),
    cta('Pick up where you left off'), url(),
  ], 'amber'),

  ad('proof', 'Ad · Customer proof', CANVAS.adFeed, 'feed', [
    eyebrow('Proof'),
    area('quote', 'Quote', 'I used to open thirty-two chats before breakfast. Now I read one digest.', 160),
    text('attribution', 'Attribution', 'Aisha O. · 32 sub-agents'),
    cta('Read the story'), url(),
  ], 'canvas', 'proof'),

  ad('stat', 'Ad · Big stat', CANVAS.adFeed, 'feed', [
    text('stat', 'Stat', '2–4 hrs'),
    text('statLabel', 'Stat label', 'given back per day, per operator'),
    cta('See the numbers'), url(),
  ], 'amber', 'stat'),

  ad('offer', 'Ad · Offer / promotion', CANVAS.adLandscape, 'landscape', [
    badge('Launch pricing'), title('first three months, half price'),
    body('For networks that connect a channel before the end of the quarter.'),
    cta('Claim it'), url('floatline.app/pricing'),
  ], 'inverted'),

  ad('event', 'Ad · Event', CANVAS.adStory, 'story', [
    badge('Live session'), title('a network that runs itself'),
    body('Thursday · 16:00 WAT. Free, 200 seats, recording sent to everyone.'),
    cta('Save a seat'), url(),
  ], 'green'),

  ad('download', 'Ad · App / product download', CANVAS.adStory, 'story', [
    badge('Start free'), title('put your network on one line'),
    body('Nothing to install. It runs on the channel they already open.'),
    cta('Start free'), url(),
  ]),

  /* ---- Added beyond the brief. ---- */

  ad('comparison', 'Ad · Comparison', CANVAS.adLandscape, 'landscape', [
    title('a group chat is not a workflow'),
    body('No read receipts. No record. No way to know who missed it.'),
    lines('items', 'Points', ['29 / 32 read, by name', 'Every run auditable']),
    cta('See the difference'), url(),
  ], 'canvas'),

  ad('video-cover', 'Ad · Video cover', CANVAS.adStory, 'story', [
    eyebrow('Watch'),
    area('quote', 'Quote', 'Show me your morning. Mine was thirty-two tabs.', 160),
    text('attribution', 'Attribution', 'Aisha O. · 32 sub-agents'),
    cta('Watch'), url(),
  ], 'ink', 'proof'),

  ad('mpu', 'Ad · MPU 300×250', CANVAS.adMpu, 'mpu', [
    title('one line. whole network.', 34),
    cta('Start free'),
  ], 'green'),
];
