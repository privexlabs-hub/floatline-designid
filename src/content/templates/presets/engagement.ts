import { CANVAS } from '@/lib/artboard-sizes';
import type { Preset, Field } from '../types';
import { text, area, lines, eyebrow, title, body, cta, url, badge, image } from '../fields';
import type { Surface } from '@/lib/tokens';

const G = 'Engagement · 1080×1080';

const en = (
  id: string,
  name: string,
  shape: string,
  fields: Field[],
  surface: Surface = 'paper',
  props: Record<string, unknown> = {}
): Preset => ({
  id: `en-${id}`,
  group: G,
  name,
  layout: 'engagement',
  ...CANVAS.square,
  surface,
  props: { shape, ...props },
  fields,
  platform: 'linkedin',
});

export const ENGAGEMENT_PRESETS: Preset[] = [
  en('why-us', 'Why us · founder story', 'story', [
    eyebrow('Why we built it'),
    title('we watched an operator open thirty-two chats before breakfast'),
    body('She was not missing software. She was missing a single line between herself and everyone she coordinates.'),
    lines('items', 'Points', ['Two to four hours a day, gone', 'The same question, forty times', 'Capacity idle in one place, needed in another']),
    cta('Read the story'),
    url(),
  ]),

  en('founder', 'Founder / team story', 'story', [
    eyebrow('The team'),
    title('built by people who ran the networks first'),
    body('Every default in Floatline came from watching someone do it by hand and asking why it took so long.'),
    lines('items', 'Points', ['Field research before feature specs', 'Shipped weekly to real operators', 'No feature ships that nobody asked for']),
    url(),
  ], 'canvas'),

  en('manifesto', 'Manifesto · what we believe', 'manifesto', [
    eyebrow('What we believe'),
    title('what we believe'),
    lines('items', 'Beliefs', [
      'Coordination is work. It should be paid for in software, not in hours.',
      'Automation that still needs a human to retype it is not automation.',
      'The channel people already use beats the app you wish they would install.',
      'A number you cannot verify is a rumour. Show the fraction.',
      'Calm beats clever. Operators do not need a dashboard that celebrates.',
    ]),
    url(),
  ], 'green'),

  en('problem-solution', 'Problem / solution split', 'problem', [
    eyebrow('Problem · solution'),
    title('coordination does not scale by trying harder'),
    text('leftLabel', 'Left label', 'The problem'),
    lines('leftItems', 'Left items', ['One message, thirty-two chats', 'No idea who actually read it', 'Answers scroll away by noon', 'Capacity idle and unmatched']),
    text('rightLabel', 'Right label', 'With Floatline'),
    lines('rightItems', 'Right items', ['Write once, delivered verbatim', '29 / 32 read, by name', 'Answers live in the knowledge base', 'Supply meets demand automatically']),
    url(),
  ]),

  en('before-after', 'Before / after', 'beforeAfter', [
    eyebrow('Before · after'),
    title('one month in'),
    text('leftLabel', 'Left label', 'Before'),
    lines('leftItems', 'Left items', ['3h 40m a day coordinating', 'Failures found at reconciliation', 'Six questions answered from scratch']),
    text('rightLabel', 'Right label', 'After'),
    lines('rightItems', 'Right items', ['22 minutes a day', 'Failures surface in eleven minutes', '64% answered from the knowledge base']),
    url(),
  ], 'canvas'),

  en('did-you-know', 'Did you know · educational', 'howItWorks', [
    eyebrow('Did you know'),
    title('a read receipt is not a delivery receipt'),
    body('They fail for different reasons, and conflating them is how a broadcast quietly misses people.'),
    lines('items', 'Steps', [
      'Sent — Floatline handed it to the channel',
      'Delivered — the device acknowledged it',
      'Read — a human opened it',
      'Bounced — the number is wrong, and you should know whose',
    ]),
    url(),
  ]),

  en('how-it-works', 'How it works', 'howItWorks', [
    eyebrow('How it works'),
    title('four steps, fifteen minutes'),
    lines('items', 'Steps', [
      'Connect a channel your network already uses',
      'Import the list of people or terminals',
      'Write the first broadcast and send it',
      'Read tomorrow’s digest at 7am',
    ]),
    cta('Start free'),
    url(),
  ], 'green'),

  en('use-case', 'Use case · examples', 'howItWorks', [
    eyebrow('Use cases'),
    title('what operators run on it'),
    body('The same four jobs, in five very different networks.'),
    lines('items', 'Examples', [
      'Agent networks — broadcast, float matching, terminal risk',
      'Field operations — job status without chasing anyone',
      'Logistics — proof of delivery as data, not a camera roll',
      'Retail — twenty outlets closing the same way',
      'Support — answer it once, not forty times',
    ]),
    url(),
  ], 'canvas'),

  en('testimonial-proof', 'Customer testimonial · proof', 'proof', [
    eyebrow('Proof'),
    area('quote', 'Quote', 'Rolling out a price change used to take three days and two arguments.', 200),
    text('attribution', 'Attribution', 'Area manager · 20 outlets'),
    image('logo', 'Customer logo'),
    text('stat', 'Stat', '20 / 20'),
    url(),
  ]),

  en('social-proof', 'Social proof', 'proof', [
    eyebrow('Social proof'),
    area('quote', 'Quote', 'The queue stopped being the same six questions wearing different clothes.', 200),
    text('attribution', 'Attribution', 'Support lead · 9-person team'),
    text('stat', 'Stat', '64%'),
    url(),
  ], 'amber'),

  en('faq', 'FAQ', 'faq', [
    eyebrow('FAQ'),
    title('the three questions we get most'),
    lines('items', 'Question | Answer', [
      'Do people need to install anything? | No. Floatline works on the channel they already use.',
      'What happens if a send fails? | It retries with backoff, then names the number that failed.',
      'Can it answer in Pidgin? | It understands however people write. It replies in the language you set.',
    ]),
    url(),
  ]),

  en('myth-fact', 'Myth vs fact', 'mythFact', [
    eyebrow('Myth · fact'),
    title('three things people assume about automation'),
    lines('items', 'Myth | Fact', [
      'It replaces the operator. | It removes the retyping. The judgment stays yours.',
      'You need clean data first. | You need one channel and one list. Start there.',
      'It only works for big networks. | The smallest network we run is nine people.',
    ]),
    url(),
  ], 'canvas'),

  en('tips', 'Tips / checklist', 'tips', [
    eyebrow('Checklist'),
    title('before you send a broadcast'),
    lines('items', 'Checklist', [
      'Say the action first — "Send", not "We wanted to let you know"',
      'Put the number in the first line',
      'One ask per message',
      'Name the deadline, not "soon"',
      'Read it back as if you receive forty of these a day',
    ]),
    url(),
  ]),

  en('comparison', 'Comparison · vs alternatives', 'problem', [
    eyebrow('Comparison'),
    title('spreadsheet, group chat, or a workflow'),
    text('leftLabel', 'Left label', 'Spreadsheet + group chat'),
    lines('leftItems', 'Left items', ['Truth lives in two places', 'Nobody knows the current version', 'Status is a phone call', 'History is whatever you remember']),
    text('rightLabel', 'Right label', 'Floatline'),
    lines('rightItems', 'Right items', ['One record of what happened', 'Everyone sees the same thing', 'Status arrives on its own', 'Every run is auditable']),
    url(),
  ]),

  en('opinion', 'Opinion / hot take', 'opinion', [
    badge('Hot take'),
    eyebrow('Opinion'),
    title('dashboards are where coordination goes to be admired'),
    body('Nobody opens a dashboard at 6am. They open WhatsApp. Put the answer there.'),
    url(),
  ], 'ink'),

  en('question', 'Question / conversation starter', 'opinion', [
    badge('Question'),
    eyebrow('Tell us'),
    title('how many chats do you open before your first coffee?'),
    body('We ask every operator this. The record so far is forty-one.'),
    url(),
  ], 'canvas'),

  en('poll', 'Poll / vote', 'poll', [
    eyebrow('Poll'),
    title('what eats your morning?'),
    lines('items', 'Option | Percent', [
      'Chasing status | 42%',
      'Answering the same question | 31%',
      'Matching supply to demand | 18%',
      'Something else entirely | 9%',
    ]),
    url(),
  ]),

  en('community', 'Community spotlight', 'proof', [
    eyebrow('Community'),
    area('quote', 'Quote', 'I stopped being the bottleneck in my own network.', 200),
    text('attribution', 'Attribution', 'Aisha O. · 32 sub-agents · Surulere'),
    text('stat', 'Stat', '3h 18m'),
    url(),
  ], 'green'),

  en('cta-signup', 'CTA · sign up', 'opinion', [
    badge('Start free'),
    eyebrow('Get started'),
    title('one channel. one list. one broadcast.'),
    body('Fifteen minutes to the first send. No card.'),
    cta('Start free'),
    url(),
  ], 'inverted'),

  en('cta-learn', 'CTA · learn more', 'story', [
    eyebrow('Learn more'),
    title('see what a run actually does'),
    body('A walkthrough of one broadcast from trigger to read receipt, with nothing hidden.'),
    lines('items', 'Points', ['Six minutes', 'No signup', 'Real delivery data']),
    cta('Watch the walkthrough'),
    url(),
  ]),

  /* ---- Added beyond the brief. ---- */

  en('roi', 'ROI / time saved', 'proof', [
    eyebrow('ROI'),
    area('quote', 'Quote', 'Three hours a day, times twenty-two working days, times what an operator’s hour is worth.', 200),
    text('attribution', 'Attribution', 'The arithmetic every operator does before signing up'),
    text('stat', 'Stat', '66 hrs'),
    url(),
  ], 'amber'),

  en('anatomy', 'Workflow anatomy', 'howItWorks', [
    eyebrow('Anatomy'),
    title('what is actually in a run'),
    body('Four parts. If any one of them is missing, it is a message, not a workflow.'),
    lines('items', 'Parts', [
      'Trigger — what starts it, and what it carries',
      'Steps — what happens, in order, with retries',
      'Branches — what changes when a reply comes back',
      'Record — what happened, kept whether it worked or not',
    ]),
    url(),
  ], 'canvas'),

  en('objection', 'Objection handling', 'faq', [
    eyebrow('Objections'),
    title('the three reasons people hesitate'),
    lines('items', 'Objection | Answer', [
      '“My network will not adopt a new app.” | They will not have to. It runs on the channel they already open.',
      '“I do not trust it to send on my behalf.” | It drafts. You approve. Until you tell it not to.',
      '“We are too small for this.” | Nine people is enough for coordination to cost you a morning.',
    ]),
    url(),
  ]),
];
