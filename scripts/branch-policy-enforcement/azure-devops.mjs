// scripts/branch-policy-enforcement/azure-devops.mjs
//
// Azure DevOps capability probe: is there a blocking minimum-reviewer branch
// policy on `main`? Branch policies are free on all ADO plans, so host-enforced
// is usually available — but only if the policy is actually configured.

import { run, cliPresent, ProbeError } from './util.mjs';

// Well-known policy type id for "Minimum number of reviewers".
const MIN_REVIEWERS_POLICY = 'fa4e907d-c16b-4a4c-9dfa-4906e5d171dd';

export function parseIdentity(remoteUrl) {
  // https://dev.azure.com/{org}/{project}/_git/{repo}
  let m = remoteUrl.match(/dev\.azure\.com\/([^/]+)\/([^/]+)\/_git\/([^/]+?)(?:\.git)?$/i);
  if (m) return { orgUrl: `https://dev.azure.com/${m[1]}`, project: decodeURIComponent(m[2]), repo: m[3] };
  // git@ssh.dev.azure.com:v3/{org}/{project}/{repo}
  m = remoteUrl.match(/ssh\.dev\.azure\.com:v3\/([^/]+)\/([^/]+)\/([^/]+?)(?:\.git)?$/i);
  if (m) return { orgUrl: `https://dev.azure.com/${m[1]}`, project: decodeURIComponent(m[2]), repo: m[3] };
  // https://{org}.visualstudio.com/{project}/_git/{repo}
  m = remoteUrl.match(/([^/.@]+)\.visualstudio\.com\/([^/]+)\/_git\/([^/]+?)(?:\.git)?$/i);
  if (m) return { orgUrl: `https://${m[1]}.visualstudio.com`, project: decodeURIComponent(m[2]), repo: m[3] };
  throw new ProbeError(`Cannot parse Azure DevOps org/project/repo from remote: ${remoteUrl}`);
}

// Pure: decide capability from the branch policy list.
export function decide(policies) {
  const blocking = (policies ?? []).find(
    (p) =>
      p?.isEnabled &&
      p?.isBlocking &&
      (p?.type?.id === MIN_REVIEWERS_POLICY || /minimum number of reviewers/i.test(p?.type?.displayName ?? '')) &&
      (p?.settings?.minimumApproverCount ?? 0) >= 1
  );
  if (blocking) {
    return {
      capability: 'host-enforced',
      detail: `blocking min-reviewer policy on main (minimumApproverCount=${blocking.settings.minimumApproverCount})`,
    };
  }
  return { capability: 'process-enforced', detail: 'no blocking minimum-reviewer branch policy on main' };
}

export async function probe(ctx) {
  if (!cliPresent('az', ['version'])) {
    throw new ProbeError('Azure CLI `az` not found on PATH — install it (with the azure-devops extension) or run the probe where it is available.');
  }
  const { orgUrl, project, repo } = ctx.identity;

  const idRes = run(
    'az',
    ['repos', 'show', '--org', orgUrl, '--project', project, '--repository', repo, '--query', 'id', '-o', 'tsv'],
    { cwd: ctx.target }
  );
  if (!idRes.ok) {
    const err = idRes.stderr.toLowerCase();
    if (err.includes('az login') || err.includes('credentials') || err.includes('not authenticated') || err.includes('sign in')) {
      throw new ProbeError('`az` is not authenticated — run `az login`, then re-run the probe.');
    }
    throw new ProbeError(`az repos show failed: ${idRes.stderr.trim() || 'unknown error'}`);
  }
  const repoId = idRes.stdout.trim();

  const polRes = run(
    'az',
    ['repos', 'policy', 'list', '--org', orgUrl, '--project', project, '--repository-id', repoId, '--branch', 'main', '-o', 'json'],
    { cwd: ctx.target }
  );
  if (!polRes.ok) {
    throw new ProbeError(`az repos policy list failed: ${polRes.stderr.trim() || 'unknown error'}`);
  }
  let policies;
  try {
    policies = JSON.parse(polRes.stdout);
  } catch {
    throw new ProbeError('Unexpected non-JSON response from `az repos policy list`.');
  }
  return decide(policies);
}
