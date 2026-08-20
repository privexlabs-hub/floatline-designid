import { CANVAS, type Size } from '@/lib/artboard-sizes';
import type { Preset, Field } from '../types';
import { text, area, lines, title, body, cta, url, eyebrow } from '../fields';
import type { Surface } from '@/lib/tokens';

const G = 'Email · Multi-format';

const em = (id: string, name: string, size: Size, shape: string, fields: Field[], surface: Surface = 'paper'): Preset => ({
  id: `em-${id}`, group: G, name, layout: 'email', ...size, surface,
  props: { shape }, fields, platform: 'email',
});

/** Flat images to drop into a campaign — not HTML email templates. */
export const EMAIL_PRESETS: Preset[] = [
  em('header', 'Email · Header', CANVAS.emailHeader, 'header', [
    eyebrow('The Monday line'), title('one operating idea, every Monday'),
  ], 'green'),

  em('announce', 'Email · Product announcement', CANVAS.emailBody, 'announce', [
    eyebrow('Announcement'), title('runs now retry on their own'),
    body('A failed step no longer stops the workflow. Floatline retries with backoff and tells you only when it gives up.'),
    lines('items', 'Points', ['Automatic retry with backoff', 'One notification, not twelve', 'Full run history retained']),
    cta('Read the changelog'), url(),
  ]),

  em('feature', 'Email · Feature launch', CANVAS.emailBody, 'announce', [
    eyebrow('New'), title('capacity matching across channels'),
    body('Members declare what they have on WhatsApp or SMS. Floatline pairs them by distance, size and history.'),
    lines('items', 'Points', ['Matched in seconds', 'Every match on the record', 'Works over any connected channel']),
    cta('See it work'), url(),
  ], 'canvas'),

  em('newsletter', 'Email · Newsletter', CANVAS.emailBody, 'newsletter', [
    eyebrow('Issue 14'), title('the cost of the morning call'),
    body('Forty minutes a day, five days a week, to establish facts that could have arrived on their own.'),
    lines('items', 'In this issue', ['The morning-call audit', 'What a good digest contains', 'Reader question — retries']),
    cta('Read online'), url(),
  ]),

  em('event', 'Email · Event', CANVAS.emailBody, 'event', [
    eyebrow('Live session'), title('a network that runs itself'),
    body('Forty minutes on broadcast, capacity matching and the morning digest. Bring a real problem.'),
    lines('items', 'Details', ['Thursday · 16:00 WAT', 'Free · 200 seats', 'Recording sent to everyone who registers']),
    cta('Save a seat'), url(),
  ], 'green'),

  em('promo', 'Email · Promotion', CANVAS.emailBody, 'promo', [
    eyebrow('Launch pricing'),
    text('stat', 'Stat', '50%'),
    text('statLabel', 'Stat label', 'off the first three months'),
    title('for networks connecting a channel this quarter'),
    cta('Claim it'), url('floatline.app/pricing'),
  ], 'amber'),

  em('story', 'Email · Customer story', CANVAS.emailBody, 'story', [
    eyebrow('Customer story'),
    area('quote', 'Quote', 'I used to open thirty-two chats before breakfast. Now I read one digest and send one message.', 200),
    text('attribution', 'Attribution', 'Aisha O. · 32 sub-agents · Surulere'),
    cta('Read the story'), url(),
  ], 'ink'),

  em('cta-banner', 'Email · CTA banner', CANVAS.emailBanner, 'ctaBanner', [
    title('put your network on one line'),
    body('One channel, one list, one broadcast.'),
    cta('Start free'), url(),
  ], 'inverted'),

  /* ---- Added beyond the brief. ---- */

  em('onboarding', 'Email · Onboarding step', CANVAS.emailBody, 'onboarding', [
    eyebrow('Step 2 of 4'), title('import your list'),
    body('Paste it, upload a CSV, or sync it from wherever it already lives.'),
    lines('items', 'Steps', ['Paste or upload', 'Map the columns', 'Confirm the count', 'Send a test to yourself']),
    cta('Continue setup'), url(),
  ], 'canvas'),

  em('digest', 'Email · Weekly digest', CANVAS.emailBody, 'digest', [
    eyebrow('Week 32'), title('what your network did this week'),
    lines('items', 'Lines', [
      '14 broadcasts sent · 96% read within 10 minutes',
      '38 capacity matches, worth ₦4.2M moved',
      '3 members at risk — Terminal 19, 24, 31',
      '64% of questions answered from the knowledge base',
    ]),
    cta('Open the console'), url(),
  ]),

  em('footer', 'Email · Footer', CANVAS.emailHeader, 'footer', [
    title('floatline'),
    body('Lagos · remote. Unsubscribe any time.'),
    url(),
  ], 'canvas'),
];
