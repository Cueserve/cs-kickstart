// scripts/branch-policy-enforcement/util.mjs
//
// Shared helpers for the Step-01 enforcement capability probe. Zero
// dependencies; Node 18+. Host-specific logic lives in the sibling
// github / azure-devops / gitlab / bitbucket modules.

import { execFileSync } from 'node:child_process';

// A capability probe can fail two ways:
//   - the host answers "no required reviewer is enforced" (a real result → process-enforced)
//   - we cannot get an answer at all (CLI missing, not authenticated, network)
// Only the second is a ProbeError. An *undetermined* capability must never be
// silently downgraded to process-enforced, or the probe's whole point is lost.
export class ProbeError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ProbeError';
  }
}

// Run a CLI without a shell (no injection). Returns a result object instead of
// throwing on non-zero exit — callers decide what a non-zero code means.
export function run(cmd, args, opts = {}) {
  try {
    const stdout = execFileSync(cmd, args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      ...opts,
    });
    return { ok: true, stdout, stderr: '', code: 0, spawnError: false };
  } catch (err) {
    return {
      ok: false,
      stdout: err.stdout ? String(err.stdout) : '',
      stderr: err.stderr ? String(err.stderr) : String(err.message ?? err),
      code: typeof err.status === 'number' ? err.status : err.code === 'ENOENT' ? 127 : 1,
      spawnError: err.code === 'ENOENT',
    };
  }
}

// Is a CLI on PATH at all? A missing CLI is "undetermined", never a real answer.
export function cliPresent(cmd, versionArgs = ['--version']) {
  return !run(cmd, versionArgs).spawnError;
}

export function gitRemoteUrl(target) {
  const r = run('git', ['-C', target, 'remote', 'get-url', 'origin']);
  return r.ok ? r.stdout.trim() : null;
}

export function detectHost(remoteUrl) {
  if (!remoteUrl) return null;
  const u = remoteUrl.toLowerCase();
  if (u.includes('github.com')) return 'github';
  if (u.includes('dev.azure.com') || u.includes('visualstudio.com')) return 'azure-devops';
  if (u.includes('bitbucket.org')) return 'bitbucket';
  if (u.includes('gitlab')) return 'gitlab';
  return null;
}

// --- evidence block (machine-readable, HTML-comment fenced) -----------------
// Lives inside the target's CONTRIBUTING.md so it is committed and reviewed
// alongside the governance layer, yet stays invisible in rendered Markdown.

export const EVIDENCE_MARKER = 'STEP-01-ENFORCEMENT';

export function renderEvidence({ host, mode, capability, detail }) {
  return [
    `<!-- ${EVIDENCE_MARKER}`,
    `host: ${host}`,
    `mode: ${mode}`,
    `capability: ${capability}`,
    `checked: ${new Date().toISOString()}`,
    `detail: ${detail ?? ''}`,
    `-->`,
  ].join('\n');
}

// Parse the fenced block back into { host, mode, capability, checked, detail }.
// Returns null when the block is absent or has no `mode:` line.
export function readEvidence(text) {
  if (!text) return null;
  const start = text.indexOf(`<!-- ${EVIDENCE_MARKER}`);
  if (start === -1) return null;
  const end = text.indexOf('-->', start);
  if (end === -1) return null;
  const fields = {};
  for (const line of text.slice(start, end).split(/\r?\n/)) {
    const m = line.match(/^\s*([a-z]+):\s*(.*)$/i);
    if (m) fields[m[1].toLowerCase()] = m[2].trim();
  }
  return fields.mode ? fields : null;
}
