import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';

import { clearState, readState, runBootstrap, statePath } from './bootstrap-target-repo.mjs';

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function git(args, cwd) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8', shell: false });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed: ${(result.stderr || '').trim()}`);
  }
  return result;
}

// A local repo with one commit that can be used as a clone source.
async function makeSourceRepo() {
  const dir = join(await mkdtemp(join(tmpdir(), 'cs-kickstart-src-')), 'src');
  await mkdir(dir, { recursive: true });
  git(['init', '-b', 'main'], dir);
  git(['config', 'user.email', 'test@example.com'], dir);
  git(['config', 'user.name', 'Test'], dir);
  await writeFile(join(dir, 'README.md'), '# source\n', 'utf8');
  git(['add', '.'], dir);
  git(['commit', '-m', 'init'], dir);
  return dir;
}

async function makeKitRoot() {
  return mkdtemp(join(tmpdir(), 'cs-kickstart-kit-'));
}

// A folder under an existing parent, but not yet created — git clone creates the leaf.
async function targetSlot() {
  const parent = await mkdtemp(join(tmpdir(), 'cs-kickstart-target-'));
  return join(parent, 'clone');
}

test('runBootstrap dry-run neither clones nor writes state', async () => {
  const kitRoot = await makeKitRoot();
  const gitUrl = await makeSourceRepo();
  const targetRoot = await targetSlot();
  try {
    const result = await runBootstrap({ kitRoot, targetRoot, gitUrl, apply: false });

    assert.equal(result.mode, 'dry-run');
    assert.equal(result.cloned, false);
    assert.equal(await exists(targetRoot), false);
    assert.equal(await exists(statePath(kitRoot)), false);
    assert.equal(await readState(kitRoot), null);
  } finally {
    await rm(kitRoot, { recursive: true, force: true });
  }
});

test('runBootstrap dry-run flags a non-empty target folder without failing', async () => {
  const kitRoot = await makeKitRoot();
  const gitUrl = await makeSourceRepo();
  const targetRoot = await targetSlot();
  try {
    await mkdir(targetRoot, { recursive: true });
    await writeFile(join(targetRoot, 'keep.txt'), 'x', 'utf8');

    const result = await runBootstrap({ kitRoot, targetRoot, gitUrl, apply: false });

    assert.equal(result.mode, 'dry-run');
    assert.equal(result.targetFolderEmpty, false);
    assert.equal(await readState(kitRoot), null);
  } finally {
    await rm(kitRoot, { recursive: true, force: true });
  }
});

test('runBootstrap dry-run reports an empty/absent target folder as usable', async () => {
  const kitRoot = await makeKitRoot();
  const gitUrl = await makeSourceRepo();
  const targetRoot = await targetSlot();
  try {
    const result = await runBootstrap({ kitRoot, targetRoot, gitUrl, apply: false });

    assert.equal(result.mode, 'dry-run');
    assert.equal(result.targetFolderEmpty, true);
  } finally {
    await rm(kitRoot, { recursive: true, force: true });
  }
});

test('runBootstrap apply clones the target and registers state', async () => {
  const kitRoot = await makeKitRoot();
  const gitUrl = await makeSourceRepo();
  const targetRoot = await targetSlot();
  try {
    const result = await runBootstrap({ kitRoot, targetRoot, gitUrl, apply: true });

    assert.equal(result.mode, 'apply');
    assert.equal(result.cloned, true);
    assert.ok(await exists(join(targetRoot, '.git')));
    assert.ok(await exists(join(targetRoot, 'README.md')));

    const state = await readState(kitRoot);
    assert.equal(state.targetFolder, resolve(targetRoot));
    assert.equal(state.gitUrl, gitUrl);
    assert.ok(state.createdAt);
  } finally {
    await rm(kitRoot, { recursive: true, force: true });
  }
});

test('runBootstrap refuses a non-empty target folder', async () => {
  const kitRoot = await makeKitRoot();
  const gitUrl = await makeSourceRepo();
  const targetRoot = await targetSlot();
  try {
    await mkdir(targetRoot, { recursive: true });
    await writeFile(join(targetRoot, 'keep.txt'), 'x', 'utf8');

    await assert.rejects(
      () => runBootstrap({ kitRoot, targetRoot, gitUrl, apply: true }),
      /not empty/,
    );
    assert.equal(await readState(kitRoot), null);
  } finally {
    await rm(kitRoot, { recursive: true, force: true });
  }
});

test('runBootstrap refuses a second workspace unless --force is passed', async () => {
  const kitRoot = await makeKitRoot();
  const gitUrl = await makeSourceRepo();
  const firstTarget = await targetSlot();
  const secondTarget = await targetSlot();
  try {
    await runBootstrap({ kitRoot, targetRoot: firstTarget, gitUrl, apply: true });

    await assert.rejects(
      () => runBootstrap({ kitRoot, targetRoot: secondTarget, gitUrl, apply: true }),
      /already registered/,
    );

    const forced = await runBootstrap({
      kitRoot,
      targetRoot: secondTarget,
      gitUrl,
      apply: true,
      force: true,
    });
    assert.equal(forced.mode, 'apply');
    const state = await readState(kitRoot);
    assert.equal(state.targetFolder, resolve(secondTarget));
  } finally {
    await rm(kitRoot, { recursive: true, force: true });
  }
});

test('clearState removes the registered workspace', async () => {
  const kitRoot = await makeKitRoot();
  const gitUrl = await makeSourceRepo();
  const targetRoot = await targetSlot();
  try {
    await runBootstrap({ kitRoot, targetRoot, gitUrl, apply: true });
    assert.ok(await exists(statePath(kitRoot)));

    await clearState(kitRoot);
    assert.equal(await exists(statePath(kitRoot)), false);
    assert.equal(await readState(kitRoot), null);
  } finally {
    await rm(kitRoot, { recursive: true, force: true });
  }
});
