// scripts/branch-policy-enforcement/bitbucket.mjs
//
// Bitbucket Cloud has no official CLI, so probe the REST API directly with the
// global fetch (Node 18+). Auth comes from the environment:
//   BITBUCKET_TOKEN                         (Bearer access token), or
//   BITBUCKET_USER + BITBUCKET_APP_PASSWORD (Basic auth app password)

import { ProbeError } from './util.mjs';

export function parseIdentity(remoteUrl) {
  // git@bitbucket.org:workspace/repo.git | https://bitbucket.org/workspace/repo(.git)
  const m = remoteUrl.match(/bitbucket\.org[/:]([^/]+)\/([^/]+?)(?:\.git)?$/i);
  if (!m) throw new ProbeError(`Cannot parse Bitbucket workspace/repo from remote: ${remoteUrl}`);
  return { workspace: m[1], repo: m[2] };
}

// Pure: decide capability from the branch-restrictions payload.
export function decide(restrictions) {
  const rule = (restrictions?.values ?? []).find(
    (v) => v?.kind === 'require_approvals_to_merge' && (v?.value ?? 0) >= 1
  );
  if (rule) {
    return { capability: 'host-enforced', detail: `require_approvals_to_merge=${rule.value}` };
  }
  return { capability: 'process-enforced', detail: 'no require_approvals_to_merge restriction' };
}

function authHeader() {
  if (process.env.BITBUCKET_TOKEN) {
    return `Bearer ${process.env.BITBUCKET_TOKEN}`;
  }
  if (process.env.BITBUCKET_USER && process.env.BITBUCKET_APP_PASSWORD) {
    const basic = Buffer.from(`${process.env.BITBUCKET_USER}:${process.env.BITBUCKET_APP_PASSWORD}`).toString('base64');
    return `Basic ${basic}`;
  }
  return null;
}

export async function probe(ctx) {
  const auth = authHeader();
  if (!auth) {
    throw new ProbeError('Bitbucket has no CLI to read from — set BITBUCKET_TOKEN, or BITBUCKET_USER + BITBUCKET_APP_PASSWORD, then re-run the probe.');
  }
  const { workspace, repo } = ctx.identity;
  const url = `https://api.bitbucket.org/2.0/repositories/${workspace}/${repo}/branch-restrictions?kind=require_approvals_to_merge&pagelen=100`;

  let res;
  try {
    res = await fetch(url, { headers: { Authorization: auth, Accept: 'application/json' } });
  } catch (e) {
    throw new ProbeError(`Bitbucket API request failed: ${e.message ?? e}`);
  }
  if (res.status === 401 || res.status === 403) {
    throw new ProbeError(`Bitbucket API rejected the credentials (HTTP ${res.status}) — check BITBUCKET_TOKEN / app-password scope.`);
  }
  if (res.status === 404) {
    return { capability: 'process-enforced', detail: 'repository has no branch restrictions (HTTP 404)' };
  }
  if (!res.ok) {
    throw new ProbeError(`Bitbucket API returned HTTP ${res.status}.`);
  }
  const json = await res.json();
  return decide(json);
}
