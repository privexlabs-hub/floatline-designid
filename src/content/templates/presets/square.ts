import { CANVAS } from '@/lib/artboard-sizes';
import type { Preset, Field } from '../types';
import { text, area, lines, eyebrow, title, body, cta, url, badge, image } from '../fields';
import type { Surface } from '@/lib/tokens';

const G = 'Square · 1080×1080';

/** Terse factory — these files are long enough without the object shape repeated. */
const sq = (
  id: string,
  name: string,
  shape: string,
  fields: Field[],
  surface: Surface = 'paper',
  props: Record<string, unknown> = {}
): Preset => ({
  id: `sq-${id}`,
  group: G,
  name,
  layout: 'square',
  ...CANVAS.square,
  surface,
  props: { shape, ...props },
  fields,
  platform: 'instagram',
});

export const SQUARE_PRESETS: Preset[] = [
  sq('normal', 'Normal post', 'statement', [
    eyebrow('Floatline'),
    title('one line between you and your whole network'),
    body('Broadcast once. Match capacity automatically. Answer the same question once instead of forty times.'),
    cta('See how it works'),
    url(),
  ]),

  sq('feature', 'Feature announcement', 'announce', [
    badge('New'),
    eyebrow('Feature'),
    title('capacity matching, now across channels'),
    body('Members declare what they have on WhatsApp or SMS. Floatline pairs them by distance, size and history.'),
    cta('Read the changelog'),
    url(),
  ], 'green'),

  sq('product-update', 'Product update', 'meta', [
    badge('Update'),
    eyebrow('Product'),
    title('runs now retry on their own'),
    body('A failed step no longer stops the workflow. Floatline retries with backoff and tells you only when it gives up.'),
    lines('items', 'Detail lines', ['Automatic retry with backoff', 'One notification, not twelve', 'Full run history retained']),
    cta('See the release'),
    url(),
  ]),

  sq('quote', 'Customer quote', 'quote', [
    eyebrow('In their words'),
    area('quote', 'Quote', 'I used to open thirty-two chats before breakfast. Now I read one digest and send one message.', 180),
    text('attribution', 'Attribution', 'Aisha O. · 32 sub-agents · Surulere'),
    image('logo', 'Customer logo'),
    url(),
  ], 'canvas'),

  sq('testimonial', 'Customer testimonial', 'quote', [
    eyebrow('Customer'),
    area('quote', 'Quote', 'The morning call used to take forty minutes. Now it takes four, and it is about exceptions.', 180),
    text('attribution', 'Attribution', 'Dispatch lead · 40-technician region'),
    image('logo', 'Customer logo'),
    cta('Read the story'),
    url(),
  ], 'ink'),

  sq('big-stat', 'Big stat card', 'stat', [
    eyebrow('Impact'),
    text('stat', 'Stat', '2–4 hrs'),
    text('statLabel', 'Stat label', 'given back per day, per operator'),
    title(''),
    body('Measured across 40 operator networks in their first month.'),
    url(),
  ], 'amber'),

  sq('insight', 'Data / insight', 'stat', [
    eyebrow('Data'),
    text('stat', 'Stat', '64%'),
    text('statLabel', 'Stat label', 'of inbound answered straight from the knowledge base'),
    title(''),
    body('Six questions account for most of any queue. Answer them once.'),
    url(),
  ], 'canvas'),

  sq('launch', 'Launch / milestone', 'announce', [
    badge('Live'),
    eyebrow('Milestone'),
    title('floatline is live'),
    body('Workflow automation for operators who run networks. Start with one channel and one broadcast.'),
    cta('Start free'),
    url(),
  ], 'inverted'),

  sq('event', 'Event announcement', 'meta', [
    badge('Event'),
    eyebrow('Live session'),
    title('building a network that runs itself'),
    body('A 40-minute working session on broadcast, capacity matching and the morning digest.'),
    lines('items', 'Details', ['Thursday · 16:00 WAT', 'Free · 200 seats', 'Recording sent to everyone who registers']),
    cta('Save a seat'),
    url(),
  ]),

  sq('hot-take', 'Industry hot take', 'question', [
    eyebrow('Hot take'),
    title('most “automation” is just a form that emails someone'),
    body('If a human still has to read it, retype it and chase it, nothing was automated.'),
    lines('items', 'Chips', ['Agree', 'Disagree']),
    url(),
  ], 'ink'),

  sq('educational', 'Educational / did you know', 'list', [
    eyebrow('Did you know'),
    title('four things a broadcast should tell you'),
    lines('items', 'Items', [
      'Who received it, as a fraction — not a percentage',
      'Who read it, separately from who received it',
      'Which numbers bounced, by name',
      'What it cost to send',
    ]),
    cta('See delivery reporting'),
    url(),
  ]),

  sq('blog', 'Blog promo', 'meta', [
    badge('Article'),
    eyebrow('On the blog'),
    title('the hidden cost of coordinating by hand'),
    body('Two to four hours a day, every day, spent retyping the same message into different chats.'),
    lines('items', 'Detail lines', ['7 min read']),
    cta('Read the post'),
    url(),
  ], 'canvas'),

  sq('case-study', 'Case study', 'split', [
    eyebrow('Case study'),
    title('32 sub-agents, one line'),
    text('leftLabel', 'Left label', 'Before'),
    area('leftBody', 'Left body', 'Thirty-two separate chats. The same question forty times a day. Float idle in one terminal while another turned customers away.'),
    text('rightLabel', 'Right label', 'After'),
    area('rightBody', 'Right body', 'One broadcast reaches everyone in ten seconds. Float matches itself. The digest names the terminal at risk before it is pulled.'),
    cta('Read the case study'),
    url(),
  ]),

  sq('spotlight', 'Product / feature spotlight', 'meta', [
    badge('Spotlight'),
    eyebrow('Knowledge base'),
    title('answer it once'),
    body('Curate an answer one tap at a time. The network gets it instantly, and the next draft is better.'),
    lines('items', 'Detail lines', ['Approve or edit each draft', 'Works in the language people actually write in', 'Never answers what it has not been taught']),
    cta('See the knowledge base'),
    url(),
  ], 'green'),

  sq('comparison', 'Comparison / vs alternatives', 'compare', [
    eyebrow('Comparison'),
    title('a group chat is not a workflow'),
    text('leftLabel', 'Left label', 'Group chat'),
    lines('leftItems', 'Left items', ['No idea who read it', 'Answers scroll away', 'No record of what was agreed', 'Everyone replies to everyone']),
    text('rightLabel', 'Right label', 'Floatline'),
    lines('rightItems', 'Right items', ['29 / 32 read, by name', 'Answers live in the knowledge base', 'Every run is on the record', 'Replies come back to you only']),
    url(),
  ]),

  sq('community', 'Community spotlight', 'quote', [
    eyebrow('Community'),
    area('quote', 'Quote', 'We found out about failed drops the next morning. Now we find out in eleven minutes.', 180),
    text('attribution', 'Attribution', 'Ops manager · 120 riders · Lagos'),
    url(),
  ], 'amber'),

  sq('hiring', 'Hiring / careers', 'meta', [
    badge('Hiring'),
    eyebrow('Careers'),
    title('we are hiring an integrations engineer'),
    body('You will build the connectors that let a workflow reach whatever a network already runs on.'),
    lines('items', 'Detail lines', ['Remote · WAT ±3', 'TypeScript, queues, webhooks', 'Ships to real operators weekly']),
    cta('See the role'),
    url('floatline.app/careers'),
  ]),

  sq('partnership', 'Partnership announcement', 'announce', [
    badge('Partnership'),
    eyebrow('Together'),
    title('floatline × your channel provider'),
    body('Send over the provider you already use. Same numbers, same rates, one workflow layer on top.'),
    cta('Read the announcement'),
    url(),
  ], 'green'),

  sq('lighthearted', 'Lighthearted / meme', 'question', [
    eyebrow('Friday'),
    title('“did you see my message?” × 32'),
    body('There is a better way to find out.'),
    lines('items', 'Chips', ['29 / 32 read', '3 pending']),
    url(),
  ], 'canvas'),

  sq('cta', 'CTA / sign up', 'announce', [
    badge('Start free'),
    eyebrow('Get started'),
    title('put your network on one line'),
    body('Connect a channel, import your list, send one broadcast. Fifteen minutes.'),
    cta('Start free'),
    url(),
  ], 'inverted'),

  /* ---- Added beyond the brief. See the README's catalog notes. ---- */

  sq('integration', 'Integration / connector', 'meta', [
    badge('Connector'),
    eyebrow('Integrations'),
    title('floatline now speaks to your stack'),
    body('Trigger a run from a webhook. Push the result anywhere that listens.'),
    lines('items', 'Connectors', ['WhatsApp · SMS · Voice', 'Slack · Email', 'Webhooks · REST API']),
    cta('Browse connectors'),
    url(),
  ]),

  sq('changelog', 'Changelog', 'list', [
    eyebrow('Changelog · v1.4'),
    title('what shipped this week'),
    lines('items', 'Items', [
      'Runs retry automatically with backoff',
      'Delivery reporting shows bounces by name',
      'Knowledge base drafts learn from your edits',
      'Digest can be scheduled per timezone',
    ]),
    cta('Full changelog'),
    url(),
  ], 'canvas'),

  sq('security', 'Security & trust', 'list', [
    eyebrow('Trust'),
    title('what we do with your network’s data'),
    lines('items', 'Items', [
      'Messages are never used to train anything',
      'Exports and deletion on request, same day',
      'Every run is auditable end to end',
      'Least-privilege access, reviewed quarterly',
    ]),
    cta('Read the trust page'),
    url('floatline.app/trust'),
  ], 'ink'),

  sq('pricing', 'Pricing', 'progress', [
    eyebrow('Pricing'),
    title('priced per network, not per seat'),
    body('Your network grows without your bill jumping a tier every time someone joins.'),
    text('barLabel', 'Bar label', '68% of tier capacity used'),
    text('amount', 'Amount', '25,000'),
    url('floatline.app/pricing'),
  ], 'amber'),

  sq('behind', 'Behind the build', 'split', [
    eyebrow('Behind the build'),
    title('why we do not queue on the client'),
    text('leftLabel', 'Left label', 'What we tried'),
    area('leftBody', 'Left body', 'Batching sends in the browser. Fast to build, and wrong the moment a tab closes.'),
    text('rightLabel', 'Right label', 'What we ship'),
    area('rightBody', 'Right body', 'Every broadcast is a durable run. Close the tab, lose your signal — it still finishes.'),
    url(),
  ], 'canvas'),
];
