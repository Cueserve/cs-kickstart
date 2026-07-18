# Design: per-command target override for doc-update / doc-status

**Date:** 2026-07-18
**Status:** Approved — ready for implementation plan

## Problem

`/proj-init-doc-update` and `/proj-init-doc-status` resolve their target repository
*only* from `.proj-init/state.json`. Two consequences:

1. After `/proj-init-cleanup` unregisters a finished project, both commands halt
   with "No initiation workspace found" — even though doc-update is explicitly a
   *post-initiation* command ("Use this any time reality diverges from one of the
   initiation documents"). Documents diverge after cleanup; that is the normal case.
2. `state.json` is single-slot. You cannot run doc-update/doc-status against an
   already-initiated project while a *different* project's initiation is mid-flight.

The current flow forces a full re-`bootstrap` (re-clone) just to fix a typo in an
already-merged document. That is backwards.

## Decision

Give `doc-update` and `doc-status` an **explicit per-command target** that bypasses
state entirely. Resolution precedence:

```
1. explicit target argument  (validate it is a git repo, then use it)
2. .proj-init/state.json      (current behavior — the active initiation workspace)
3. error                      (current "run Step-00" message, plus a --target hint)
```

An explicit target **overrides** any registered workspace with no prompt. The
single-slot initiation model (state.json, Steps 00–09, `_run-step.md`) is untouched.
This is a stateless, per-command override — nothing is written to state.

### Rejected alternatives

- **Multi-workspace registry** (list + active pointer): more machinery than the
  workflow needs; touches every guide. YAGNI.
- **Separate post-init state file**: a second registry to keep in sync. YAGNI.
- **Reattach-into-state** (`--reattach` flag rewriting state.json): the override is
  stateless; no state rewrite is needed for the target use case.

## Implementation style: prose, not script

Resolution + validation logic lives in the **guide prose**, matching how the guides
resolve state today ("Read `.proj-init/state.json` … set `TARGET`"). No new script
subcommand. The git-repo validation is a single `git rev-parse` line — not enough
logic to justify a `--resolve` subcommand in `bootstrap-target-repo.mjs` and the
coupling it would create.

`bootstrap-target-repo.mjs` is **not modified**. `runBootstrap` stays clone-only;
the single-slot registration model is unchanged.

## Scope — files to change

### 1. `docs/guides/proj-init/doc-update.md` — "Resolve the target" section

Replace the current state-only resolution with the precedence block:

- **Accept an optional target argument** (a local folder path to an existing clone).
  The command already takes a doc name (`PRD.md`); the target is a *second* token.
  Specify parse order explicitly so the doc name and the target do not collide —
  e.g. the first non-flag token is the doc name, `--target <folder>` supplies the
  target.
- **Precedence:**
  1. Target arg present → resolve to an absolute path and **validate it is a git
     working tree** (`git -C "<path>" rev-parse --is-inside-work-tree`). On success
     set `TARGET` and note: "using explicit target — overrides any registered
     workspace." On failure STOP: "That path is not a git repository — pass the
     folder of an existing clone."
  2. No arg → read `.proj-init/state.json` and set `TARGET` (current behavior).
  3. Neither → current error, **plus** the hint: "or pass a target:
     `/proj-init-doc-update <DOCNAME> --target <folder>`."

All downstream git/host-CLI/file operations continue to run against `$TARGET`
exactly as today.

### 2. `docs/guides/proj-init/doc-status.md` — same "Resolve the target" change

doc-status takes no doc name, so its only argument is the target — simpler parse.
Same three-tier precedence and git-repo validation.

### 3. Adapters (thin — description only, no logic)

Kit rule: adapters carry no logic. These already just load the guide. Only the
frontmatter `description` changes to mention the optional target; verify (do not
expand) that `allowed-tools` already covers the work — `Bash(git:*)` is present in
both Claude commands, which covers the `rev-parse` validation.

- `.claude/commands/proj-init-doc-update.md`
- `.claude/commands/proj-init-doc-status.md`
- `.github/prompts/proj-init-doc-update.prompt.md`
- `.github/prompts/proj-init-doc-status.prompt.md`

### 4. Docs sync (CLAUDE.md "keep layers in sync")

- `README.md` — where doc-update/doc-status are described, note post-init / override
  usage with `--target`.
- `docs/guides/proj-init/cleanup.md` — its closing line already points at
  `/proj-init-doc-update <docname>` for divergence after cleanup. Add that this now
  works via `--target <folder>` **without re-bootstrapping**. This closes the exact
  gap that motivated the change.

## Explicitly out of scope

- No multi-workspace registry, active pointer, or second state file.
- No change to initiation Steps 00–09, `_run-step.md`, `_steps.yml`, or templates.
- No modification to `bootstrap-target-repo.mjs`.
- No reattach-into-state / state rewrite.

## Acceptance criteria

- With state cleared, `/proj-init-doc-status --target D:/repo-cuevik/CuevikSync`
  renders the status table against that clone.
- With state cleared, `/proj-init-doc-update PRD.md --target <folder>` runs the full
  update workflow against that clone.
- With a *different* initiation active in state.json, both commands still target the
  explicit `--target` folder, not the registered one.
- With no arg and no state, both commands print the existing error **plus** the
  `--target` hint.
- Passing `--target` at a non-git folder stops with the git-repo error.
- Omitting `--target` while an initiation is registered behaves exactly as today.
- `bootstrap-target-repo.mjs` is byte-for-byte unchanged.
