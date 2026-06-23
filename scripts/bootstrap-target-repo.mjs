#!/usr/bin/env node
// bootstrap-target-repo.mjs
//
// Copies the reusable Project Initiation scaffold from this starter kit into a
// target repository or local folder. It intentionally stops at bootstrap: no
// app framework, stack-specific files, commits, pushes, or Step 1 governance.

import { spawnSync } from 'node:child_process';
import { access, mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const COPILOT_START = '<!-- INITIATION-RUNNER:';
const COPILOT_END = '<!-- END INITIATION-RUNNER -->';

const ALWAYS_FILES = [
  'README.md',
  'scripts/check-template-drift.mjs',
];
const ALWAYS_DIRS = ['docs/guides/proj-init', '.claude/roles'];

const TOOL_SCAFFOLD = {
  claude: {
    dirs: ['.claude/commands'],
    files: [],
  },
  copilot: {
    dirs: ['.github/prompts'],
    files: ['.github/copilot-instructions.md'],
  },
};

function toPosixPath(path) {
  return path.split(sep).join('/');
}

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function collectFiles(sourceRoot, relativeDir) {
  const absoluteDir = join(sourceRoot, relativeDir);
  if (!(await pathExists(absoluteDir))) return [];

  const out = [];
  const children = await readdir(absoluteDir, { withFileTypes: true });
  for (const child of children) {
    const childRelative = toPosixPath(join(relativeDir, child.name));
    const childAbsolute = join(sourceRoot, childRelative);
    if (child.isDirectory()) {
      out.push(...(await collectFiles(sourceRoot, childRelative)));
      continue;
    }
    if (child.isFile()) out.push(childAbsolute);
  }
  return out;
}

function normalizeTools(tools = 'all') {
  const raw = Array.isArray(tools) ? tools : String(tools).split(',');
  const normalized = raw.map((tool) => tool.trim().toLowerCase()).filter(Boolean);
  if (normalized.length === 0 || normalized.includes('all')) return ['claude', 'copilot'];
  if (normalized.includes('none')) return [];

  const unknown = normalized.filter((tool) => !Object.hasOwn(TOOL_SCAFFOLD, tool));
  if (unknown.length) {
    throw new Error(`Unknown tool selection: ${unknown.join(', ')}. Use claude, copilot, all, or none.`);
  }
  return [...new Set(normalized)].sort();
}

function scaffoldEntry(sourceRoot, relativePath, transform = null) {
  return {
    sourcePath: join(sourceRoot, relativePath),
    targetRelativePath: toPosixPath(relativePath),
    transform,
  };
}

export async function collectScaffoldEntries({ sourceRoot, tools = 'all' }) {
  const resolvedSourceRoot = resolve(sourceRoot);
  const entries = new Map();

  for (const relativeFile of ALWAYS_FILES) {
    if (await pathExists(join(resolvedSourceRoot, relativeFile))) {
      entries.set(relativeFile, scaffoldEntry(resolvedSourceRoot, relativeFile));
    }
  }

  for (const relativeDir of ALWAYS_DIRS) {
    for (const sourcePath of await collectFiles(resolvedSourceRoot, relativeDir)) {
      const targetRelativePath = toPosixPath(sourcePath.slice(resolvedSourceRoot.length + 1));
      entries.set(targetRelativePath, {
        sourcePath,
        targetRelativePath,
        transform: null,
      });
    }
  }

  for (const tool of normalizeTools(tools)) {
    const scaffold = TOOL_SCAFFOLD[tool];
    for (const relativeFile of scaffold.files) {
      if (await pathExists(join(resolvedSourceRoot, relativeFile))) {
        const transform =
          relativeFile === '.github/copilot-instructions.md' ? 'copilot-initiation-runner' : null;
        entries.set(relativeFile, scaffoldEntry(resolvedSourceRoot, relativeFile, transform));
      }
    }
    for (const relativeDir of scaffold.dirs) {
      for (const sourcePath of await collectFiles(resolvedSourceRoot, relativeDir)) {
        const targetRelativePath = toPosixPath(sourcePath.slice(resolvedSourceRoot.length + 1));
        entries.set(targetRelativePath, {
          sourcePath,
          targetRelativePath,
          transform: null,
        });
      }
    }
  }

  return [...entries.values()].sort((left, right) =>
    left.targetRelativePath.localeCompare(right.targetRelativePath),
  );
}

export function extractCopilotInitiationRunnerBlock(content) {
  const startIndex = content.indexOf(COPILOT_START);
  const endIndex = content.indexOf(COPILOT_END);
  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    throw new Error('Could not find the INITIATION-RUNNER block in .github/copilot-instructions.md.');
  }
  return `${content.slice(startIndex, endIndex + COPILOT_END.length).trimEnd()}\n`;
}

async function renderEntry(entry) {
  const content = await readFile(entry.sourcePath, 'utf8');
  if (entry.transform === 'copilot-initiation-runner') {
    return extractCopilotInitiationRunnerBlock(content);
  }
  return content;
}

async function findConflicts(entries, targetRoot, overwrite) {
  if (overwrite) return [];

  const conflicts = [];
  for (const entry of entries) {
    const targetPath = join(targetRoot, entry.targetRelativePath);
    if (!(await pathExists(targetPath))) continue;

    const currentStat = await stat(targetPath);
    if (currentStat.isDirectory()) {
      conflicts.push(entry.targetRelativePath);
      continue;
    }

    const desired = await renderEntry(entry);
    const current = await readFile(targetPath, 'utf8');
    if (current !== desired) conflicts.push(entry.targetRelativePath);
  }
  return conflicts;
}

async function writeEntries(entries, targetRoot) {
  const written = [];
  for (const entry of entries) {
    const targetPath = join(targetRoot, entry.targetRelativePath);
    await mkdir(dirname(targetPath), { recursive: true });
    await writeFile(targetPath, await renderEntry(entry), 'utf8');
    written.push(entry.targetRelativePath);
  }
  return written;
}

function runGit(targetRoot, args) {
  const result = spawnSync('git', ['-C', targetRoot, ...args], {
    encoding: 'utf8',
    shell: false,
  });
  return {
    ok: result.status === 0,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
    status: result.status,
  };
}

async function ensureGit({ targetRoot, remote, skipGit }) {
  if (skipGit) return [];

  const actions = [];
  const insideWorkTree = runGit(targetRoot, ['rev-parse', '--is-inside-work-tree']);
  if (!insideWorkTree.ok) {
    const init = spawnSync('git', ['init', '-b', 'main', targetRoot], {
      encoding: 'utf8',
      shell: false,
    });
    if (init.status !== 0) {
      const fallback = spawnSync('git', ['init', targetRoot], { encoding: 'utf8', shell: false });
      if (fallback.status !== 0) {
        throw new Error(`git init failed: ${(init.stderr || fallback.stderr).trim()}`);
      }
      const setBranch = runGit(targetRoot, ['symbolic-ref', 'HEAD', 'refs/heads/main']);
      if (!setBranch.ok) throw new Error(`git symbolic-ref HEAD refs/heads/main failed: ${setBranch.stderr}`);
    }
    actions.push('git init -b main');
  }

  if (!remote) return actions;

  const existingOrigin = runGit(targetRoot, ['remote', 'get-url', 'origin']);
  if (existingOrigin.ok) {
    if (existingOrigin.stdout !== remote) {
      throw new Error(
        `origin already points to ${existingOrigin.stdout}. Remove or update it before bootstrapping ${remote}.`,
      );
    }
    actions.push('origin already configured');
    return actions;
  }

  const addOrigin = runGit(targetRoot, ['remote', 'add', 'origin', remote]);
  if (!addOrigin.ok) throw new Error(`git remote add origin failed: ${addOrigin.stderr}`);
  actions.push('git remote add origin');
  return actions;
}

export async function runBootstrap({
  sourceRoot,
  targetRoot,
  tools = 'all',
  apply = false,
  overwrite = false,
  remote = null,
  skipGit = false,
}) {
  if (!sourceRoot) throw new Error('sourceRoot is required.');
  if (!targetRoot) throw new Error('targetRoot is required.');

  const resolvedSourceRoot = resolve(sourceRoot);
  const resolvedTargetRoot = resolve(targetRoot);
  const entries = await collectScaffoldEntries({ sourceRoot: resolvedSourceRoot, tools });
  const conflicts = await findConflicts(entries, resolvedTargetRoot, overwrite);
  if (conflicts.length) {
    throw new Error(
      `Target has conflicting files: ${conflicts.join(', ')}. Re-run with --overwrite only if replacing them is intended.`,
    );
  }

  if (!apply) {
    return {
      mode: 'dry-run',
      sourceRoot: resolvedSourceRoot,
      targetRoot: resolvedTargetRoot,
      entries,
      written: [],
      git: [],
    };
  }

  await mkdir(resolvedTargetRoot, { recursive: true });
  const written = await writeEntries(entries, resolvedTargetRoot);
  const git = await ensureGit({ targetRoot: resolvedTargetRoot, remote, skipGit });

  return {
    mode: 'apply',
    sourceRoot: resolvedSourceRoot,
    targetRoot: resolvedTargetRoot,
    entries,
    written,
    git,
  };
}

function printUsage() {
  console.log(`Usage:
  node scripts/bootstrap-target-repo.mjs --target <path> [options]

Options:
  --target <path>       Target repository or local folder. Required unless passed as the first positional argument.
  --remote <url>        Optional git remote URL to add as origin.
  --tools <list>        all, claude, copilot, none. Default: all.
  --apply               Write files and initialize/connect git. Omit for dry-run.
  --overwrite           Replace conflicting target files. Default: fail on conflicts.
  --skip-git            Copy scaffold only; do not run git init or configure origin.
  --help                Show this help.

Examples:
  node scripts/bootstrap-target-repo.mjs --target ../my-project
  node scripts/bootstrap-target-repo.mjs --target ../my-project --remote https://github.com/org/repo.git --apply
  node scripts/bootstrap-target-repo.mjs ../my-project --tools copilot --apply --skip-git`);
}

function readArgValue(argv, index, name) {
  const value = argv[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`${name} requires a value.`);
  return value;
}

function parseArgs(argv) {
  const options = {
    apply: false,
    overwrite: false,
    skipGit: false,
    tools: 'all',
    remote: null,
    targetRoot: null,
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
    if (arg === '--overwrite') {
      options.overwrite = true;
      continue;
    }
    if (arg === '--skip-git') {
      options.skipGit = true;
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
    if (arg === '--remote') {
      options.remote = readArgValue(argv, index, '--remote');
      index++;
      continue;
    }
    if (arg.startsWith('--remote=')) {
      options.remote = arg.slice('--remote='.length);
      continue;
    }
    if (arg === '--tools') {
      options.tools = readArgValue(argv, index, '--tools');
      index++;
      continue;
    }
    if (arg.startsWith('--tools=')) {
      options.tools = arg.slice('--tools='.length);
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
  const action = result.mode === 'dry-run' ? 'Would copy' : 'Copied';
  console.log(`Mode: ${result.mode}`);
  console.log(`Source: ${result.sourceRoot}`);
  console.log(`Target: ${result.targetRoot}`);
  console.log(`${action} ${result.entries.length} scaffold file(s):`);
  for (const entry of result.entries) {
    console.log(`  - ${entry.targetRelativePath}`);
  }

  if (result.git.length) {
    console.log('\nGit actions:');
    for (const actionText of result.git) console.log(`  - ${actionText}`);
  }

  if (result.mode === 'dry-run') {
    console.log('\nDry-run only. Re-run with --apply to write files.');
    return;
  }

  console.log('\nNext: commit and push the bootstrap scaffold, then complete Step 1 repo governance.');
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printUsage();
    return;
  }
  if (!options.targetRoot) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const result = await runBootstrap({ sourceRoot, ...options });
  printResult(result);
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : null;
if (invokedPath === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  });
}