import { CANVAS } from '@/lib/artboard-sizes';
import type { Preset, Field } from '../types';
import { text, area, lines, eyebrow, title, body, cta, url, badge, image } from '../fields';
import type { Surface } from '@/lib/tokens';

const G = 'Portrait · 1080×1350';

const po = (id: string, name: string, shape: string, fields: Field[], surface: Surface = 'paper'): Preset => ({
  id: `po-${id}`, group: G, name, layout: 'portrait', ...CANVAS.portrait, surface,
  props: { shape }, fields, platform: 'instagram',
});

export const PORTRAIT_PRESETS: Preset[] = [
  po('announce', 'Feed post · Announcement', 'announce', [
    badge('New'), eyebrow('Announcement'),
    title('runs retry themselves'),
    body('A failed step no longer stops the workflow. Floatline retries with backoff and tells you only when it gives up.'),
    cta('Read the changelog'), url(),
  ], 'green'),

  po('product', 'Feed post · Product', 'product', [
    badge('Product'), eyebrow('Capacity matching'),
    title('supply meets demand without a phone call'),
    body('Members declare what they have. Others declare what they need. Floatline pairs them by distance, size and history.'),
    lines('items', 'Points', ['Matched in seconds, not mornings', 'Works over WhatsApp, SMS or voice', 'Every match is on the record']),
    cta('See it work'), url(),
  ]),

  po('quote', 'Feed post · Quote', 'quote', [
    eyebrow('In their words'),
    area('quote', 'Quote', 'I used to open thirty-two chats before breakfast. Now I read one digest and send one message.', 180),
    text('attribution', 'Attribution', 'Aisha O. · 32 sub-agents · Surulere'), url(),
  ], 'canvas'),

  po('stat', 'Feed post · Big stat', 'stat', [
    eyebrow('Impact'), text('stat', 'Stat', '2–4 hrs'),
    text('statLabel', 'Stat label', 'given back per day, per operator'),
    body('Measured across 40 operator networks in their first month.'),
    cta('See the numbers'), url(),
  ], 'amber'),

  po('educational', 'Feed post · Educational', 'educational', [
    eyebrow('How it works'),
    title('four steps, fifteen minutes'),
    body('From nothing to a delivered broadcast, without installing anything on anyone’s phone.'),
    lines('items', 'Steps', ['Connect a channel', 'Import the list', 'Write one broadcast', 'Read tomorrow’s digest']),
    cta('Start free'), url(),
  ]),

  po('testimonial', 'Feed post · Testimonial', 'testimonial', [
    eyebrow('Customer'),
    area('quote', 'Quote', 'We found out about failed drops the next morning. Now we find out in eleven minutes.', 180),
    text('attribution', 'Attribution', 'Ops manager · 120 riders · Lagos'),
    image('logo', 'Customer logo'),
    cta('Read the story'), url(),
  ], 'ink'),

  po('case-study', 'Feed post · Case study', 'caseStudy', [
    badge('Case study'), eyebrow('Agent networks'),
    title('32 sub-agents, one line'),
    lines('items', 'Label | Value', [
      'Network | 32 sub-agents across Surulere and Akoka',
      'Before | 3h 40m a day coordinating by hand',
      'After | 22 minutes a day, 29 / 32 read within a minute',
    ]),
    cta('Read the case study'), url(),
  ]),

  po('cta', 'Feed post · CTA', 'cta', [
    badge('Start free'), eyebrow('Get started'),
    title('put your network on one line'),
    body('One channel, one list, one broadcast. Fifteen minutes, no card.'),
    cta('Start free'), url(),
  ], 'inverted'),

  /* ---- Added beyond the brief. ---- */

  po('compare', 'Feed post · Comparison', 'compare', [
    eyebrow('Comparison'),
    title('a group chat is not a workflow'),
    text('leftLabel', 'Left label', 'Group chat'),
    lines('leftItems', 'Left items', ['No idea who read it', 'Answers scroll away', 'Everyone replies to everyone']),
    text('rightLabel', 'Right label', 'Floatline'),
    lines('rightItems', 'Right items', ['29 / 32 read, by name', 'Answers live in the knowledge base', 'Replies come back to you only']),
    url(),
  ], 'canvas'),

  po('cover', 'Feed post · Carousel cover', 'announce', [
    badge('Carousel'), eyebrow('Swipe'),
    title('how a network stops running on your thumbs'),
    body('Twelve slides. Six minutes. One worked example.'),
    cta('Swipe →'), url(),
  ], 'green'),

  po('hiring', 'Feed post · Hiring', 'product', [
    badge('Hiring'), eyebrow('Careers'),
    title('integrations engineer'),
    body('You will build the connectors that let a workflow reach whatever a network already runs on.'),
    lines('items', 'Details', ['Remote · WAT ±3', 'TypeScript, queues, webhooks', 'Ships to real operators weekly']),
    cta('See the role'), url('floatline.app/careers'),
  ]),
];
