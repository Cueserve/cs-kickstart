#!/usr/bin/env node
// scripts/check-branch-policy-enforcement.mjs
//
// Step-01 enforcement capability probe — the mechanical half of the D4 rule:
// "the enforcement mode recorded in CONTRIBUTING.md must equal what the host
// actually enforces." Branch protection existing does NOT prove a required
// reviewer is enforced; this asks the host directly, so a doc landing on `main`
// can be trusted (or not) accordingly.
//
//   Probe (read-only) and print an evidence block to paste into CONTRIBUTING.md:
//     node scripts/check-branch-policy-enforcement.mjs --probe [--mode host-enforced|process-enforced]
//
//   Verify the recorded mode still matches the host (run at every step's gate):
//     node scripts/check-branch-policy-enforcement.mjs --verify
//
//   Options:
//     --target <path>   target clone (default: .proj-init/state.json → targetFolder)
//     --host <host>     github | azure-devops | gitlab | bitbucket (default: detect from origin)
//     --mode <mode>     intended mode for --probe (default: the probed capability)
//
//   Exit 0  OK — probe determined a capability, or verify passed.
//   Exit 1  the recorded/intended mode claims host-enforced but the host does not enforce it.
//   Exit 2  capability could not be determined (CLI missing, not authenticated, network).
//   Exit 3  usage / resolution error (no target, unknown host, unparseable remote).
//
// Zero dependencies; Node 18+ (uses global fetch and util.parseArgs).

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { parseArgs } from 'node:util';

import { ProbeError, gitRemoteUrl, detectHost, renderEvidence, readEvidence, EVIDENCE_MARKER } from './branch-policy-enforcement/util.mjs';
import * as github from './branch-policy-enforcement/github.mjs';
import * as azureDevops from './branch-policy-enforcement/azure-devops.mjs';
import * as gitlab from './branch-policy-enforcement/gitlab.mjs';
import * as bitbucket from './branch-policy-enforcement/bitbucket.mjs';

const HOSTS = { github, 'azure-devops': azureDevops, gitlab, bitbucket };
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

class UsageError extends Error {}

function fail(code, msg) {
  console.error(msg);
  process.exit(code);
}

function resolveTarget(explicit) {
  if (explicit) return resolve(explicit);
  const statePath = join(repoRoot, '.proj-init', 'state.json');
  let state;
  try {
    state = JSON.parse(readFileSync(statePath, 'utf8'));
  } catch {
    throw new UsageError('No initiation workspace found. Run Step-00 (/proj-init-bootstrap) first, or pass --target <path>.');
  }
  if (!state.targetFolder) throw new UsageError('.proj-init/state.json has no targetFolder. Re-run Step-00.');
  return state.targetFolder;
}

function buildContext(values) {
  const target = resolveTarget(values.target);
  const remoteUrl = gitRemoteUrl(target);
  if (!remoteUrl) throw new UsageError(`No 'origin' remote found in ${target}.`);
  const host = values.host ?? detectHost(remoteUrl);
  if (!host) throw new UsageError(`Could not detect host from remote: ${remoteUrl}. Pass --host github|azure-devops|gitlab|bitbucket.`);
  const mod = HOSTS[host];
  if (!mod) throw new UsageError(`Unknown host '${host}'. Expected one of: ${Object.keys(HOSTS).join(', ')}.`);
  const identity = mod.parseIdentity(remoteUrl);
  return { target, remoteUrl, host, mod, identity };
}

async function doProbe(values) {
  const ctx = buildContext(values);
  const { capability, detail } = await ctx.mod.probe(ctx);

  const mode = values.mode ?? capability;
  if (!['host-enforced', 'process-enforced'].includes(mode)) {
    throw new UsageError(`--mode must be host-enforced or process-enforced (got '${mode}').`);
  }

  console.log(`Host:        ${ctx.host}`);
  console.log(`Capability:  ${capability}  (${detail})`);
  console.log(`Recorded:    ${mode}`);

  if (mode === 'host-enforced' && capability === 'process-enforced') {
    console.error('');
    console.error('REFUSED: cannot record host-enforced — the host does not enforce a required reviewer.');
    console.error('Configure a required-reviewer / blocking approval policy on main, or record process-enforced');
    console.error('and use the self-review checklist as the gate (see 01-repo-setup.md).');
    process.exit(1);
  }

  console.log('');
  console.log('Paste this block into the Step-01 preflight evidence in CONTRIBUTING.md:');
  console.log('');
  console.log(renderEvidence({ host: ctx.host, mode, capability, detail }));
  process.exit(0);
}

async function doVerify(values) {
  const ctx = buildContext(values);

  let contributing;
  try {
    contributing = readFileSync(join(ctx.target, 'CONTRIBUTING.md'), 'utf8');
  } catch {
    fail(1, 'No CONTRIBUTING.md in the target. Complete Step-01 before running any step.');
  }
  const recorded = readEvidence(contributing);
  if (!recorded) {
    fail(1, `No ${EVIDENCE_MARKER} evidence block in CONTRIBUTING.md. Re-run Step-01 with --probe and record the block.`);
  }

  const { capability, detail } = await ctx.mod.probe(ctx);

  if (recorded.mode === 'host-enforced' && capability === 'process-enforced') {
    console.error('Recorded mode: host-enforced');
    console.error(`Host now says: process-enforced  (${detail})`);
    console.error('');
    console.error('STOP: CONTRIBUTING.md claims host-enforced but the host no longer enforces a required reviewer.');
    console.error('The "final on main" signal cannot be trusted. Return to Step-01 to reconcile the mode.');
    process.exit(1);
  }

  console.log(`Enforcement OK — recorded '${recorded.mode}', host capability '${capability}' (${detail}).`);
  process.exit(0);
}

async function main() {
  let values;
  try {
    ({ values } = parseArgs({
      options: {
        probe: { type: 'boolean', default: false },
        verify: { type: 'boolean', default: false },
        target: { type: 'string' },
        host: { type: 'string' },
        mode: { type: 'string' },
        help: { type: 'boolean', short: 'h', default: false },
      },
    }));
  } catch (e) {
    fail(3, e.message);
  }

  if (values.help || (!values.probe && !values.verify)) {
    console.log('Usage: node scripts/check-branch-policy-enforcement.mjs (--probe | --verify) [--target <path>] [--host <host>] [--mode <mode>]');
    process.exit(values.help ? 0 : 3);
  }
  if (values.probe && values.verify) fail(3, 'Pass only one of --probe or --verify.');

  try {
    if (values.probe) await doProbe(values);
    else await doVerify(values);
  } catch (e) {
    if (e instanceof UsageError) fail(3, e.message);
    if (e instanceof ProbeError) fail(2, `Capability undetermined: ${e.message}`);
    fail(2, `Unexpected error: ${e?.stack ?? e}`);
  }
}

main();
