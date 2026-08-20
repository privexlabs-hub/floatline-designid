/**
 * The narrative source of truth. Playbook sections, editor copy packs, page
 * metadata and the OG cards all read from here, so the positioning is stated
 * once and cannot drift between surfaces.
 *
 * REPOSITIONING NOTE — read before editing.
 * The imported design system defined Floatline as "a WhatsApp coordination
 * layer for Nigerian super-agents who manage 20-50 POS sub-agents." That is
 * now ONE VERTICAL (see verticals.ts), not the brand. Floatline is a workflow
 * automation product; WhatsApp is one channel it speaks over.
 *
 * What was kept: the name, the lowercase wordmark, the palette, warm paper,
 * warm shadows, the receipt rule, the float bar, the status dot, the
 * read-receipt fraction, and the operator's voice. The roots are the point —
 * they are what stop this from becoming another blue-violet SaaS brand.
 */

export const BRAND = {
  name: 'Floatline',
  wordmark: 'floatline',
  category: 'Workflow automation',
  tagline: 'Automation for operators who run networks.',
  promise:
    'One line between you and every person, terminal and system you coordinate. ' +
    'Floatline listens on the channels your network already uses, runs the ' +
    'workflow, and hands you back the hours.',
  /** Said out loud in under ten seconds. */
  elevator:
    'Floatline is workflow automation for people who run distributed networks. ' +
    'Broadcast once and reach everyone. Match supply to demand automatically. ' +
    'Answer the same question once instead of forty times. Get a digest each ' +
    'morning of what is about to go wrong.',
} as const;

/**
 * Channels. The whole point of the repositioning: WhatsApp is first among
 * these because it is where the flagship vertical lives, not because it is
 * what Floatline is.
 */
export const CHANNELS = [
  { id: 'whatsapp', label: 'WhatsApp', note: 'Where most field networks already are.' },
  { id: 'sms', label: 'SMS', note: 'Reaches a feature phone with no data.' },
  { id: 'voice', label: 'Voice', note: 'Calls and IVR for low-literacy contexts.' },
  { id: 'email', label: 'Email', note: 'Digests, receipts, escalation trails.' },
  { id: 'slack', label: 'Slack', note: 'For the back office watching the network.' },
  { id: 'webhook', label: 'Webhooks', note: 'Push a run into anything that listens.' },
  { id: 'api', label: 'API', note: 'Trigger and read runs programmatically.' },
] as const;

export type ChannelId = (typeof CHANNELS)[number]['id'];

/** The four jobs. Channel-neutral by construction. */
export const CAPABILITIES = [
  {
    id: 'broadcast',
    icon: 'broadcast-fanout',
    title: 'Broadcast fan-out',
    body: 'Write once. Every member of the network gets it verbatim, in seconds, on the channel they actually read. Delivery comes back as a fraction, not a guess.',
  },
  {
    id: 'match',
    icon: 'capacity-bar',
    title: 'Capacity matching',
    body: 'Members declare what they have. Others declare what they need. Floatline pairs them by distance, size and history — before anyone has to ask around.',
  },
  {
    id: 'answers',
    icon: 'connector',
    title: 'Answers from your knowledge base',
    body: 'The same question stops arriving forty times. You curate an answer once, one tap at a time, and the network gets it instantly.',
  },
  {
    id: 'digest',
    icon: 'run',
    title: 'Risk digest',
    body: 'Every morning: who is behind, what is stalled, what breaks today if nobody moves. Read in ninety seconds, act on three lines.',
  },
] as const;

/** Voice. Lifted from the import and generalised past the single vertical. */
export const VOICE = {
  is: [
    'Direct. Verbs first. "Send broadcast." "Match capacity." "Approve draft."',
    'Specific in money and time. "Saves ~2 hrs/day", not "saves you time."',
    'Lowercase display headlines, sentence-case body and buttons.',
    'Plain language. The product understands however people actually write; it answers plainly.',
    'Named things, honoured: run, trigger, broadcast, digest, knowledge base, connector.',
    'Second person for the operator. The network is "your network", never "users".',
  ],
  isNot: [
    'No exclamation points. Operators are calm.',
    'No emoji in product chrome. Inside a conversation channel they are read faster than text, so a limited set is allowed there and nowhere else.',
    'No SaaS abstraction. Never "leverage", "seamless", "empower", "unlock".',
    'No accent we do not own. The product is multilingual; the marketing does not perform a dialect.',
    'No "just" or "simply". If it were simple they would not need us.',
  ],
  /** Every row is a real rewrite, not an invented strawman. */
  examples: [
    { bad: 'Welcome! Let’s get you set up.', good: 'Connect your first channel.' },
    { bad: 'An error occurred while sending.', good: 'Couldn’t deliver to 3 numbers. Retry?' },
    { bad: '5 messages successfully delivered.', good: '29 / 32 read · 3 pending' },
    { bad: 'Optimize your resource distribution!', good: 'Bisi has ₦300K idle. Chinedu needs ₦80K. Match?' },
    { bad: 'Leverage automation to empower your team.', good: 'Stop retyping the same message forty times.' },
    { bad: 'Hey — terminal #19 is performing below target! 📉', good: 'Terminal 19 (Akoka) at 23% of today’s target. 1 day left.' },
  ],
} as const;

/** Rules that survive any reposition. Breaking one is a brand bug. */
export const NON_NEGOTIABLES = [
  'Flat colour on warm paper. Never invent a gradient.',
  'Shadows are warm-tinted. Never blue-black.',
  'Money uses the mono face with tabular figures, symbol first. Never "NGN 25,000".',
  'Status is a coloured dot plus an uppercase micro label — on-track, at-risk, failed.',
  'The receipt rule (dashed, 1.5px) separates sections. It is the brand’s rhythm.',
  'No colored left-border accent. No frosted glass. No neon. No cold grey.',
  'No stock photography and no generated faces. Avatars are initials on a colour.',
  'Red is critical only. It is never decorative.',
] as const;

export const CURRENCIES = [
  { id: 'NGN', symbol: '₦', label: 'Naira' },
  { id: 'USD', symbol: '$', label: 'US dollar' },
  { id: 'EUR', symbol: '€', label: 'Euro' },
  { id: 'GBP', symbol: '£', label: 'Pound' },
  { id: 'KES', symbol: 'KSh', label: 'Kenyan shilling' },
  { id: 'GHS', symbol: '₵', label: 'Cedi' },
] as const;

export type CurrencyId = (typeof CURRENCIES)[number]['id'];

export const symbolOf = (id: CurrencyId): string =>
  CURRENCIES.find((c) => c.id === id)?.symbol ?? '₦';
