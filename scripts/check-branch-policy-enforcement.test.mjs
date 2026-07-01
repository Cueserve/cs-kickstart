import assert from 'node:assert/strict';
import test from 'node:test';

import { renderEvidence, readEvidence, detectHost } from './branch-policy-enforcement/util.mjs';
import * as github from './branch-policy-enforcement/github.mjs';
import * as azureDevops from './branch-policy-enforcement/azure-devops.mjs';
import * as gitlab from './branch-policy-enforcement/gitlab.mjs';
import * as bitbucket from './branch-policy-enforcement/bitbucket.mjs';

// --- host detection ---------------------------------------------------------

test('detectHost maps remotes to hosts', () => {
  assert.equal(detectHost('git@github.com:acme/app.git'), 'github');
  assert.equal(detectHost('https://github.com/acme/app'), 'github');
  assert.equal(detectHost('https://dev.azure.com/acme/proj/_git/app'), 'azure-devops');
  assert.equal(detectHost('https://acme.visualstudio.com/proj/_git/app'), 'azure-devops');
  assert.equal(detectHost('git@bitbucket.org:acme/app.git'), 'bitbucket');
  assert.equal(detectHost('https://gitlab.com/acme/group/app.git'), 'gitlab');
  assert.equal(detectHost('https://example.com/acme/app.git'), null);
});

// --- identity parsing -------------------------------------------------------

test('github parseIdentity handles ssh and https', () => {
  assert.deepEqual(github.parseIdentity('git@github.com:acme/app.git'), { owner: 'acme', repo: 'app' });
  assert.deepEqual(github.parseIdentity('https://github.com/acme/app'), { owner: 'acme', repo: 'app' });
});

test('azure-devops parseIdentity handles all three remote forms', () => {
  assert.deepEqual(azureDevops.parseIdentity('https://dev.azure.com/acme/proj/_git/app'), {
    orgUrl: 'https://dev.azure.com/acme',
    project: 'proj',
    repo: 'app',
  });
  assert.deepEqual(azureDevops.parseIdentity('git@ssh.dev.azure.com:v3/acme/proj/app'), {
    orgUrl: 'https://dev.azure.com/acme',
    project: 'proj',
    repo: 'app',
  });
  assert.deepEqual(azureDevops.parseIdentity('https://acme.visualstudio.com/proj/_git/app'), {
    orgUrl: 'https://acme.visualstudio.com',
    project: 'proj',
    repo: 'app',
  });
});

test('gitlab parseIdentity URL-encodes nested group paths', () => {
  assert.deepEqual(gitlab.parseIdentity('git@gitlab.com:acme/group/app.git'), {
    projectPath: 'acme/group/app',
    encoded: 'acme%2Fgroup%2Fapp',
  });
});

test('bitbucket parseIdentity extracts workspace and repo', () => {
  assert.deepEqual(bitbucket.parseIdentity('https://bitbucket.org/acme/app.git'), { workspace: 'acme', repo: 'app' });
});

// --- capability decisions (the security-relevant logic) ---------------------

test('github decide: required review => host-enforced', () => {
  assert.equal(
    github.decide({ required_pull_request_reviews: { required_approving_review_count: 1 } }).capability,
    'host-enforced'
  );
});

test('github decide: no protection or zero reviewers => process-enforced', () => {
  assert.equal(github.decide(null).capability, 'process-enforced');
  assert.equal(
    github.decide({ required_pull_request_reviews: { required_approving_review_count: 0 } }).capability,
    'process-enforced'
  );
  assert.equal(github.decide({}).capability, 'process-enforced');
});

test('azure-devops decide: blocking min-reviewer policy => host-enforced', () => {
  const policies = [
    {
      isEnabled: true,
      isBlocking: true,
      type: { id: 'fa4e907d-c16b-4a4c-9dfa-4906e5d171dd' },
      settings: { minimumApproverCount: 2 },
    },
  ];
  assert.equal(azureDevops.decide(policies).capability, 'host-enforced');
});

test('azure-devops decide: non-blocking or disabled policy => process-enforced', () => {
  assert.equal(
    azureDevops.decide([
      { isEnabled: true, isBlocking: false, type: { displayName: 'Minimum number of reviewers' }, settings: { minimumApproverCount: 1 } },
    ]).capability,
    'process-enforced'
  );
  assert.equal(azureDevops.decide([]).capability, 'process-enforced');
  assert.equal(azureDevops.decide(null).capability, 'process-enforced');
});

test('gitlab decide: approval rule >= 1 => host-enforced', () => {
  assert.equal(gitlab.decide([{ approvals_required: 1 }]).capability, 'host-enforced');
  assert.equal(gitlab.decide([{ approvals_required: 0 }]).capability, 'process-enforced');
  assert.equal(gitlab.decide([]).capability, 'process-enforced');
});

test('bitbucket decide: require_approvals_to_merge >= 1 => host-enforced', () => {
  assert.equal(
    bitbucket.decide({ values: [{ kind: 'require_approvals_to_merge', value: 1 }] }).capability,
    'host-enforced'
  );
  assert.equal(
    bitbucket.decide({ values: [{ kind: 'require_approvals_to_merge', value: 0 }] }).capability,
    'process-enforced'
  );
  assert.equal(bitbucket.decide({ values: [] }).capability, 'process-enforced');
});

// --- evidence block round-trip ----------------------------------------------

test('evidence block round-trips through render and read', () => {
  const block = renderEvidence({ host: 'github', mode: 'host-enforced', capability: 'host-enforced', detail: 'count=1' });
  const wrapped = `# CONTRIBUTING\n\nsome text\n\n${block}\n\nmore text\n`;
  const parsed = readEvidence(wrapped);
  assert.equal(parsed.host, 'github');
  assert.equal(parsed.mode, 'host-enforced');
  assert.equal(parsed.capability, 'host-enforced');
  assert.equal(parsed.detail, 'count=1');
});

test('readEvidence returns null when the block is absent', () => {
  assert.equal(readEvidence('# CONTRIBUTING\n\nno block here\n'), null);
});
