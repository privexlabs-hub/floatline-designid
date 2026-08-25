import type { SequenceKind } from '@/lib/sequences';

/**
 * Starting points, composed from templates that already exist.
 *
 * A starter is a list of preset ids and nothing else — no second copy of the
 * artwork, no parallel definition to keep in step. Add a page template to the
 * catalog and it is immediately usable here; remove one and `revive()` drops it
 * from saved sequences rather than rendering a hole.
 */
export type Starter = {
  id: string;
  kind: SequenceKind;
  name: string;
  description: string;
  /** Preset ids, in order. */
  pages: string[];
  numbering: boolean;
  runningHeader: string;
};

export const STARTERS: Starter[] = [
  {
    id: 'linkedin-carousel',
    kind: 'deck',
    name: 'LinkedIn carousel',
    description: 'The twelve-slide argument, in order: intro, index, hook, problem, insight, solution, proof, steps, examples, data, takeaways, close.',
    pages: [
      'co-intro', 'co-index', 'co-hook', 'co-problem', 'co-insight', 'co-solution',
      'co-proof', 'co-steps', 'co-examples', 'co-data', 'co-takeaways', 'co-close',
    ],
    numbering: false,
    runningHeader: '',
  },
  {
    id: 'story-sequence',
    kind: 'deck',
    name: 'Story sequence',
    description: 'Four vertical frames for a launch: the announcement, a demo, the number, then the ask.',
    pages: ['ve-launch', 've-demo', 've-stat', 've-cta'],
    numbering: false,
    runningHeader: '',
  },
  {
    id: 'report',
    kind: 'document',
    name: 'Report',
    description: 'Cover, contents, summary, method, findings and recommendations, with references. A4.',
    pages: [
      'doc-cover', 'doc-toc', 'doc-summary', 'doc-section', 'doc-body',
      'doc-data', 'doc-table', 'doc-findings', 'doc-recommendations',
      'doc-quote', 'doc-references', 'doc-back',
    ],
    numbering: true,
    runningHeader: 'The cost of coordinating by hand',
  },
  {
    id: 'whitepaper',
    kind: 'document',
    name: 'Whitepaper',
    description: 'Argument-led rather than data-led: problem, context, evidence, a worked case, then what to do.',
    pages: [
      'doc-cover', 'doc-toc', 'doc-summary', 'doc-body', 'doc-data',
      'doc-case-study', 'doc-recommendations', 'doc-references', 'doc-back',
    ],
    numbering: true,
    runningHeader: 'Floatline whitepaper',
  },
  {
    id: 'case-study',
    kind: 'document',
    name: 'Case study',
    description: 'One customer, start to finish — the network, what changed, and what it was worth.',
    pages: ['doc-cover', 'doc-case-study', 'doc-data', 'doc-quote', 'doc-back'],
    numbering: true,
    runningHeader: 'Case study',
  },
  {
    id: 'proposal',
    kind: 'document',
    name: 'Proposal',
    description: 'Cover, summary, scope, evidence and pricing. The document a network signs off.',
    pages: [
      'doc-cover', 'doc-summary', 'doc-body', 'doc-findings',
      'doc-case-study', 'doc-back',
    ],
    numbering: true,
    runningHeader: 'Proposal',
  },
  {
    id: 'one-pager',
    kind: 'document',
    name: 'One-pager',
    description: 'The whole argument on a single A4 page. The thing you leave behind.',
    pages: ['doc-onepager'],
    numbering: false,
    runningHeader: '',
  },
  {
    id: 'pitch-deck',
    kind: 'document',
    name: 'Pitch deck',
    description: 'Nine slides at 16:9 — problem, insight, product, proof, pricing, close.',
    pages: [
      'pres-cover', 'pres-agenda', 'pres-problem', 'pres-insight', 'pres-solution',
      'pres-data', 'pres-proof', 'pres-pricing', 'pres-close',
    ],
    numbering: true,
    runningHeader: 'Floatline',
  },
];

export const starterById = (id: string): Starter | undefined => STARTERS.find((s) => s.id === id);
