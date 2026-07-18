# Per-command Target Override for doc-update / doc-status — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let `/proj-init-doc-update` and `/proj-init-doc-status` target an explicit clone via `--target <folder>`, bypassing single-slot `state.json`, so post-cleanup and concurrent-project doc maintenance work without re-bootstrapping.

**Architecture:** Pure prose change in the two guide files. Resolution precedence — explicit `--target` arg → `.proj-init/state.json` → error — is written into each guide's "Resolve the target" section, matching how the guides already resolve state. Adapters and README/overview get description/usage sync. `bootstrap-target-repo.mjs` is not touched.

**Tech Stack:** Markdown guides + adapters. No build, no test runner, no `package.json` in this kit. "Verification" for each task = reading the file back and confirming the required strings/rules are present and internally consistent (via Grep/Read), plus a manual git-repo `rev-parse` sanity check where relevant.

## Global Constraints

- **Source of truth is the guide, not the adapter.** All behavior lives in `docs/guides/proj-init/doc-update.md` and `doc-status.md`. Adapters (`.claude/commands/*`, `.github/prompts/*`) stay thin — description/frontmatter only, never workflow logic. (CLAUDE.md: "Put behavior in the guide … Never duplicate workflow rules into an adapter.")
- **`bootstrap-target-repo.mjs` must be byte-for-byte unchanged.** Verify with `git status` at the end.
- **No state is written by the override.** The `--target` path is stateless per-command; it never rewrites `.proj-init/state.json`.
- **Precedence, verbatim, in both guides:** `1. explicit --target arg (validate git repo) → 2. state.json → 3. error + hint`.
- **Git-repo validation command, verbatim:** `git -C "<path>" rev-parse --is-inside-work-tree`.
- **Keep layers in sync** (CLAUDE.md): changing doc-update/doc-status touches the guide, both adapter families, and the README/`_overview.md` descriptions. Update all that apply.
- No changes to initiation Steps 00–09, `_run-step.md`, `_steps.yml`, or templates.

---

### Task 1: Add target override to `doc-update.md`

**Files:**
- Modify: `docs/guides/proj-init/doc-update.md` (the "Resolve the target" section, currently lines 5–7)

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: the canonical precedence + validation prose that Task 2 mirrors for doc-status, and that Tasks 3–5 reference in adapter descriptions. The `--target <folder>` flag name and the "first non-flag token is the doc name" parse rule are established here.

- [ ] **Step 1: Read the current section to anchor the edit**

Run: Read `docs/guides/proj-init/doc-update.md` lines 1–30.
Expected: confirm the "Resolve the target" heading and the "Identify the document" section (`## 1.`) that follows, so the new prose slots between the intro and section 1 without disturbing the doc-name argument handling.

- [ ] **Step 2: Replace the "Resolve the target" section**

Replace the current section (the paragraph beginning "Read `.proj-init/state.json` from this kit root and set `TARGET` …") with:

```markdown
## Resolve the target

This command accepts an **optional explicit target** so it can update documents in a
finished project (after `/proj-init-cleanup`) or in a different project while an
initiation is mid-flight — without re-registering.

**Argument parsing:** the first non-flag token is the document name (e.g. `PRD.md`).
An explicit target is supplied with `--target <folder>`, pointing at an existing local
clone of the target repo.

Resolve `TARGET` in this order:

1. **`--target <folder>` given** → resolve it to an absolute path and validate it is a
   git working tree: `git -C "<path>" rev-parse --is-inside-work-tree`.
   - Exit 0 → set `TARGET` to that path. Note to the user: "Using explicit target
     `<path>` — this overrides any registered initiation workspace."
   - Non-zero → **STOP.** Tell the user: "That path is not a git repository — pass the
     folder of an existing clone of the target repo."
2. **No `--target`** → read `.proj-init/state.json` from this kit root and set `TARGET`
   to its `targetFolder` (the active initiation workspace).
3. **No `--target` and no `state.json`** → **STOP.** Tell the user: "No initiation
   workspace found. Run Step-00 (/proj-init-bootstrap) first, or pass a target:
   `/proj-init-doc-update <DOCNAME> --target <folder>`."

Every git command, host CLI, and file path below is relative to `$TARGET` (run git as
`git -C "$TARGET" …`, host CLIs from within `$TARGET`, and read/write documents under
`$TARGET/`).
```

- [ ] **Step 3: Verify the precedence, validation command, and hint are present**

Run: Grep in `docs/guides/proj-init/doc-update.md` for each of:
- `rev-parse --is-inside-work-tree`
- `overrides any registered initiation workspace`
- `--target <folder>` (in the error hint)

Expected: all three match. Confirms the three-tier precedence, the git validation, and the error hint all landed.

- [ ] **Step 4: Verify no downstream reference to `TARGET` broke**

Run: Grep in `docs/guides/proj-init/doc-update.md` for `\$TARGET` (output_mode count).
Expected: count unchanged from before the edit (the downstream sections still reference `$TARGET`). The edit only replaced the resolution paragraph; sections 1–7 are untouched.

- [ ] **Step 5: Commit**

```bash
git add docs/guides/proj-init/doc-update.md
git commit -m "feat: add --target override to doc-update guide

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Add target override to `doc-status.md`

**Files:**
- Modify: `docs/guides/proj-init/doc-status.md` (the "Resolve the target" section, currently lines 5–7)

**Interfaces:**
- Consumes: the precedence + validation prose pattern established in Task 1. doc-status takes **no document name**, so its only argument is `--target` — the parse is simpler (no doc-name-vs-target collision).
- Produces: nothing later tasks depend on beyond adapter-description alignment (Tasks 4–6).

- [ ] **Step 1: Read the current section to anchor the edit**

Run: Read `docs/guides/proj-init/doc-status.md` lines 1–12.
Expected: confirm the "Resolve the target" heading followed by "## What to check", so the replacement slots cleanly.

- [ ] **Step 2: Replace the "Resolve the target" section**

Replace the current section (the paragraph beginning "Read `.proj-init/state.json` from this kit root and set `TARGET` …") with:

```markdown
## Resolve the target

This command accepts an **optional explicit target** so it can report status for a
finished project (after `/proj-init-cleanup`) or for a different project while an
initiation is mid-flight — without re-registering.

**Argument parsing:** doc-status takes no document name. Its only argument is
`--target <folder>`, pointing at an existing local clone of the target repo.

Resolve `TARGET` in this order:

1. **`--target <folder>` given** → resolve it to an absolute path and validate it is a
   git working tree: `git -C "<path>" rev-parse --is-inside-work-tree`.
   - Exit 0 → set `TARGET` to that path. Note to the user: "Using explicit target
     `<path>` — this overrides any registered initiation workspace."
   - Non-zero → **STOP.** Tell the user: "That path is not a git repository — pass the
     folder of an existing clone of the target repo."
2. **No `--target`** → read `.proj-init/state.json` from this kit root and set `TARGET`
   to its `targetFolder` (the active initiation workspace).
3. **No `--target` and no `state.json`** → **STOP.** Tell the user: "No initiation
   workspace found. Run Step-00 (/proj-init-bootstrap) first, or pass a target:
   `/proj-init-doc-status --target <folder>`."

All git and host-CLI checks below run against `$TARGET`.
```

- [ ] **Step 3: Verify the precedence, validation command, and hint are present**

Run: Grep in `docs/guides/proj-init/doc-status.md` for each of:
- `rev-parse --is-inside-work-tree`
- `overrides any registered initiation workspace`
- `--target <folder>` (in the error hint)

Expected: all three match.

- [ ] **Step 4: Cross-check wording parity with doc-update**

Run: Grep both guides for `overrides any registered initiation workspace`.
Expected: identical sentence in both files — the override note reads the same in status and update, so an operator sees consistent language. (No shared file exists to DRY this into; parity is verified, not deduplicated — this is prose in two guides by design.)

- [ ] **Step 5: Commit**

```bash
git add docs/guides/proj-init/doc-status.md
git commit -m "feat: add --target override to doc-status guide

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: Sync the four thin adapters

**Files:**
- Modify: `.claude/commands/proj-init-doc-update.md` (frontmatter `description`, line 2)
- Modify: `.claude/commands/proj-init-doc-status.md` (frontmatter `description`, line 2)
- Modify: `.github/prompts/proj-init-doc-update.prompt.md` (frontmatter `description`, line 3)
- Modify: `.github/prompts/proj-init-doc-status.prompt.md` (frontmatter `description`, line 3)

**Interfaces:**
- Consumes: the `--target` capability defined in Tasks 1–2. Adapters only *describe* it; they add no logic.
- Produces: nothing.

- [ ] **Step 1: Verify `allowed-tools` already covers git rev-parse**

Run: Read line 2 of `.claude/commands/proj-init-doc-update.md` and `.claude/commands/proj-init-doc-status.md`.
Expected: both `allowed-tools` lines contain `Bash(git:*)`. The `rev-parse` validation needs no new permission. **Do not add tools.** (If — and only if — `Bash(git:*)` is absent, stop and report; do not silently widen permissions.)

- [ ] **Step 2: Update `.claude/commands/proj-init-doc-update.md` description**

In the frontmatter, change:

```yaml
description: "Update any source-of-truth document after initiation — opens a PR through the same review gate that finalized it"
```

to:

```yaml
description: "Update any source-of-truth document after initiation — opens a PR through the same review gate that finalized it. Accepts --target <folder> to update a finished or other project without re-registering."
```

- [ ] **Step 3: Update `.claude/commands/proj-init-doc-status.md` description**

In the frontmatter, change:

```yaml
description: "Show project initiation status — which steps are merged, in progress, or not started"
```

to:

```yaml
description: "Show project initiation status — which steps are merged, in progress, or not started. Accepts --target <folder> to report on a finished or other project without re-registering."
```

- [ ] **Step 4: Update `.github/prompts/proj-init-doc-update.prompt.md` description**

In the frontmatter, change:

```yaml
description: Update any source-of-truth document after initiation through the same review gate that finalized it
```

to:

```yaml
description: Update any source-of-truth document after initiation through the same review gate that finalized it. Accepts --target <folder> to update a finished or other project without re-registering.
```

- [ ] **Step 5: Update `.github/prompts/proj-init-doc-status.prompt.md` description**

In the frontmatter, change:

```yaml
description: Show project initiation status - which steps are merged, in progress, or not started
```

to:

```yaml
description: Show project initiation status - which steps are merged, in progress, or not started. Accepts --target <folder> to report on a finished or other project without re-registering.
```

- [ ] **Step 6: Verify adapters carry no logic**

Run: Grep across the four adapter files for `rev-parse` and `state.json`.
Expected: **zero matches.** The resolution logic must live only in the guides, not leak into adapters.

- [ ] **Step 7: Commit**

```bash
git add .claude/commands/proj-init-doc-update.md .claude/commands/proj-init-doc-status.md .github/prompts/proj-init-doc-update.prompt.md .github/prompts/proj-init-doc-status.prompt.md
git commit -m "docs: note --target override in doc-update/doc-status adapters

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: Sync README, `_overview.md`, and `cleanup.md`

**Files:**
- Modify: `README.md` (line 105 — the doc-update paragraph)
- Modify: `docs/guides/proj-init/_overview.md` (line 97 — "Keeping docs current" intro)
- Modify: `docs/guides/proj-init/cleanup.md` (closing content, around line 34/40)

**Interfaces:**
- Consumes: the `--target` capability from Tasks 1–2.
- Produces: user-facing documentation of the override; closes the motivating gap (post-cleanup doc maintenance).

- [ ] **Step 1: Update README doc-update paragraph**

In `README.md` at line 105, append to the existing paragraph (after "…for when to update which doc."):

```markdown
 To update a document in a project that has already finished initiation (or a different project while another initiation is active), pass an explicit clone: `/proj-init-doc-update <docname> --target <folder>` — no re-registration needed. `/proj-init-doc-status --target <folder>` works the same way.
```

- [ ] **Step 2: Update `_overview.md` "Keeping docs current"**

In `docs/guides/proj-init/_overview.md` at line 97, append to the paragraph that begins "After initiation, run `/proj-init-doc-update <docname>` …":

```markdown
 After `/proj-init-cleanup` — or to reach a different project mid-initiation — pass an explicit clone with `--target <folder>` (`/proj-init-doc-update <docname> --target <folder>`, `/proj-init-doc-status --target <folder>`); the command targets that clone directly, bypassing the registered workspace.
```

- [ ] **Step 3: Update `cleanup.md` closing note**

Read `docs/guides/proj-init/cleanup.md` lines 34–41. After the final rule ("After cleanup, running any `/proj-init-*` step will stop until Step-00 registers a workspace again."), add:

```markdown
- Post-cleanup document maintenance does **not** require re-registering: run
  `/proj-init-doc-update <docname> --target <target-folder>` or
  `/proj-init-doc-status --target <target-folder>` against the clone that remains on
  disk. Only the initiation steps (01–09) need a registered workspace.
```

- [ ] **Step 4: Verify all three references present**

Run: Grep for `--target` across `README.md`, `docs/guides/proj-init/_overview.md`, and `docs/guides/proj-init/cleanup.md`.
Expected: at least one match in each file.

- [ ] **Step 5: Commit**

```bash
git add README.md docs/guides/proj-init/_overview.md docs/guides/proj-init/cleanup.md
git commit -m "docs: document --target override in README, overview, and cleanup

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 5: End-to-end verification against a real clone

**Files:**
- None modified. This task proves the acceptance criteria.

**Interfaces:**
- Consumes: everything from Tasks 1–4.
- Produces: evidence the override works and the script is untouched.

- [ ] **Step 1: Confirm the script is byte-for-byte unchanged**

Run: `git -C d:/repo-cs/cs-kickstart status --porcelain scripts/bootstrap-target-repo.mjs`
Expected: empty output — `bootstrap-target-repo.mjs` was not modified.

- [ ] **Step 2: Confirm state is currently clear (the motivating condition)**

Run: `git -C d:/repo-cs/cs-kickstart status --porcelain .proj-init/ ; ls d:/repo-cs/cs-kickstart/.proj-init/state.json 2>/dev/null || echo "no state — good"`
Expected: `no state — good`. This is the exact post-cleanup condition the feature must survive.

- [ ] **Step 3: Prove the target clone is a valid git repo (the validation the guide runs)**

Run: `git -C "D:/repo-cuevik/CuevikSync" rev-parse --is-inside-work-tree`
Expected: `true`. If the clone no longer exists on disk, substitute any local clone path — the point is to confirm the validation command the guide specifies actually returns `true` for a real clone and would reject a non-repo folder.

- [ ] **Step 4: Prove the negative case (validation rejects a non-repo)**

Run: `git -C "$(mktemp -d)" rev-parse --is-inside-work-tree 2>&1; echo "exit: $?"`
Expected: non-zero exit with "not a git repository" — confirms the guide's STOP branch triggers for a non-clone path.

- [ ] **Step 5: Read both guides back and confirm precedence is executable as written**

Run: Read the "Resolve the target" section of both `doc-update.md` and `doc-status.md`.
Expected: an operator can follow steps 1→2→3 unambiguously; the doc-name-vs-`--target` parse rule is explicit in doc-update; both name `git -C "<path>" rev-parse --is-inside-work-tree` and both give the `--target` hint in the error.

- [ ] **Step 6: Final commit (plan completion marker, if any tracking files changed)**

If nothing changed in this task (verification only), no commit. Otherwise:

```bash
git add -A
git commit -m "chore: verification notes for --target override

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage** — every spec scope item maps to a task:
- doc-update.md "Resolve the target" → Task 1.
- doc-status.md "Resolve the target" → Task 2.
- Four adapters (description only) + `allowed-tools` check → Task 3.
- README + `_overview.md` + cleanup.md sync → Task 4 (spec named README and cleanup.md; `_overview.md` added because README line 105 links to it and it also describes doc-update — a keep-in-sync obligation).
- Acceptance criteria (state cleared, concurrent init, no-arg fallback, non-git rejection, script unchanged) → Task 5.

**Placeholder scan** — no TBD/TODO; every prose block is complete replacement text, every command is concrete, every expected output stated.

**Type/name consistency** — the flag is `--target <folder>` in every task; the validation command `git -C "<path>" rev-parse --is-inside-work-tree` is identical across Tasks 1, 2, and 5; the override note sentence "overrides any registered initiation workspace" is identical in Tasks 1 and 2 and verified in Task 2 Step 4. The precedence order (arg → state → error) is stated identically in both guides.

**Note on testing model:** this kit has no test runner (no `package.json`). Tasks verify via Grep/Read and real `git rev-parse` invocations rather than unit tests — the honest verification surface for a prose-and-config change.
