import { CANVAS, type Size } from '@/lib/artboard-sizes';
import type { Preset, Field } from '../types';
import { text, area, lines, title, body, cta, url, badge, eyebrow } from '../fields';
import type { Surface } from '@/lib/tokens';

const G = 'Web · Multi-format';

const we = (id: string, name: string, size: Size, shape: string, fields: Field[], surface: Surface = 'paper'): Preset => ({
  id: `we-${id}`, group: G, name, layout: 'web', ...size, surface,
  props: { shape }, fields, platform: 'web',
});

export const WEB_PRESETS: Preset[] = [
  we('hero', 'Website · Hero', CANVAS.webHero, 'hero', [
    badge('Workflow automation'),
    title('one line between you and your whole network'),
    body('Broadcast once. Match capacity automatically. Answer the same question once instead of forty times. Read one digest instead of thirty-two chats.'),
    lines('items', 'Points', ['Works on WhatsApp, SMS, voice, email and Slack', 'Nothing to install on anyone’s phone', 'Every run auditable end to end']),
    cta('Start free'), url(),
  ]),

  we('feature', 'Website · Feature', CANVAS.webHero, 'feature', [
    badge('Broadcast'), eyebrow('Feature'),
    title('write once, delivered verbatim'),
    body('Every member gets exactly what you wrote, on the channel they actually read, with delivery reported as a fraction.'),
    lines('items', 'Points', ['Sent, delivered, read — tracked separately', 'Bounces named, not counted', 'Retries with backoff']),
    text('barLabel', 'Bar label', '29 / 32 read · 3 pending'),
    cta('See broadcast'), url(),
  ], 'canvas'),

  we('product', 'Website · Product', CANVAS.webHero, 'product', [
    badge('The console'), eyebrow('Product'),
    title('the whole network, one screen'),
    body('Today’s digest, every broadcast, the knowledge base and capacity across the network.'),
    lines('items', 'Points', ['Today · Broadcasts · Knowledge · Capacity · Members', 'Approve drafts before they send', 'Export anything as data']),
    cta('Tour the console'), url(),
  ]),

  we('testimonial', 'Website · Testimonial', CANVAS.webHero, 'testimonial', [
    eyebrow('Customer'),
    area('quote', 'Quote', 'I used to open thirty-two chats before breakfast. Now I read one digest and send one message.', 200),
    text('attribution', 'Attribution', 'Aisha O. · 32 sub-agents · Surulere'),
    url(),
  ], 'green'),

  we('case-study', 'Website · Case study', CANVAS.webHero, 'caseStudy', [
    eyebrow('Case study'),
    title('32 sub-agents, one line'),
    lines('items', 'Value | Label', ['3h 18m|given back daily', '29 / 32|read within a minute', '₦4.2M|matched in month one']),
    cta('Read the case study'), url(),
  ], 'canvas'),

  we('cta', 'Website · CTA', CANVAS.webBanner, 'cta', [
    title('put your network on one line'),
    body('One channel, one list, one broadcast. Fifteen minutes, no card.'),
    cta('Start free'), url(),
  ], 'inverted'),

  we('blog-hero', 'Website · Blog hero', CANVAS.webHero, 'blogHero', [
    badge('Article'), eyebrow('7 min read'),
    title('the hidden cost of coordinating by hand'),
    body('Two to four hours a day, every day, spent retyping the same message into different chats.'),
    url(),
  ]),

  we('og', 'Website · Open Graph', CANVAS.ogCover, 'og', [
    badge('Floatline'),
    title('automation for operators who run networks'),
    body('Broadcast once. Match capacity. Answer once. Read the digest.'),
    url(),
  ], 'green'),

  we('share', 'Website · Social share', CANVAS.ogCover, 'share', [
    eyebrow('Floatline'),
    title('a group chat is not a workflow'),
    body('No read receipts. No record. No way to know who missed it.'),
    url(),
  ], 'ink'),

  we('banner', 'Website · Banner', CANVAS.webBanner, 'banner', [
    badge('Launch pricing'),
    title('first three months, half price'),
    body('For networks that connect a channel before the end of the quarter.'),
    cta('Claim it'), url('floatline.app/pricing'),
  ], 'amber'),

  /* ---- Added beyond the brief. ---- */

  we('pricing', 'Website · Pricing', CANVAS.webHero, 'pricing', [
    eyebrow('Pricing'),
    title('priced per network, not per seat'),
    lines('items', 'Tier | Price | Note', [
      'Starter|₦25,000|Up to 20 members, one channel',
      'Network|₦40,000|Up to 60 members, every channel',
      'Operator|₦60,000|Unlimited members, API and webhooks',
    ]),
    cta('See full pricing'), url('floatline.app/pricing'),
  ], 'canvas'),

  we('integrations', 'Website · Integrations', CANVAS.webHero, 'integrations', [
    eyebrow('Integrations'),
    title('it speaks to what you already run'),
    lines('items', 'Connectors', ['WhatsApp', 'SMS', 'Voice / IVR', 'Email', 'Slack', 'Webhooks', 'REST API', 'CSV import']),
    cta('Browse connectors'), url(),
  ]),

  we('docs', 'Website · Docs hero', CANVAS.webHero, 'docs', [
    badge('Docs'), eyebrow('Quickstart'),
    title('your first run, in fifteen minutes'),
    body('Connect a channel, import a list, send one broadcast, read the delivery report.'),
    lines('items', 'Steps', ['Connect a channel', 'Import the list', 'Send the broadcast', 'Read the report']),
    cta('Open the docs'), url('docs.floatline.app'),
  ], 'canvas'),

  we('changelog', 'Website · Changelog', CANVAS.webHero, 'changelog', [
    badge('v1.4'), eyebrow('Changelog'),
    title('what shipped this week'),
    body('Retries, named bounces, smarter drafts and per-timezone digests.'),
    lines('items', 'Items', ['Runs retry with backoff', 'Bounces reported by name', 'Drafts learn from your edits', 'Digest scheduled per timezone']),
    cta('Full changelog'), url(),
  ]),
];
