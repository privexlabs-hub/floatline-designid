import { CANVAS } from '@/lib/artboard-sizes';
import type { Preset, Field } from '../types';
import { text, area, lines, eyebrow, title, body, cta, url } from '../fields';
import type { Surface } from '@/lib/tokens';

const G = 'Carousel · 1080×1080';
const TOTAL = 12;

const co = (
  index: number,
  id: string,
  name: string,
  role: string,
  fields: Field[],
  surface: Surface = 'paper'
): Preset => ({
  id: `co-${id}`,
  group: G,
  name,
  layout: 'carousel',
  ...CANVAS.square,
  surface,
  props: { role, index, total: TOTAL },
  fields,
  platform: 'linkedin',
});

/**
 * A twelve-slide deck that actually reads as one argument, in order. The
 * brief listed ten; the intro and index cards were added because a deck that
 * opens on the hook and never tells you where it is going loses people by
 * slide four.
 */
export const CAROUSEL_PRESETS: Preset[] = [
  co(1, 'intro', 'Slide 0 · Intro / title', 'hook', [
    eyebrow('Floatline'),
    title('how a network stops running on your thumbs'),
    body('Twelve slides. Six minutes. One worked example.'),
  ], 'green'),

  co(2, 'index', 'Slide 0b · Index / agenda', 'steps', [
    eyebrow('What is in here'),
    title('the argument, in order'),
    lines('items', 'Agenda', ['The problem', 'The insight', 'The solution', 'The proof', 'How to start']),
  ], 'canvas'),

  co(3, 'hook', 'Slide 1 · Hook', 'hook', [
    eyebrow('01'),
    title('thirty-two chats before breakfast'),
    body('That is not a workflow. That is a person doing the job of one.'),
  ]),

  co(4, 'problem', 'Slide 2 · Problem', 'problem', [
    eyebrow('02 · Problem'),
    title('coordination scales worse than the network does'),
    body('Add ten people and the messages do not go up by ten. They go up by a lot more.'),
    lines('items', 'Points', ['One message becomes thirty-two sends', 'Every reply comes back to one person', 'Nothing is written down anywhere durable']),
  ]),

  co(5, 'insight', 'Slide 3 · Insight', 'insight', [
    eyebrow('03 · Insight'),
    title('the channel is not the problem — the retyping is'),
    body('People are already in the right place. What is missing is the layer that writes once and reaches everyone.'),
  ], 'canvas'),

  co(6, 'solution', 'Slide 4 · Solution', 'solution', [
    eyebrow('04 · Solution'),
    title('one line into the whole network'),
    lines('items', 'Capabilities', [
      'Broadcast fan-out with real delivery reporting',
      'Capacity matching between members',
      'Answers from a knowledge base you curate',
      'A risk digest every morning',
    ]),
  ], 'green'),

  co(7, 'proof', 'Slide 5 · Proof', 'proof', [
    eyebrow('05 · Proof'),
    area('quote', 'Quote', 'I used to open thirty-two chats before breakfast. Now I read one digest and send one message.', 180),
    text('attribution', 'Attribution', 'Aisha O. · 32 sub-agents · Surulere'),
  ]),

  co(8, 'steps', 'Slide 6 · Steps / how-to', 'steps', [
    eyebrow('06 · How to start'),
    title('fifteen minutes to the first send'),
    lines('items', 'Steps', [
      'Connect a channel your network already uses',
      'Import the list',
      'Write one broadcast',
      'Send it and watch the fraction move',
    ]),
  ]),

  co(9, 'examples', 'Slide 7 · Examples', 'examples', [
    eyebrow('07 · Examples'),
    title('five networks, the same four jobs'),
    lines('items', 'Examples', [
      'Agent networks — float and terminal risk',
      'Field operations — job status',
      'Logistics — proof of delivery',
      'Retail — daily close across outlets',
      'Support — answer it once',
    ]),
  ], 'canvas'),

  co(10, 'data', 'Slide 8 · Data / stats', 'data', [
    eyebrow('08 · Data'),
    text('stat', 'Stat', '2–4 hrs'),
    text('statLabel', 'Stat label', 'given back per day, per operator, in month one'),
  ], 'amber'),

  co(11, 'takeaways', 'Slide 9 · Takeaways', 'takeaways', [
    eyebrow('09 · Takeaways'),
    title('three things to keep'),
    lines('items', 'Takeaways', [
      'If a human retypes it, it was never automated',
      'Delivery is a fraction, not a feeling',
      'Answer it once and the queue changes shape',
    ]),
  ]),

  co(12, 'close', 'Final slide · Close / CTA', 'close', [
    eyebrow('10 · Start'),
    title('put your network on one line'),
    body('One channel, one list, one broadcast. No card.'),
    cta('Start free'),
    url(),
  ], 'inverted'),
];
