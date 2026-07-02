#!/usr/bin/env node
// bootstrap-target-repo.mjs
//
// Control-plane Step-00. Clones the target project repository into a local folder
// and registers it in .proj-init/state.json so every later /proj-init-* step
// operates on that external clone. No scaffold is copied into the target: the
// initiation machinery (guides, runner, adapters) stays in this kit, which acts
// as the control plane. Cleanup (--clear) removes the registration when the
// initiation process is complete.

import { spawnSync } from 'node:child_process';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const STATE_DIR = '.proj-init';
const STATE_FILE = 'state.json';

export function statePath(kitRoot) {
  return join(resolve(kitRoot), STATE_DIR, STATE_FILE);
}

export async function readState(kitRoot) {
  try {
    return JSON.parse(await readFile(statePath(kitRoot), 'utf8'));
  } catch {
    return null;
  }
}

async function writeState(kitRoot, state) {
  const path = statePath(kitRoot);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
  return path;
}

export async function clearState(kitRoot) {
  await rm(join(resolve(kitRoot), STATE_DIR), { recursive: true, force: true });
}

async function isEmptyDir(path) {
  try {
    const entries = await readdir(path);
    return entries.length === 0;
  } catch {
    // Missing directory is fine — git clone will create it.
    return true;
  }
}

function runGit(args, cwd = null) {
  const result = spawnSync('git', args, {
    encoding: 'utf8',
    shell: false,
    cwd: cwd ?? undefined,
  });
  return {
    ok: result.status === 0,
    stdout: (result.stdout || '').trim(),
    stderr: (result.stderr || '').trim(),
    status: result.status,
  };
}

export async function runBootstrap({
  kitRoot,
  targetRoot,
  gitUrl,
  apply = false,
  force = false,
}) {
  if (!kitRoot) throw new Error('kitRoot is required.');
  if (!targetRoot) throw new Error('targetRoot is required. Pass --target <folder>.');
  if (!gitUrl) throw new Error('gitUrl is required. Pass --url <git-remote-url>.');

  const resolvedKitRoot = resolve(kitRoot);
  const resolvedTargetRoot = resolve(targetRoot);

  const existing = await readState(resolvedKitRoot);
  if (existing && !force) {
    throw new Error(
      `An initiation workspace is already registered (target: ${existing.targetFolder}). ` +
        `Run /proj-init-cleanup (or this script with --clear) to finish it, or re-run with --force to replace it.`,
    );
  }

  if (!apply) {
    // Preview the same precondition --apply enforces, so the operator learns
    // the folder is unusable now rather than at clone time. isEmptyDir treats a
    // missing folder as empty (git clone creates it), so this only flags a
    // populated existing folder.
    const targetFolderEmpty = await isEmptyDir(resolvedTargetRoot);
    return {
      mode: 'dry-run',
      kitRoot: resolvedKitRoot,
      targetFolder: resolvedTargetRoot,
      gitUrl,
      statePath: statePath(resolvedKitRoot),
      cloned: false,
      targetFolderEmpty,
    };
  }

  // git clone requires an absent or empty target folder.
  if (!(await isEmptyDir(resolvedTargetRoot))) {
    throw new Error(
      `Target folder ${resolvedTargetRoot} is not empty. Choose an empty or non-existent folder to clone into.`,
    );
  }

  const clone = runGit(['clone', gitUrl, resolvedTargetRoot]);
  if (!clone.ok) throw new Error(`git clone failed: ${clone.stderr}`);

  const state = {
    targetFolder: resolvedTargetRoot,
    gitUrl,
    createdAt: new Date().toISOString(),
  };
  const writtenStatePath = await writeState(resolvedKitRoot, state);

  return {
    mode: 'apply',
    kitRoot: resolvedKitRoot,
    targetFolder: resolvedTargetRoot,
    gitUrl,
    statePath: writtenStatePath,
    cloned: true,
  };
}

function printUsage() {
  console.log(`Usage:
  node scripts/bootstrap-target-repo.mjs --target <folder> --url <git-url> [--apply] [--force]
  node scripts/bootstrap-target-repo.mjs --status
  node scripts/bootstrap-target-repo.mjs --clear

Step-00 clones the target project repo into <folder> and registers it in
.proj-init/state.json. Every later /proj-init-* step reads that state and
operates on the clone. No scaffold is copied into the target.

Options:
  --target <folder>   Local folder to clone the target repo into. Must be empty or non-existent.
  --url <git-url>     Git remote URL of the target repo to clone.
  --apply             Perform the clone and write state. Omit for a dry-run preview.
  --force             Replace an already-registered workspace.
  --status            Print the currently registered workspace and exit.
  --clear             Remove the registered workspace state (cleanup) and exit.
  --help              Show this help.

Examples:
  node scripts/bootstrap-target-repo.mjs --target ../acme-app --url https://github.com/acme/app.git
  node scripts/bootstrap-target-repo.mjs --target ../acme-app --url https://github.com/acme/app.git --apply
  node scripts/bootstrap-target-repo.mjs --clear`);
}

function readArgValue(argv, index, name) {
  const value = argv[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`${name} requires a value.`);
  return value;
}

function parseArgs(argv) {
  const options = {
    apply: false,
    force: false,
    clear: false,
    status: false,
    help: false,
    targetRoot: null,
    gitUrl: null,
  };

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
      continue;
    }
    if (arg === '--apply') {
      options.apply = true;
      continue;
    }
    if (arg === '--force') {
      options.force = true;
      continue;
    }
    if (arg === '--clear') {
      options.clear = true;
      continue;
    }
    if (arg === '--status') {
      options.status = true;
      continue;
    }
    if (arg === '--target') {
      options.targetRoot = readArgValue(argv, index, '--target');
      index++;
      continue;
    }
    if (arg.startsWith('--target=')) {
      options.targetRoot = arg.slice('--target='.length);
      continue;
    }
    if (arg === '--url') {
      options.gitUrl = readArgValue(argv, index, '--url');
      index++;
      continue;
    }
    if (arg.startsWith('--url=')) {
      options.gitUrl = arg.slice('--url='.length);
      continue;
    }
    if (!arg.startsWith('--') && !options.targetRoot) {
      options.targetRoot = arg;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function printResult(result) {
  console.log(`Mode: ${result.mode}`);
  console.log(`Target folder: ${result.targetFolder}`);
  console.log(`Git URL: ${result.gitUrl}`);
  console.log(`State file: ${result.statePath}`);

  if (result.mode === 'dry-run') {
    if (result.targetFolderEmpty === false) {
      console.log(
        '\nWarning: target folder is not empty — --apply will fail. ' +
          'Choose an empty or non-existent folder to clone into.',
      );
    }
    console.log('\nDry-run only. Re-run with --apply to clone and register the workspace.');
    return;
  }

  console.log(
    '\nCloned and registered. Next: complete Step-01 (repo governance) against the target, ' +
      'then run Steps 2–9 from this kit. Run /proj-init-cleanup after Step-09 merges.',
  );
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const kitRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

  if (options.help) {
    printUsage();
    return;
  }

  if (options.clear) {
    const existing = await readState(kitRoot);
    if (!existing) {
      console.log('No initiation workspace registered. Nothing to clear.');
      return;
    }
    await clearState(kitRoot);
    console.log(`Cleared initiation workspace state for target: ${existing.targetFolder}`);
    return;
  }

  if (options.status) {
    const existing = await readState(kitRoot);
    if (!existing) {
      console.log('No initiation workspace registered. Run Step-00 to create one.');
      return;
    }
    console.log(`Target folder: ${existing.targetFolder}`);
    console.log(`Git URL: ${existing.gitUrl}`);
    console.log(`Created: ${existing.createdAt}`);
    return;
  }

  if (!options.targetRoot || !options.gitUrl) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const result = await runBootstrap({
    kitRoot,
    targetRoot: options.targetRoot,
    gitUrl: options.gitUrl,
    apply: options.apply,
    force: options.force,
  });
  printResult(result);
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : null;
if (invokedPath === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  });
}
