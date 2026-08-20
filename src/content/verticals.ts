/**
 * The five named verticals.
 *
 * This file is what makes the reposition real rather than cosmetic. Each
 * vertical supplies a COPY PACK: the nouns that vertical uses, a proof stat, a
 * quote, and the default strings the editor drops into a template. Switch the
 * vertical in the studio and every preset re-fills in that vertical's language
 * — same layout, same brand, correct words.
 *
 * `agent-networks` is the flagship: it is the original Floatline story, the one
 * with real operators behind it, and it stays first for that reason.
 */
import type { CurrencyId } from './brand';

export type VerticalId =
  | 'agent-networks'
  | 'field-ops'
  | 'logistics'
  | 'retail'
  | 'support';

export type Vertical = {
  id: VerticalId;
  label: string;
  /** One line, for the playbook's architecture section. */
  summary: string;
  /** Who is on the other end of the automation. */
  operator: string;
  network: string;
  unit: string;
  currency: CurrencyId;
  channels: string[];
  /** The copy pack the editor pulls template defaults from. */
  copy: {
    eyebrow: string;
    headline: string;
    lede: string;
    stat: string;
    statLabel: string;
    quote: string;
    attribution: string;
    problem: string;
    solution: string;
    cta: string;
    steps: string[];
    metrics: string[];
  };
};

export const VERTICALS: Vertical[] = [
  {
    id: 'agent-networks',
    label: 'Agent networks',
    summary:
      'Super-agents running 20–50 POS sub-agents. The original Floatline story, and still the sharpest proof that the model works.',
    operator: 'super-agent',
    network: 'sub-agents',
    unit: 'terminal',
    currency: 'NGN',
    channels: ['whatsapp', 'sms', 'voice'],
    copy: {
      eyebrow: 'Agent networks',
      headline: 'stop running your network from your thumbs',
      lede: 'One number your whole network talks to. Broadcasts land in seconds, float finds itself, and the morning digest tells you which terminal is about to be pulled.',
      stat: '2–4 hrs',
      statLabel: 'given back per day, per super-agent',
      quote: 'I used to open thirty-two chats before breakfast. Now I read one digest and send one message.',
      attribution: 'Aisha O. · 32 sub-agents · Surulere',
      problem: 'Thirty-two separate chats. The same question forty times a day. Float sitting idle in one terminal while another turns customers away.',
      solution: 'One line into the whole network. Broadcast once, match float automatically, answer from a knowledge base you curate one tap at a time.',
      cta: 'Run your network on one line',
      steps: [
        'Add Floatline to your network’s groups',
        'Import your terminal list',
        'Curate the first ten answers',
        'Read the 7am digest',
      ],
      metrics: ['29 / 32 read', '₦300K idle since 11am', 'Terminal 19 at 23% of target'],
    },
  },
  {
    id: 'field-ops',
    label: 'Field operations',
    summary:
      'Dispatchers coordinating technicians across a service area — job status, parts, escalation.',
    operator: 'dispatcher',
    network: 'technicians',
    unit: 'job',
    currency: 'USD',
    channels: ['whatsapp', 'sms', 'slack'],
    copy: {
      eyebrow: 'Field operations',
      headline: 'every job status, without chasing anyone',
      lede: 'Technicians answer where they already are. Floatline turns their replies into job state, flags what is slipping, and escalates before the SLA does.',
      stat: '31%',
      statLabel: 'fewer status-chase calls in the first month',
      quote: 'The morning call used to take forty minutes. Now it takes four, and it is about exceptions.',
      attribution: 'Dispatch lead · 40-technician region',
      problem: 'Nobody knows where the truck is until someone calls to ask. The escalation happens after the customer complains.',
      solution: 'Status arrives from the field on its own. Floatline flags the slipping job while there is still time to move someone.',
      cta: 'See your field in one view',
      steps: ['Import the day’s jobs', 'Techs reply on any channel', 'Floatline holds the state', 'Escalate before the SLA'],
      metrics: ['18 / 22 checked in', '3 jobs slipping', 'SLA breach in 2h'],
    },
  },
  {
    id: 'logistics',
    label: 'Logistics & delivery',
    summary:
      'Fleet and rider coordinators — route load, proof of delivery, exception handling.',
    operator: 'coordinator',
    network: 'riders',
    unit: 'route',
    currency: 'NGN',
    channels: ['whatsapp', 'sms', 'webhook'],
    copy: {
      eyebrow: 'Logistics',
      headline: 'the route talks back',
      lede: 'Riders confirm on the channel they already use. Proof of delivery lands as structured data. Exceptions surface while the day can still be saved.',
      stat: '11 min',
      statLabel: 'average time from failed drop to reassignment',
      quote: 'We found out about failed drops the next morning. Now we find out in eleven minutes.',
      attribution: 'Ops manager · 120 riders',
      problem: 'Proof of delivery is a photo in someone’s camera roll. A failed drop is discovered at reconciliation, a day too late.',
      solution: 'Every confirmation is structured the moment it arrives, and a failed drop triggers a reassignment while the rider is still on the street.',
      cta: 'Put your fleet on one line',
      steps: ['Assign the route', 'Rider confirms on WhatsApp', 'POD captured as data', 'Exceptions reassigned live'],
      metrics: ['96 / 104 delivered', '4 exceptions open', '2 routes behind'],
    },
  },
  {
    id: 'retail',
    label: 'Retail & franchise',
    summary:
      'Multi-outlet operators — daily close, stock counts, price and promo rollout.',
    operator: 'area manager',
    network: 'outlets',
    unit: 'outlet',
    currency: 'GHS',
    channels: ['whatsapp', 'email', 'api'],
    copy: {
      eyebrow: 'Retail',
      headline: 'twenty outlets close the same way',
      lede: 'Price changes reach every outlet at once. Daily close arrives as numbers, not photographs of a notebook. The variance is flagged the same night.',
      stat: '20 / 20',
      statLabel: 'outlets closing on time, week four',
      quote: 'Rolling out a price change used to take three days and two arguments.',
      attribution: 'Area manager · 20 outlets',
      problem: 'A price change reaches nineteen of twenty outlets. The twentieth finds out from a customer.',
      solution: 'One broadcast, read-receipt confirmed. Daily close captured as structured numbers with variance flagged the same night.',
      cta: 'Close every outlet the same way',
      steps: ['Broadcast the change', 'Confirm receipt per outlet', 'Capture the close', 'Flag the variance'],
      metrics: ['20 / 20 confirmed', '2 outlets over variance', 'Close by 21:40'],
    },
  },
  {
    id: 'support',
    label: 'Support & back-office',
    summary:
      'Queue owners — triage, escalation paths, and answering the same question once.',
    operator: 'queue owner',
    network: 'agents',
    unit: 'ticket',
    currency: 'USD',
    channels: ['slack', 'email', 'webhook'],
    copy: {
      eyebrow: 'Support',
      headline: 'answer it once, not forty times',
      lede: 'Floatline drafts from the knowledge base you already curate, routes what it cannot answer, and shows you the questions worth writing down.',
      stat: '64%',
      statLabel: 'of inbound answered from the knowledge base',
      quote: 'The queue stopped being the same six questions wearing different clothes.',
      attribution: 'Support lead · 9-person team',
      problem: 'Six questions account for most of the queue, and every one is answered from scratch by whoever picks it up.',
      solution: 'Floatline drafts the answer, a human approves it, and the approval improves the next draft. What it cannot answer, it routes.',
      cta: 'Cut the queue in half',
      steps: ['Connect the queue', 'Floatline drafts', 'You approve', 'The next draft is better'],
      metrics: ['64% auto-answered', '12 awaiting approval', 'First reply 40s'],
    },
  },
];

export const DEFAULT_VERTICAL: VerticalId = 'agent-networks';

export const verticalOf = (id: VerticalId | undefined): Vertical =>
  VERTICALS.find((v) => v.id === id) ?? VERTICALS[0]!;
