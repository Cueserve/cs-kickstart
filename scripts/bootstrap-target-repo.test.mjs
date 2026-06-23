import assert from 'node:assert/strict';
import { access, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import {
  collectScaffoldEntries,
  extractCopilotInitiationRunnerBlock,
  runBootstrap,
} from './bootstrap-target-repo.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

test('collectScaffoldEntries includes reusable scaffold and excludes kit maintenance files', async () => {
  const entries = await collectScaffoldEntries({
    sourceRoot: repoRoot,
    tools: ['claude', 'copilot'],
  });
  const targets = entries.map((entry) => entry.targetRelativePath).sort();

  assert.ok(targets.includes('README.md'));
  assert.ok(targets.includes('docs/guides/proj-init/_overview.md'));
  assert.ok(targets.includes('docs/guides/proj-init/templates/PRODUCT.template.md'));
  assert.ok(targets.includes('scripts/check-template-drift.mjs'));
  assert.ok(targets.includes('.claude/commands/proj-init-product.md'));
  assert.ok(targets.includes('.claude/roles/product-owner.md'));
  assert.ok(targets.includes('.github/prompts/proj-init-product.prompt.md'));
  assert.ok(targets.includes('.github/copilot-instructions.md'));

  assert.ok(!targets.includes('CLAUDE.md'));
  assert.ok(!targets.includes('src/index.ts'));
  // The bootstrap script is kit-only machinery; the target repo never re-bootstraps itself.
  assert.ok(!targets.includes('scripts/bootstrap-target-repo.mjs'));
  assert.ok(!targets.some((target) => target.startsWith('.claude/skills/')));
  assert.ok(!targets.some((target) => target.startsWith('graphify-out/')));

  const copilotInstructions = entries.find(
    (entry) => entry.targetRelativePath === '.github/copilot-instructions.md',
  );
  assert.equal(copilotInstructions.transform, 'copilot-initiation-runner');
});

test('collectScaffoldEntries copies runner role files even when only Copilot is selected', async () => {
  const entries = await collectScaffoldEntries({ sourceRoot: repoRoot, tools: ['copilot'] });
  const targets = entries.map((entry) => entry.targetRelativePath);

  // _run-step.md is always copied and unconditionally loads these role files,
  // so they must ship regardless of the selected AI tool.
  assert.ok(targets.includes('.claude/roles/product-owner.md'));
  assert.ok(targets.includes('.claude/roles/solution-architect.md'));
  assert.ok(!targets.some((target) => target.startsWith('.claude/commands/')));
});

test('extractCopilotInitiationRunnerBlock keeps only the initiation runner block', async () => {
  const source = await readFile(join(repoRoot, '.github/copilot-instructions.md'), 'utf8');
  const block = extractCopilotInitiationRunnerBlock(source);

  assert.match(block, /INITIATION-RUNNER/);
  assert.match(block, /docs\/guides\/proj-init\/_run-step\.md/);
  assert.doesNotMatch(block, /graphify/);
  assert.ok(block.trimEnd().endsWith('<!-- END INITIATION-RUNNER -->'));
});

test('runBootstrap defaults to dry-run and does not write target files', async () => {
  const targetRoot = await mkdtemp(join(tmpdir(), 'cs-kickstart-dry-run-'));
  try {
    const result = await runBootstrap({
      sourceRoot: repoRoot,
      targetRoot,
      tools: ['copilot'],
      apply: false,
      skipGit: true,
    });

    assert.equal(result.mode, 'dry-run');
    assert.ok(result.entries.length > 0);
    assert.equal(await exists(join(targetRoot, 'README.md')), false);
    assert.equal(await exists(join(targetRoot, '.github/copilot-instructions.md')), false);
  } finally {
    await rm(targetRoot, { recursive: true, force: true });
  }
});

test('runBootstrap apply copies scaffold and preserves downstream boundaries', async () => {
  const targetRoot = await mkdtemp(join(tmpdir(), 'cs-kickstart-apply-'));
  try {
    const result = await runBootstrap({
      sourceRoot: repoRoot,
      targetRoot,
      tools: ['claude', 'copilot'],
      apply: true,
      skipGit: true,
    });

    assert.equal(result.mode, 'apply');
    assert.ok(result.written.includes('README.md'));
    assert.ok(await exists(join(targetRoot, 'docs/guides/proj-init/_run-step.md')));
    assert.ok(await exists(join(targetRoot, 'scripts/check-template-drift.mjs')));
    assert.equal(await exists(join(targetRoot, 'scripts/bootstrap-target-repo.mjs')), false);
    assert.ok(await exists(join(targetRoot, '.claude/commands/proj-init-product.md')));
    assert.ok(await exists(join(targetRoot, '.github/prompts/proj-init-product.prompt.md')));

    const copilotInstructions = await readFile(
      join(targetRoot, '.github/copilot-instructions.md'),
      'utf8',
    );
    assert.match(copilotInstructions, /INITIATION-RUNNER/);
    assert.doesNotMatch(copilotInstructions, /graphify/);

    assert.equal(await exists(join(targetRoot, 'CLAUDE.md')), false);
    assert.equal(await exists(join(targetRoot, 'src/index.ts')), false);
    assert.equal(await exists(join(targetRoot, '.claude/skills/graphify/SKILL.md')), false);
  } finally {
    await rm(targetRoot, { recursive: true, force: true });
  }
});