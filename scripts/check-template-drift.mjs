#!/usr/bin/env node
// check-template-drift.mjs
//
// Verifies that each proj-init step's output template and its guide agree on
// the canonical section list. The template owns the headings; the guide's
// "What This Document Covers" map must list the same headings, in the same
// order. This is the mechanical half of the drift-control rule — the template
// owns structure, the guide owns meaning, and this script fails the build when
// the two structures diverge.
//
//   Usage:  node scripts/check-template-drift.mjs
//   Exit 0  every templated step is in sync.
//   Exit 1  drift detected (mismatched positions are printed) or no templates.
//
// Zero dependencies, no package.json. Run with the repo's Node (v18+).
//
// Convention this relies on:
//   - Template content sections are numbered H2s:  `## N. Heading`
//   - Guide map items are a numbered bold list:    `N. **Heading** — meaning`
//     inside the guide's `## What This Document Covers` section.
// (README is the header-block exception; if its template uses unnumbered
//  headings, number its guide map the same way or extend templateHeadings.)

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const stepsPath = join(repoRoot, 'docs/guides/proj-init/_steps.yml');

function normalize(text) {
  return text
    .replace(/[*_]\(.*?\)[*_]/g, '') // drop italic ( ... ) qualifiers
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

// Minimal _steps.yml reader: pair each step's `guide:` and `template:` values.
function parseSteps(yml) {
  const steps = [];
  let cur = null;
  for (const raw of yml.split(/\r?\n/)) {
    const idMatch = raw.match(/^\s*-\s+id:\s*(.+?)\s*$/);
    if (idMatch) {
      cur = { id: idMatch[1] };
      steps.push(cur);
      continue;
    }
    if (!cur) continue;
    const g = raw.match(/^\s+guide:\s*(.+?)\s*$/);
    if (g) cur.guide = g[1].replace(/^["']|["']$/g, '');
    const t = raw.match(/^\s+template:\s*(.+?)\s*$/);
    if (t) cur.template = t[1].replace(/^["']|["']$/g, '');
  }
  return steps;
}

// Structural headings that are never content sections (TOC, references map).
const STRUCTURAL = new Set(['contents', 'table of contents', 'document references']);

// Ordered text of content-section H2 headings. Numbered (`## N. Heading`) is
// the norm; README is the header-block exception and uses unnumbered headings,
// so fall back to all non-structural H2s when none are numbered.
function templateHeadings(md) {
  const numbered = [];
  const unnumbered = [];
  for (const line of md.split(/\r?\n/)) {
    const n = line.match(/^##\s+\d+\.\s+(.+?)\s*$/);
    if (n) {
      numbered.push(n[1]);
      continue;
    }
    const h = line.match(/^##\s+(.+?)\s*$/);
    if (h && !STRUCTURAL.has(normalize(h[1]))) unnumbered.push(h[1]);
  }
  return numbered.length ? numbered : unnumbered;
}

// Ordered text from the numbered bold map inside "What This Document Covers".
function guideHeadings(md) {
  const out = [];
  let inSection = false;
  for (const line of md.split(/\r?\n/)) {
    if (/^##\s+/.test(line)) {
      inSection = /^##\s+What This Document Covers\s*$/i.test(line);
      continue;
    }
    if (!inSection) continue;
    const m = line.match(/^\s*\d+\.\s+\*\*(.+?)\*\*/);
    if (m) out.push(m[1]);
  }
  return out;
}

function compare(tplHead, guideHead) {
  const a = tplHead.map(normalize);
  const b = guideHead.map(normalize);
  const problems = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i] !== b[i]) {
      problems.push(
        `  pos ${i + 1}: template=${JSON.stringify(tplHead[i] ?? null)}` +
          ` guide=${JSON.stringify(guideHead[i] ?? null)}`
      );
    }
  }
  return problems;
}

const steps = parseSteps(readFileSync(stepsPath, 'utf8'));
let checked = 0;
let failed = 0;

for (const step of steps) {
  if (!step.template) continue;
  checked++;
  const tpl = templateHeadings(readFileSync(join(repoRoot, step.template), 'utf8'));
  const guide = guideHeadings(readFileSync(join(repoRoot, step.guide), 'utf8'));
  const problems = compare(tpl, guide);
  if (tpl.length === 0) {
    problems.unshift('  template has no numbered "## N." headings');
  }
  if (guide.length === 0) {
    problems.unshift('  guide "What This Document Covers" has no numbered **bold** map');
  }
  if (problems.length) {
    failed++;
    console.error(`DRIFT — step ${step.id}: ${step.template} vs ${step.guide}`);
    for (const p of problems) console.error(p);
  } else {
    console.log(`ok — step ${step.id}: ${tpl.length} sections match (${step.template})`);
  }
}

if (checked === 0) {
  console.error('No steps with a `template:` field found in _steps.yml.');
  process.exit(1);
}
if (failed) {
  console.error(`\n${failed} step(s) drifted.`);
  process.exit(1);
}
console.log(`\nAll ${checked} templated step(s) in sync.`);
