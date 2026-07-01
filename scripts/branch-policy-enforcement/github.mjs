// scripts/branch-policy-enforcement/github.mjs
//
// GitHub capability probe: does `main` require an approving review before merge?
// Uses `gh api` so it rides the operator's existing `gh` auth.

import { run, cliPresent, ProbeError } from './util.mjs';

export function parseIdentity(remoteUrl) {
  // git@github.com:owner/repo.git | https://github.com/owner/repo(.git)
  const m = remoteUrl.match(/github\.com[/:]([^/]+)\/([^/]+?)(?:\.git)?$/i);
  if (!m) throw new ProbeError(`Cannot parse GitHub owner/repo from remote: ${remoteUrl}`);
  return { owner: m[1], repo: m[2] };
}

// Pure: decide capability from the branch-protection payload (or null when the
// API answered "no protection / no access").
export function decide(protection) {
  if (!protection) {
    return { capability: 'process-enforced', detail: 'no branch protection with required reviews on main' };
  }
  const rpr = protection.required_pull_request_reviews;
  const count = rpr?.required_approving_review_count ?? 0;
  if (rpr && count >= 1) {
    return {
      capability: 'host-enforced',
      detail: `required_approving_review_count=${count}; require_code_owner_reviews=${!!rpr.require_code_owner_reviews}`,
    };
  }
  return { capability: 'process-enforced', detail: 'branch protection present but no required approving reviews' };
}

export async function probe(ctx) {
  if (!cliPresent('gh')) {
    throw new ProbeError('GitHub CLI `gh` not found on PATH — install it or run the probe where it is available.');
  }
  const { owner, repo } = ctx.identity;
  const r = run(
    'gh',
    ['api', `repos/${owner}/${repo}/branches/main/protection`, '-H', 'Accept: application/vnd.github+json'],
    { cwd: ctx.target }
  );

  if (r.ok) {
    let json;
    try {
      json = JSON.parse(r.stdout);
    } catch {
      throw new ProbeError('Unexpected non-JSON response from `gh api`.');
    }
    return decide(json);
  }

  const err = r.stderr.toLowerCase();
  // Undetermined → ProbeError. A real "not protected / no permission" → process-enforced.
  if (err.includes('401') || err.includes('authentication') || err.includes('gh auth login') || err.includes('bad credentials')) {
    throw new ProbeError('`gh` is not authenticated — run `gh auth login`, then re-run the probe.');
  }
  if (err.includes('404') || err.includes('not found') || err.includes('branch not protected')) {
    return { capability: 'process-enforced', detail: 'main has no branch protection (HTTP 404)' };
  }
  if (err.includes('403')) {
    // Free-plan private repos: the protection API is unavailable → cannot host-enforce.
    return { capability: 'process-enforced', detail: 'branch protection unavailable on this plan (HTTP 403)' };
  }
  throw new ProbeError(`gh api failed: ${r.stderr.trim() || 'unknown error'}`);
}
