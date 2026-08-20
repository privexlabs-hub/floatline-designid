import { CANVAS } from '@/lib/artboard-sizes';
import type { Preset, Field } from '../types';
import { text, lines, title, body, badge } from '../fields';
import type { Surface } from '@/lib/tokens';

const G = 'YouTube · 1280×720';

/**
 * Read at roughly 210px wide in a sidebar. Four words and one supporting line
 * is the honest budget, so the copy here is deliberately shorter than anywhere
 * else in the catalog and the `max` on the headline enforces it.
 */
const yt = (id: string, name: string, shape: string, fields: Field[], surface: Surface = 'paper'): Preset => ({
  id: `yt-${id}`, group: G, name, layout: 'ytThumb', ...CANVAS.ytThumb, surface,
  props: { shape }, fields, platform: 'youtube',
});

export const YOUTUBE_PRESETS: Preset[] = [
  yt('tutorial', 'Thumbnail · Tutorial', 'statement', [badge('Tutorial'), title('your first broadcast', 40), body('start to sent in 15 minutes', 44)]),
  yt('how-to', 'Thumbnail · How-to', 'list', [badge('How-to'), title('set up capacity matching', 40), lines('items', 'Chips', ['Declare', 'Match', 'Confirm'])], 'canvas'),
  yt('review', 'Thumbnail · Review', 'versus', [badge('Review'), text('leftLabel', 'Left', 'group chat'), text('rightLabel', 'Right', 'floatline')], 'ink'),
  yt('product', 'Thumbnail · Product', 'statement', [badge('Product'), title('inside a run', 40), body('trigger, steps, branches, record', 44)], 'green'),
  yt('feature', 'Thumbnail · Feature', 'statement', [badge('Feature'), title('the 7am digest', 40), body('read it in ninety seconds', 44)]),
  yt('hot-take', 'Thumbnail · Hot take', 'statement', [badge('Hot take'), title('dashboards are useless at 6am', 40), body('', 44)], 'ink'),
  yt('interview', 'Thumbnail · Interview', 'versus', [badge('Interview'), text('leftLabel', 'Left', 'aisha'), text('rightLabel', 'Right', 'floatline')], 'canvas'),
  yt('podcast', 'Thumbnail · Podcast', 'statement', [badge('Episode 12'), title('running 32 terminals', 40), body('with aisha o.', 44)], 'amber'),
  yt('launch', 'Thumbnail · Launch', 'statement', [badge('Live'), title('floatline is live', 40), body('workflow automation for operators', 44)], 'green'),
  yt('announcement', 'Thumbnail · Announcement', 'statement', [badge('News'), title('runs retry themselves', 40), body('', 44)]),
  yt('case-study', 'Thumbnail · Case study', 'stat', [badge('Case study'), text('stat', 'Stat', '3h 18m'), title('given back, daily', 40)], 'amber'),
  yt('roundup', 'Thumbnail · List / roundup', 'list', [badge('Roundup'), title('5 coordination traps', 40), lines('items', 'Chips', ['Chasing', 'Retyping', 'Guessing'])], 'canvas'),

  /* ---- Added beyond the brief. ---- */
  yt('changelog', 'Thumbnail · Changelog', 'list', [badge('v1.4'), title('what shipped', 40), lines('items', 'Chips', ['Retries', 'Bounces', 'Digests'])]),
  yt('integration', 'Thumbnail · Integration', 'versus', [badge('Connector'), text('leftLabel', 'Left', 'floatline'), text('rightLabel', 'Right', 'your stack')], 'green'),
  yt('webinar', 'Thumbnail · Webinar', 'statement', [badge('Live session'), title('a network that runs itself', 40), body('thursday · 16:00 wat', 44)], 'ink'),
];
