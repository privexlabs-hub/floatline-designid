/**
 * The playbook, as code.
 *
 * Section 17 says: "Where a rule can be a check that fails a build, it is one."
 * These are the voice rules from src/content/brand.ts expressed as checks, used
 * in two places from one definition — live in the studio while you type, and in
 * scripts/verify-voice.mjs as a build gate over every template's default copy.
 *
 * Severity is the difference between the two. `error` means a stated
 * non-negotiable was broken and the build fails. `warn` means the playbook has
 * an opinion a human might reasonably overrule — "64% of inbound answered from
 * the knowledge base" is a real statistic with no meaningful denominator, and a
 * build that refused it would be wrong.
 *
 * No dependencies, no side effects: a pure function over strings so the same
 * code runs in the browser and in Node.
 */

export type Severity = 'error' | 'warn';

export type Finding = {
  rule: string;
  severity: Severity;
  /** The field key the text came from. */
  field: string;
  /** The offending fragment, for highlighting. */
  excerpt: string;
  /** What to write instead. */
  message: string;
  /** Where the rule comes from, so it can be looked up and argued with. */
  source: string;
};

type Rule = {
  id: string;
  severity: Severity;
  test: RegExp;
  message: string;
  source: string;
  /** Skip on surfaces that legitimately break the rule (a chat mock). */
  conversationalOk?: boolean;
  /** Second pass on a match, for the cases a regex alone judges badly. */
  refine?: (match: string) => boolean;
};

const RULES: Rule[] = [
  {
    id: 'no-exclamation',
    severity: 'error',
    test: /!/g,
    message: 'Drop the exclamation point. Operators are calm.',
    source: 'Voice · “No exclamation points.”',
  },
  {
    id: 'no-saas-abstraction',
    severity: 'error',
    test: /\b(leverage|leveraging|seamless(?:ly)?|empower(?:s|ing)?|unlock(?:s|ing)?|synerg(?:y|ies)|utili[sz]e[sd]?|best-in-class|cutting[- ]edge|game[- ]chang(?:er|ing)|revolutionar(?:y|ise|ize)|frictionless|supercharge[sd]?)\b/gi,
    message: 'SaaS abstraction. Say the concrete thing that happens instead.',
    source: 'Voice · “Never leverage, seamless, empower, unlock.”',
  },
  {
    id: 'money-format',
    severity: 'error',
    test: /\b(?:NGN|USD|EUR|GBP|KES|GHS)\s*[\d,]|\b[\d,]+\s*(?:naira|dollars|pounds|euros)\b/gi,
    message: 'Money takes the symbol first, in the mono face: ₦25,000 — never “NGN 25,000”.',
    source: 'Non-negotiable #3 · money format',
  },
  {
    id: 'money-shorthand',
    severity: 'error',
    test: /(?<![₦$€£₵\w])\b\d+k\b/gi,
    message: 'Write the amount in full with its symbol — ₦80,000, not 80k.',
    source: 'Non-negotiable #3 · money format',
  },
  {
    id: 'not-users',
    severity: 'error',
    test: /\bend[- ]users?\b|\busers\b/gi,
    message: 'They are your network, its members, or the operator — never “users”.',
    source: 'Voice · “Second person for the operator. The network is your network, never users.”',
  },
  {
    id: 'no-just-simply',
    severity: 'warn',
    test: /\b(just|simply)\b/gi,
    message: 'Cut it. If it were simple they would not need us.',
    source: 'Voice · “No just or simply.”',
  },
  {
    id: 'emoji-outside-conversation',
    severity: 'warn',
    test: /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/gu,
    message: 'Emoji belong inside a conversation surface only. Elsewhere use a coloured dot and a micro label.',
    source: 'Voice · “No emoji in product chrome.”',
    conversationalOk: true,
  },
  {
    id: 'bare-percentage',
    severity: 'warn',
    test: /\b\d{1,3}%/g,
    message: 'A fraction is stronger where you have one — “29 / 32 read” beats “90% delivered”.',
    source: 'Voice · numbers',
  },
  {
    id: 'fraction-spacing',
    severity: 'warn',
    test: /\b\d+\/\d+\b/g,
    message: 'The read fraction is spaced: “29 / 32”, not “29/32”.',
    source: 'Visual identity · motifs',
  },
  {
    id: 'shouting',
    // Two or more consecutive all-caps words. A single one is an acronym —
    // REST, SMS, POS, WAT — and flagging those was pure noise.
    severity: 'warn',
    test: /\b[A-Z]{2,}\b(?:[^\S\n]+\b[A-Z]{2,}\b)+/g,
    message: 'Display headlines are lowercase and body is sentence case. Uppercase is for micro labels only.',
    source: 'Voice · “Lowercase display headlines, sentence-case body.”',
    // A run of acronyms is not shouting. "REST API" is fine; "SEND BROADCAST"
    // is not — and the thing that separates them is word length, since
    // acronyms are short and real words are not.
    refine: (m) => m.split(/\s+/).some((w) => w.length >= 5),
  },
];

/** Fields whose content is a label or a URL, where these rules do not apply. */
const EXEMPT_FIELDS = new Set(['url', 'footerUrl', 'channel', 'channelName', 'initials', 'platform']);

/** Rules that a conversation mock is allowed to break, because the channel is emoji-native. */
function isConversational(layout: string, props: Record<string, unknown> | undefined): boolean {
  return layout === 'kit' && props?.shape === 'chat';
}

export type CheckTarget = {
  layout: string;
  props?: Record<string, unknown>;
  /** field key -> the text to check. Arrays are joined by the caller. */
  values: Record<string, string>;
};

export function checkText(target: CheckTarget): Finding[] {
  const findings: Finding[] = [];
  const conversational = isConversational(target.layout, target.props);

  for (const [field, raw] of Object.entries(target.values)) {
    if (EXEMPT_FIELDS.has(field)) continue;
    const text = String(raw ?? '');
    if (!text.trim()) continue;

    for (const rule of RULES) {
      if (rule.conversationalOk && conversational) continue;
      // A fresh lastIndex every time — these are module-level /g regexes.
      rule.test.lastIndex = 0;
      const raw = text.match(rule.test);
      if (!raw) continue;
      const matches = rule.refine ? raw.filter(rule.refine) : raw;
      if (matches.length === 0) continue;

      // One finding per rule per field, listing every distinct match — fixing
      // one word should not hide the next one behind a re-run.
      const distinct = [...new Set(matches.map((m) => m.trim()))];
      findings.push({
        rule: rule.id,
        severity: rule.severity,
        field,
        excerpt: distinct.join(', '),
        message: rule.message,
        source: rule.source,
      });
    }
  }

  // Errors first, then by field, so the panel reads in priority order.
  return findings.sort((a, b) =>
    a.severity === b.severity ? a.field.localeCompare(b.field) : a.severity === 'error' ? -1 : 1
  );
}

/** Flatten a doc's field values into plain strings for checking. */
export function valuesOf(fields: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(fields)) {
    if (typeof v === 'boolean' || v === null || v === undefined) continue;
    if (typeof v === 'string' && v.startsWith('data:')) continue; // an uploaded image
    out[k] = Array.isArray(v) ? v.join('\n') : String(v);
  }
  return out;
}

export const countBySeverity = (f: Finding[]) => ({
  error: f.filter((x) => x.severity === 'error').length,
  warn: f.filter((x) => x.severity === 'warn').length,
});
