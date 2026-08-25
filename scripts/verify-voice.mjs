/**
 * The playbook's voice rules, applied to every template's default copy.
 *
 * Section 17 of the playbook says a rule that can be a check should be one.
 * This is that check. It fails the build on `error` severity only — the
 * warn-level rules are opinions a human may reasonably overrule, and a build
 * that refused "64% of inbound answered from the knowledge base" would be
 * wrong.
 *
 * Same rules as the studio's live panel, from the same module, so the two can
 * never disagree.
 */
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import './lib-alias.mjs';

const { defaultsOf } = await import('../src/content/templates/types.ts');
const { checkText, valuesOf } = await import('../src/lib/voice.ts');

/**
 * The presets are read by globbing the directory rather than by importing the
 * registry, for two reasons: the registry also imports the React layouts, which
 * Node cannot transform, and a glob cannot drift — a new preset file is checked
 * the moment it exists, without anyone remembering to list it here.
 */
async function loadPresets() {
  const dir = path.resolve(import.meta.dirname, '../src/content/templates/presets');
  const files = (await readdir(dir)).filter((f) => f.endsWith('.ts')).sort();
  const presets = [];
  for (const file of files) {
    const mod = await import(pathToFileURL(path.join(dir, file)).href);
    for (const value of Object.values(mod)) {
      if (Array.isArray(value) && value.every((v) => v && typeof v === 'object' && 'id' in v && 'fields' in v)) {
        presets.push(...value);
      }
    }
  }
  if (presets.length === 0) throw new Error('no presets found — the glob or the alias hook is broken');
  return presets;
}

const PRESETS = await loadPresets();

const args = new Set(process.argv.slice(2));
const showWarnings = args.has('--warnings');

const errors = [];
const warnings = [];

for (const preset of PRESETS) {
  const findings = checkText({
    layout: preset.layout,
    props: preset.props,
    values: valuesOf(defaultsOf(preset)),
  });
  for (const f of findings) {
    const line = `${preset.id} · ${f.field} · “${f.excerpt}” — ${f.message}`;
    (f.severity === 'error' ? errors : warnings).push({ line, source: f.source });
  }
}

for (const e of errors) {
  console.error(`  FAIL ${e.line}`);
  console.error(`       ${e.source}`);
}

if (showWarnings) {
  for (const w of warnings) console.log(`  warn ${w.line}`);
}

const checked = PRESETS.length;
if (errors.length === 0) {
  console.log(
    `\nverify-voice: ${checked} templates, no voice violations` +
      (warnings.length ? ` (${warnings.length} advisory — run with --warnings to list)` : '')
  );
  process.exit(0);
}

console.error(`\nverify-voice: ${errors.length} violation(s) across ${checked} templates`);
console.error('These break a stated rule in src/content/brand.ts. Fix the copy, not the rule.');
process.exit(1);
