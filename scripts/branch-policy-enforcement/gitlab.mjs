// scripts/branch-policy-enforcement/gitlab.mjs
//
// GitLab capability probe: does an approval rule require at least one approval
// before merge? Uses `glab api` so it rides the operator's existing `glab` auth.
// Note: Code Owner approval enforcement additionally requires Premium.

import { run, cliPresent, ProbeError } from './util.mjs';

export function parseIdentity(remoteUrl) {
  // git@gitlab.com:group/sub/repo.git | https://gitlab.com/group/sub/repo(.git)
  const m = remoteUrl.match(/gitlab[^/:]*[/:](.+?)(?:\.git)?$/i);
  if (!m) throw new ProbeError(`Cannot parse GitLab project path from remote: ${remoteUrl}`);
  const projectPath = m[1].replace(/^https?:\/\/[^/]+\//i, '');
  return { projectPath, encoded: encodeURIComponent(projectPath) };
}

// Pure: decide capability from the approval-rules list.
export function decide(rules) {
  const rule = (rules ?? []).find((r) => (r?.approvals_required ?? 0) >= 1);
  if (rule) {
    return { capability: 'host-enforced', detail: `approval rule requires ${rule.approvals_required} approval(s)` };
  }
  return { capability: 'process-enforced', detail: 'no approval rule requires >= 1 approval' };
}

export async function probe(ctx) {
  if (!cliPresent('glab', ['version'])) {
    throw new ProbeError('GitLab CLI `glab` not found on PATH — install it or run the probe where it is available.');
  }
  const { encoded } = ctx.identity;
  const r = run('glab', ['api', `projects/${encoded}/approval_rules`], { cwd: ctx.target });

  if (r.ok) {
    let rules;
    try {
      rules = JSON.parse(r.stdout);
    } catch {
      throw new ProbeError('Unexpected non-JSON response from `glab api`.');
    }
    return decide(rules);
  }

  const err = r.stderr.toLowerCase();
  if (err.includes('401') || err.includes('unauthorized') || err.includes('authentication') || err.includes('glab auth login')) {
    throw new ProbeError('`glab` is not authenticated — run `glab auth login`, then re-run the probe.');
  }
  if (err.includes('404') || err.includes('not found')) {
    // Approval rules unavailable (plan limitation) → not host-enforceable here.
    return { capability: 'process-enforced', detail: 'no approval rules available (HTTP 404 / plan limitation)' };
  }
  throw new ProbeError(`glab api failed: ${r.stderr.trim() || 'unknown error'}`);
}
