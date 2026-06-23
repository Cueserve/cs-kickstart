# Step 0: Bootstrap Target Repository

**Output:** Project Initiation scaffold copied into a target repository or local folder
**Depends on:** nothing — this runs before Step 1
**Required before:** Step 1 (Repo Setup) when starting from a blank or existing target repository

---

## Goal

Install the reusable Project Initiation machinery into the real project repository without creating product code or stack-specific structure.

## Objective

This step turns this starter kit into a usable scaffold inside the target repo. It copies the shared guides, templates, AI adapters, role files, starter README, and drift-check script, then optionally initializes git and connects an `origin` remote.

The output is a bootstrap baseline that can be committed to `main`. Step 1 then sets up governance before any source-of-truth project document is created.

## What This Step Copies

The bootstrap script copies only reusable initiation assets:

- `README.md`
- `docs/guides/proj-init/**`
- `scripts/check-template-drift.mjs`
- `.claude/roles/*.md` — shared Product Owner / Solution Architect role context the runner loads, regardless of selected tool
- `.claude/commands/proj-init-*.md` when Claude Code support is selected
- `.github/prompts/proj-init-*.prompt.md` when GitHub Copilot support is selected
- `.github/copilot-instructions.md` when GitHub Copilot support is selected, trimmed to the `INITIATION-RUNNER` block only

It does not copy kit-maintenance or local analysis files:

- root `CLAUDE.md`
- `scripts/bootstrap-target-repo.mjs` — kit-only; the target repo never re-bootstraps itself
- `.claude/skills/**`
- `graphify-out/**`
- `src/index.ts`
- `.venv`, caches, local runtime files, or product implementation structure

## Operator Questions

Ask these before running the script:

1. Target path — where should the project be bootstrapped?
2. Git remote URL — should `origin` be configured now, or should this remain a local folder for the moment?
3. AI tools — Claude Code, GitHub Copilot, both, or neither?
4. Existing files — if the target path already contains matching scaffold files, should the script fail or overwrite them?

Do not ask product, architecture, stack, or backlog questions in Step 0. Those belong to later steps.

## How to Run

Always run a dry-run first:

```text
node scripts/bootstrap-target-repo.mjs --target <target-path> --tools <all|claude|copilot|none>
```

Review the file list. If it is correct, apply it:

```text
node scripts/bootstrap-target-repo.mjs --target <target-path> --tools <all|claude|copilot|none> --apply
```

To connect a remote while applying:

```text
node scripts/bootstrap-target-repo.mjs --target <target-path> --remote <repo-url> --tools <all|claude|copilot|none> --apply
```

To copy files without running `git init` or configuring `origin`:

```text
node scripts/bootstrap-target-repo.mjs --target <target-path> --tools <all|claude|copilot|none> --apply --skip-git
```

To replace existing conflicting scaffold files intentionally:

```text
node scripts/bootstrap-target-repo.mjs --target <target-path> --tools <all|claude|copilot|none> --apply --overwrite
```

## After the Script Runs

In the target repository:

1. Review the copied scaffold files.
2. Run the template drift check:

   ```text
   node scripts/check-template-drift.mjs
   ```

3. Commit the bootstrap baseline to `main`:

   ```text
   git add .
   git commit -m "chore: bootstrap project initiation"
   ```

4. Push the baseline if a remote is configured:

   ```text
   git push -u origin main
   ```

5. Start Step 1: `docs/guides/proj-init/01-repo-setup.md`.

## Rules

- Step 0 is optional only when the target repository was created directly from this starter kit and already contains the scaffold.
- Step 0 must not create application source folders, install dependencies, choose a framework, or add stack-specific commands.
- Step 0 must not create `PRODUCT.md`, `PRD.md`, `ARCHITECTURE.md`, `TECH-STACK.md`, `AI-TOOL-GUIDE.md`, project `README.md`, or `BACKLOG.md`.
- Step 0 must not push without the operator explicitly choosing to do so after reviewing the copied scaffold.
- If conflicts exist in the target repository, stop unless the operator explicitly chooses `--overwrite`.
- After Step 0, Step 1 is still required. Branch protection and the approval gate must exist before Step 2 creates `PRODUCT.md`.

## Verification Checklist

Before calling Step 0 complete, verify:

- [ ] Dry-run output was reviewed before `--apply`.
- [ ] Only reusable initiation scaffold files were copied.
- [ ] No kit-maintenance files or local analysis outputs were copied.
- [ ] Git was initialized or intentionally skipped.
- [ ] `origin` was configured only if a remote URL was provided.
- [ ] `node scripts/check-template-drift.mjs` passes in the target repository.
- [ ] The bootstrap baseline is committed to `main` before Step 1 begins.
