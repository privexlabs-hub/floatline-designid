import { CANVAS, type Size } from '@/lib/artboard-sizes';
import type { Preset, Field } from '../types';
import { text, area, lines, image, eyebrow, title, body, cta, url, badge } from '../fields';
import type { Surface } from '@/lib/tokens';

const DOC = 'Document · A4';
const DECK = 'Presentation · 1920×1080';

const dp = (
  group: string, size: Size, id: string, name: string, shape: string,
  fields: Field[], surface: Surface = 'paper', props: Record<string, unknown> = {}
): Preset => ({
  id, group, name, layout: 'docPage', ...size, surface,
  props: { shape, ...props }, fields,
});

const doc = (id: string, name: string, shape: string, fields: Field[], surface: Surface = 'paper', props = {}) =>
  dp(DOC, CANVAS.docA4, `doc-${id}`, name, shape, fields, surface, props);

const slide = (id: string, name: string, shape: string, fields: Field[], surface: Surface = 'paper', props = {}) =>
  dp(DECK, CANVAS.slide169, `pres-${id}`, name, shape, fields, surface, props);

/* ------------------------------------------------------------------ */
/* A4 pages                                                            */
/* ------------------------------------------------------------------ */

export const DOCUMENT_PRESETS: Preset[] = [
  doc('cover', 'Page · Cover', 'cover', [
    badge('Report'),
    title('the cost of coordinating by hand'),
    body('What forty operator networks spend their mornings on, and what it is worth to stop.'),
    text('meta', 'Author or org', 'Floatline'),
    text('date', 'Date', 'August 2026'),
  ], 'green'),

  doc('toc', 'Page · Contents', 'toc', [
    eyebrow('Report'),
    title('Contents'),
    lines('items', 'Fallback entries (Label | page)', [
      'Executive summary|03', 'What we measured|05', 'Findings|08', 'Recommendations|12',
    ]),
  ]),

  doc('summary', 'Page · Executive summary', 'body', [
    eyebrow('Executive summary'),
    title('three hours a day, and nobody had counted them'),
    area('body', 'Opening', 'Across forty networks the same pattern held: the operator is the routing layer, and every message passes through one person twice — once outward, once back.'),
    lines('items', 'Key points', [
      'Median 3h 12m a day spent coordinating by hand',
      'Six questions account for most of every inbound queue',
      'Idle capacity sits an average of 4.5 hours before it is matched',
    ]),
    area('pullQuote', 'Pull quote', 'I used to open thirty-two chats before breakfast.', 160),
  ]),

  doc('section', 'Page · Section divider', 'section', [
    badge('Part two'),
    title('what we measured'),
    body('Method, sample and the limits of both.'),
  ], 'green'),

  doc('body', 'Page · Body', 'body', [
    eyebrow('Method'),
    title('how the sample was drawn'),
    area('body', 'Opening', 'Forty networks between nine and two hundred members, across five verticals and three countries. Participation was voluntary and unpaid.'),
    area('body2', 'Continued', 'Time was self-reported for the first two weeks and instrumented thereafter, which is why the two figures differ.'),
    lines('items', 'Points', [
      'Self-reported time ran 22% below instrumented time',
      'Networks under twenty members were over-represented',
      'No network was observed for fewer than thirty days',
    ]),
  ]),

  doc('data', 'Page · Data', 'data', [
    eyebrow('Findings'),
    title('where the morning goes'),
    body('Share of coordination time by activity, across all forty networks.'),
    text('stat', 'Stat', '3h 12m'),
    text('statLabel', 'Stat label', 'median, per operator, per day'),
    text('stat2', 'Second stat', '64%'),
    text('stat2Label', 'Second label', 'of inbound answerable from a knowledge base'),
    lines('bars', 'Bars (Label | value | percent)', [
      'Chasing status|42%|42',
      'Answering repeats|31%|31',
      'Matching capacity|18%|18',
      'Everything else|9%|9',
    ]),
    text('source', 'Source', '40 networks, Mar–Jul 2026'),
  ]),

  doc('table', 'Page · Table', 'data', [
    eyebrow('Findings'),
    title('by vertical'),
    lines('table', 'Table (first row is the head)', [
      'Vertical|Networks|Median saved',
      'Agent networks|14|3h 18m',
      'Field operations|9|2h 40m',
      'Logistics|8|2h 05m',
      'Retail|5|1h 52m',
      'Support|4|2h 25m',
    ]),
    text('source', 'Source', '40 networks, Mar–Jul 2026'),
  ], 'canvas'),

  doc('quote', 'Page · Pull quote', 'quote', [
    eyebrow('In their words'),
    area('quote', 'Quote', 'I stopped being the bottleneck in my own network.', 200),
    text('attribution', 'Attribution', 'Aisha O. · 32 sub-agents · Surulere'),
    image('logo', 'Customer logo'),
  ], 'canvas'),

  doc('findings', 'Page · Findings', 'findings', [
    eyebrow('Findings'),
    title('four things that held everywhere'),
    body('Consistent across every vertical, network size and country in the sample.'),
    lines('items', 'Findings (Head | detail)', [
      'The operator is the routing layer|Every message passes through one person twice, and that person is the constraint on the whole network.',
      'Repeats dominate the queue|Six questions accounted for a median 64% of inbound across all forty networks.',
      'Capacity idles because nobody asks|Idle capacity sat a median 4.5 hours before being matched, almost always by a phone call.',
      'Failure is discovered late|Two thirds of failures surfaced at reconciliation rather than while they could still be fixed.',
    ]),
  ]),

  doc('recommendations', 'Page · Recommendations', 'recommendations', [
    eyebrow('Recommendations'),
    title('what to do about it'),
    lines('items', 'Recommendations (Head | detail)', [
      'Measure the morning before changing it|Instrument a fortnight. Self-reported figures ran 22% low in this sample.',
      'Write the six answers down|The repeats are knowable. Curating them once removes most of the queue.',
      'Make delivery a fraction|A percentage hides who was missed. A fraction names them.',
      'Move the failure earlier|Anything discovered at reconciliation could have been discovered while it was still fixable.',
    ]),
  ]),

  doc('case-study', 'Page · Case study', 'caseStudy', [
    badge('Case study'),
    title('32 sub-agents, one line'),
    image('logo', 'Customer logo'),
    lines('items', 'Sections (Label | text)', [
      'Network|32 sub-agents across Surulere and Akoka, on Moniepoint terminals.',
      'Before|3h 40m a day coordinating by hand. Float idle in one terminal while another turned customers away.',
      'After|22 minutes a day. 29 / 32 read within a minute, and ₦4.2M matched in the first month.',
    ]),
  ]),

  doc('references', 'Page · References', 'references', [
    eyebrow('References'),
    title('References'),
    lines('items', 'References', [
      'Floatline operator study, 40 networks, March–July 2026.',
      'Interview transcripts, 18 operators, Lagos and Accra, 2026.',
      'Instrumented coordination time, n=31 networks, 30-day minimum window.',
    ]),
  ], 'canvas'),

  doc('onepager', 'Page · One-pager', 'onepager', [
    eyebrow('Floatline'),
    title('automation for operators who run networks'),
    body('One line between you and every person, terminal and system you coordinate — over WhatsApp, SMS, voice, email, Slack or your own API.'),
    text('leftLabel', 'Left label', 'The problem'),
    lines('leftItems', 'Left items', [
      'One message becomes thirty-two sends',
      'The same six questions, every day',
      'Capacity idle in one place, needed in another',
    ]),
    text('rightLabel', 'Right label', 'With Floatline'),
    lines('rightItems', 'Right items', [
      'Write once, delivered verbatim',
      '64% answered from the knowledge base',
      'Capacity matched in seconds',
    ]),
    lines('bars', 'Proof bars (Label | value | percent)', [
      'Time returned per day|3h 12m|72',
      'Inbound auto-answered|64%|64',
    ]),
  ]),

  doc('back', 'Page · Back cover', 'back', [
    title('put your network on one line'),
    body('One channel, one list, one broadcast. Fifteen minutes, no card.'),
    cta('Start free'),
    url(),
  ], 'inverted'),
];

/* ------------------------------------------------------------------ */
/* 16:9 slides                                                         */
/* ------------------------------------------------------------------ */

export const PRESENTATION_PRESETS: Preset[] = [
  slide('cover', 'Slide · Cover', 'cover', [
    badge('2026'),
    title('automation for operators who run networks'),
    body('How coordination stops being one person’s morning.'),
    text('meta', 'Presenter', 'Floatline'),
    text('date', 'Date', 'August 2026'),
  ], 'green'),

  slide('agenda', 'Slide · Agenda', 'agenda', [
    eyebrow('Agenda'),
    title('Agenda'),
    lines('items', 'Entries (Label | note)', [
      'The problem|Where the morning goes',
      'The insight|The channel is not the problem',
      'The product|Four jobs, any channel',
      'The proof|Forty networks',
      'Pricing|Per network, not per seat',
    ]),
  ]),

  slide('problem', 'Slide · Problem', 'section', [
    badge('The problem'),
    title('thirty-two chats before breakfast'),
    body('That is not a workflow. That is a person doing the job of one.'),
  ], 'ink'),

  slide('insight', 'Slide · Insight', 'body', [
    eyebrow('The insight'),
    title('the channel is not the problem — the retyping is'),
    area('body', 'Body', 'People are already in the right place. What is missing is the layer that writes once and reaches everyone.'),
    lines('items', 'Points', [
      'Nothing to install on anyone’s phone',
      'No new habit to teach',
      'The operator stops being the routing layer',
    ]),
  ], 'canvas'),

  slide('solution', 'Slide · Solution', 'findings', [
    eyebrow('The product'),
    title('four jobs, any channel'),
    lines('items', 'Capabilities (Head | detail)', [
      'Broadcast fan-out|Write once. Delivery comes back as a fraction, not a guess.',
      'Capacity matching|Supply meets demand by distance, size and history.',
      'Answers from a knowledge base|The same question stops arriving forty times.',
      'Risk digest|What breaks today if nobody moves.',
    ]),
  ]),

  slide('data', 'Slide · Data', 'data', [
    eyebrow('The proof'),
    title('where the morning goes'),
    text('stat', 'Stat', '3h 12m'),
    text('statLabel', 'Stat label', 'median returned per operator, per day'),
    lines('bars', 'Bars (Label | value | percent)', [
      'Chasing status|42%|42',
      'Answering repeats|31%|31',
      'Matching capacity|18%|18',
    ]),
    text('source', 'Source', '40 networks, Mar–Jul 2026'),
  ], 'amber'),

  slide('proof', 'Slide · Proof', 'quote', [
    eyebrow('In their words'),
    area('quote', 'Quote', 'The morning call went from forty minutes to four.', 200),
    text('attribution', 'Attribution', 'Dispatch lead · 40-technician region'),
    image('logo', 'Customer logo'),
  ], 'canvas'),

  slide('pricing', 'Slide · Pricing', 'pricing', [
    eyebrow('Pricing'),
    title('priced per network, not per seat'),
    body('Your network grows without your bill jumping a tier every time someone joins.'),
    lines('items', 'Tiers (Tier | price | note)', [
      'Starter|₦25,000|Up to 20 members, one channel',
      'Network|₦40,000|Up to 60 members, every channel',
      'Operator|₦60,000|Unlimited members, API and webhooks',
    ]),
  ]),

  slide('close', 'Slide · Close', 'back', [
    title('put your network on one line'),
    body('One channel, one list, one broadcast.'),
    cta('Start free'),
    url(),
  ], 'inverted'),
];
