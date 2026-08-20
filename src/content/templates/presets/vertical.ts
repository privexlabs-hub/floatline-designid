import { CANVAS } from '@/lib/artboard-sizes';
import type { Preset, Field } from '../types';
import { text, area, lines, eyebrow, title, body, cta, url, badge } from '../fields';
import type { Surface } from '@/lib/tokens';

const G = 'Vertical · 1080×1920';

const ve = (
  id: string,
  name: string,
  shape: string,
  fields: Field[],
  surface: Surface = 'paper'
): Preset => ({
  id: `ve-${id}`,
  group: G,
  name,
  layout: 'vertical',
  ...CANVAS.vertical,
  surface,
  props: { shape },
  fields,
  platform: 'instagram',
});

export const VERTICAL_PRESETS: Preset[] = [
  ve('launch', 'Story / Reel · Launch', 'launch', [
    badge('Live'),
    eyebrow('Launch'),
    title('floatline is live'),
    body('Workflow automation for operators who run networks.'),
    cta('Start free'),
    url(),
  ], 'green'),

  ve('feature', 'Story / Reel · Feature', 'feature', [
    badge('New'),
    eyebrow('Feature'),
    title('capacity matching across channels'),
    body('Declare what you have. Floatline finds who needs it.'),
    cta('See it work'),
    url(),
  ]),

  ve('demo', 'Story / Reel · Product demo', 'demo', [
    eyebrow('Demo'),
    title('one broadcast, thirty-two people'),
    body('Ten seconds from send to first read receipt.'),
    lines('items', 'Steps', ['Write it once', 'Pick the list', 'Send', 'Watch the fraction move']),
    text('barLabel', 'Bar label', '29 / 32 read · 3 pending'),
    cta('Try it'),
    url(),
  ], 'canvas'),

  ve('stat', 'Story / Reel · Big stat', 'stat', [
    eyebrow('Impact'),
    text('stat', 'Stat', '2–4 hrs'),
    text('statLabel', 'Stat label', 'given back per day, per operator'),
    cta('See the numbers'),
    url(),
  ], 'amber'),

  ve('quote', 'Story / Reel · Quote', 'quote', [
    eyebrow('In their words'),
    area('quote', 'Quote', 'I stopped being the bottleneck in my own network.', 150),
    text('attribution', 'Attribution', 'Aisha O. · 32 sub-agents'),
    url(),
  ], 'ink'),

  ve('testimonial', 'Story / Reel · Testimonial', 'quote', [
    eyebrow('Customer'),
    area('quote', 'Quote', 'The morning call went from forty minutes to four.', 150),
    text('attribution', 'Attribution', 'Dispatch lead · 40 technicians'),
    cta('Read the story'),
    url(),
  ], 'canvas'),

  ve('info', 'Story / Reel · Info', 'info', [
    eyebrow('Good to know'),
    title('what a delivery report should tell you'),
    lines('items', 'Items', ['Sent', 'Delivered', 'Read', 'Bounced — by name']),
    url(),
  ]),

  ve('educational', 'Story / Reel · Educational', 'info', [
    eyebrow('Did you know'),
    title('a read receipt is not a delivery receipt'),
    body('They fail for different reasons. Conflating them is how a broadcast quietly misses people.'),
    lines('items', 'Items', ['Delivered — the device got it', 'Read — a human opened it']),
    url(),
  ], 'canvas'),

  ve('behind', 'Story / Reel · Behind the scenes', 'behind', [
    eyebrow('Behind the build'),
    title('why every broadcast is a durable run'),
    body('Close the tab, lose your signal — it still finishes.'),
    lines('items', 'Items', ['Queued server-side', 'Retries with backoff', 'Full history kept']),
    url(),
  ]),

  ve('announcement', 'Story / Reel · Announcement', 'launch', [
    badge('News'),
    eyebrow('Announcement'),
    title('runs now retry on their own'),
    body('A failed step no longer stops the workflow.'),
    cta('Read the changelog'),
    url(),
  ], 'green'),

  ve('countdown', 'Story / Reel · Countdown', 'countdown', [
    text('badge', 'Badge', 'Live in'),
    text('stat', 'Stat', '3 days'),
    text('statLabel', 'Stat label', 'until the working session'),
    title('building a network that runs itself'),
    cta('Save a seat'),
    url(),
  ], 'amber'),

  ve('poll', 'Story / Reel · Poll / question', 'poll', [
    eyebrow('Tell us'),
    title('how many chats before your first coffee?'),
    lines('items', 'Options', ['Under 5', '5 – 20', 'More than 20']),
    url(),
  ], 'ink'),

  ve('cta', 'Story / Reel · CTA', 'cta', [
    badge('Start free'),
    eyebrow('Get started'),
    title('put your network on one line'),
    body('Fifteen minutes to the first send.'),
    cta('Start free'),
    url(),
  ], 'inverted'),

  ve('event', 'Story / Reel · Event', 'info', [
    badge('Event'),
    eyebrow('Live session'),
    title('coordination, without the morning call'),
    lines('items', 'Details', ['Thursday · 16:00 WAT', 'Free · 200 seats', 'Recording sent to everyone']),
    cta('Save a seat'),
    url(),
  ]),

  /* ---- Added beyond the brief. ---- */

  ve('tutorial', 'Story / Reel · Tutorial step', 'demo', [
    eyebrow('Step 2 of 4'),
    title('import your list'),
    body('Paste it, upload a CSV, or sync it from wherever it already lives.'),
    lines('items', 'Steps', ['Paste or upload', 'Map the columns', 'Confirm the count']),
    text('barLabel', 'Bar label', '32 of 32 members imported'),
    url(),
  ], 'canvas'),

  ve('ugc', 'Story / Reel · UGC cover', 'quote', [
    eyebrow('From the community'),
    area('quote', 'Quote', 'Show me your morning before Floatline. Mine was thirty-two tabs.', 150),
    text('attribution', 'Attribution', '@floatline · community'),
    cta('Share yours'),
    url(),
  ], 'amber'),

  ve('before-after', 'Story / Reel · Before / after', 'info', [
    eyebrow('Before · after'),
    title('one month in'),
    lines('items', 'Items', ['Before — 3h 40m a day', 'After — 22 minutes', 'Same network. Same people.']),
    cta('See how'),
    url(),
  ], 'green'),
];
