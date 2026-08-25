'use client';

import { useMemo } from 'react';
import type { Preset } from '@/content/templates/types';
import type { Doc } from '@/lib/use-editor-state';
import { checkText, valuesOf, countBySeverity, type Finding } from '@/lib/voice';

/**
 * The playbook, applied to what you are typing.
 *
 * Advisory, never blocking — the playbook is explicit that a human judges
 * whether copy sounds right, and this cannot. What it can do is notice the
 * things that are not judgement calls: an exclamation point, "leverage",
 * "NGN 25,000". Every finding names the rule it comes from so it can be looked
 * up, and argued with.
 *
 * The same rules run in scripts/verify-voice.mjs over every template's default
 * copy, from this same module, so the panel and the build cannot disagree.
 */
export function VoicePanel({
  preset,
  doc,
  onFocusField,
}: {
  preset: Preset;
  doc: Doc;
  onFocusField?: (key: string) => void;
}) {
  const findings = useMemo(
    () => checkText({ layout: preset.layout, props: preset.props, values: valuesOf(doc.fields) }),
    [preset.layout, preset.props, doc.fields]
  );

  const counts = countBySeverity(findings);
  const labelFor = (f: Finding) => preset.fields.find((x) => x.k === f.field)?.label ?? f.field;

  return (
    <section aria-label="Voice check">
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--sp-3)' }}>
        <h2 className="fl-h4" style={{ margin: 0 }}>Voice</h2>
        <span
          className="tag"
          style={
            counts.error
              ? { background: 'var(--fl-red-100)', color: 'var(--fl-red-700)', borderColor: 'var(--fl-red-200)' }
              : counts.warn
                ? { background: 'var(--fl-amber-100)', color: 'var(--fl-amber-800)', borderColor: 'var(--fl-amber-200)' }
                : { background: 'var(--fl-green-100)', color: 'var(--fl-green-800)', borderColor: 'var(--fl-green-200)' }
          }
        >
          {counts.error ? `${counts.error} to fix` : counts.warn ? `${counts.warn} to consider` : 'Clear'}
        </span>
      </div>

      {findings.length === 0 ? (
        <p className="note">
          Nothing to flag. The checks cover exclamation points, SaaS abstraction,
          money format, “users”, emoji outside a conversation, bare percentages
          and shouting.
        </p>
      ) : (
        <ul className="voice-list">
          {findings.map((f) => (
            <li key={`${f.rule}-${f.field}`} className="voice-item" data-severity={f.severity}>
              <button
                type="button"
                className="voice-hit"
                onClick={() => onFocusField?.(f.field)}
                title={`Go to ${labelFor(f)}`}
              >
                <span className="voice-field">{labelFor(f)}</span>
                <span className="voice-excerpt">“{f.excerpt}”</span>
              </button>
              <p className="voice-message">{f.message}</p>
              <p className="voice-source">{f.source}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
