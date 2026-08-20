import { CANVAS } from '@/lib/artboard-sizes';
import type { Preset, Field } from '../types';
import { text, lines, title, body, cta, eyebrow } from '../fields';
import type { Surface } from '@/lib/tokens';

const G = 'Product · Kit showcase';

const kt = (id: string, name: string, w: number, h: number, shape: string, fields: Field[], surface: Surface = 'paper'): Preset => ({
  id: `kt-${id}`, group: G, name, layout: 'kit', w, h, surface, props: { shape }, fields,
});

/**
 * Added beyond the brief on purpose. The imported design system's two richest
 * artefacts are the console and the conversation surface, and nothing in the
 * social catalog could show either. These render them as drawn mocks — not
 * screenshots, which would need an image fetched at capture time and would go
 * stale the moment the console changes.
 */
export const KIT_PRESETS: Preset[] = [
  kt('console-square', 'Console · Square', CANVAS.square.w, CANVAS.square.h, 'console', [
    eyebrow('The console'),
    title('the whole network, one screen'),
    body('Today’s digest, capacity across every member, and who is at risk.'),
    lines('tiles', 'Tiles (Label|Value)', ['Broadcast|29 / 32', 'Capacity|68%', 'At risk|3']),
    lines('rows', 'Rows (Name|Status|Amount|Percent)', [
      'Bisi Adeyemi|on-track|300000|84',
      'Chinedu Okafor|at-risk|80000|31',
      'Musa Bello|failed|0|6',
    ]),
    text('url', 'Browser URL', 'app.floatline.io'),
    cta('Tour the console'),
    text('footerUrl', 'Footer URL', 'floatline.app'),
  ]),

  kt('console-web', 'Console · Web hero', CANVAS.webHero.w, CANVAS.webHero.h, 'console', [
    eyebrow('Product'),
    title('stop reading thirty-two chats'),
    body('One screen for the digest, the broadcasts, the knowledge base and capacity.'),
    lines('tiles', 'Tiles (Label|Value)', ['Read', '29 / 32', 'Idle capacity|₦300K', 'At risk|3']),
    lines('rows', 'Rows (Name|Status|Amount|Percent)', [
      'Bisi Adeyemi|on-track|300000|84',
      'Chinedu Okafor|at-risk|80000|31',
    ]),
    text('url', 'Browser URL', 'app.floatline.io'),
    cta('Tour the console'),
    text('footerUrl', 'Footer URL', 'floatline.app'),
  ], 'canvas'),

  kt('chat-square', 'Conversation · Square', CANVAS.square.w, CANVAS.square.h, 'chat', [
    eyebrow('On any channel'),
    title('capacity matched in four seconds'),
    body('Members talk where they already are. Floatline does the pairing.'),
    text('channel', 'Channel', 'WhatsApp'),
    text('channelName', 'Thread name', 'Floatline'),
    lines('messages', 'Messages (from|text|meta)', [
      'them|need ₦80K cash at Akoka',
      'bot|Bisi has ₦300K idle 1.2km away. Send contact?|matched in 4s',
      'them|yes',
      'bot|Contact sent to both. Confirm when settled.|29 / 32 read',
    ]),
    cta('See capacity matching'),
    text('footerUrl', 'Footer URL', 'floatline.app'),
  ]),

  kt('chat-story', 'Conversation · Story', CANVAS.vertical.w, CANVAS.vertical.h, 'chat', [
    eyebrow('Live'),
    title('it runs where they already are'),
    body('No app to install. No new habit to teach.'),
    text('channel', 'Channel', 'SMS'),
    text('channelName', 'Thread name', 'Floatline'),
    lines('messages', 'Messages (from|text|meta)', [
      'bot|Terminal 19 is at 23% of today’s target. 1 day left.|07:00 digest',
      'them|send bisi to akoka',
      'bot|Done. Bisi notified, ETA 25 min.|delivered',
    ]),
    cta('Start free'),
    text('footerUrl', 'Footer URL', 'floatline.app'),
  ], 'green'),
];
