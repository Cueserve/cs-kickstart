---
description: "Step 8: derive epics/stories from PRD.md and seed the host issue tracker (Product Owner)"
allowed-tools: Read, Write, Edit, Glob, Bash(git:*), Bash(gh:*), Bash(az:*), Bash(glab:*)
---

# /init-backlog — Step 8: Initial Backlog

You are running **Step 8**, the final step of the Project Initiation process. This step derives epics and stories from `PRD.md` and `PRODUCT.md`, creates them as work items in the host issue tracker, and produces **`BACKLOG.md`** as the manifest and audit trail. Owned by the **Product Owner**.

## 1. Preconditions — run these commands before anything else

Do not skip or proceed on assumption. Run each check yourself and act on the result.

1. **Clean working tree** — run `git status --porcelain`.
   - Empty output → proceed.
   - Non-empty → **STOP.** Tell the user: "Uncommitted changes detected — commit or stash before continuing."

2. **All upstream documents on `main`** — run each; all must pass:
   - `git show main:PRODUCT.md` — non-zero → **STOP.** "PRODUCT.md not on `main` — Step 2 must be merged."
   - `git show main:PRD.md` — non-zero → **STOP.** "PRD.md not on `main` — Step 3 must be merged."
   - `git show main:ARCHITECTURE.md` — non-zero → **STOP.** "ARCHITECTURE.md not on `main` — Step 4 must be merged."
   - `git show main:TECH-STACK.md` — non-zero → **STOP.** "TECH-STACK.md not on `main` — Step 5 must be merged."
   - `git show main:AI-TOOL-GUIDE.md` — non-zero → **STOP.** "AI-TOOL-GUIDE.md not on `main` — Step 6 must be merged."
   - `git show main:README.md` — non-zero → **STOP.** "README.md not on `main` — Step 7 must be merged."

3. **Step 1 gate (machine-validated)** — verify Step 1 preflight evidence in `CONTRIBUTING.md` and re-run host checks from `docs/guides/proj-init/01-repo-setup.md`. If checks fail or evidence is missing/stale, **STOP** and direct the user to Step 1.

4. **Host CLI availability** — detect which host CLI is available:
   - Run `gh auth status` — if it succeeds, this is a GitHub repo; use `gh issue create` for all item creation.
   - Run `az devops project show 2>$null` — if it succeeds, this is an ADO repo; use `az boards work-item create`.
   - If neither CLI is available, note that all items will be recorded as `PENDING` in `BACKLOG.md` and the user must create them manually.

## Confirm before proceeding — do not skip

Run the checks above, then present the results to the operator as a checklist and **wait for an explicit "yes" before creating any branch, writing any file, or creating any work items.** Never proceed on assumption.

- [ ] You are the **Product Owner** for this step (or acting with their authority).
- [ ] Step 1 gate is in place and machine-validated — required-reviewer policy + branch protection on `main`, with current preflight evidence in `CONTRIBUTING.md`.
- [ ] Approval continuity is defined in `CONTRIBUTING.md` (primary + backup approvers, one-business-day SLA, escalation/delegation path).
- [ ] Upstream is final on `main`: `PRODUCT.md`, `PRD.md`, `ARCHITECTURE.md`, `TECH-STACK.md`, `AI-TOOL-GUIDE.md`, `README.md`.
- [ ] Working tree is clean; branching from an up-to-date `main`.
- [ ] Host CLI status is known (GitHub `gh` / ADO `az boards` / `PENDING` — manual creation required).

If any item fails, STOP and resolve it before continuing.

## 2. Create the working branch

- From an up-to-date `main`, create and switch to `init/backlog`.
- If `init/backlog` already exists, do not reuse it silently — ask the user how to proceed.

## 3. Produce the backlog

Read the guide and follow it exactly: @docs/guides/proj-init/08-backlog.md

**Phase A — Derive the item list (no host writes yet)**

1. Read `PRODUCT.md` and `PRD.md` from `main`.
2. Identify epics: one per major product goal or feature area from `PRODUCT.md`. Map each epic to the PRD features it covers.
3. Under each epic, derive stories: one per PRD requirement. Each story must cite the PRD requirement ID(s) it fulfills and carry the MoSCoW priority from the PRD.
4. Present the full derived list — epics and stories under them — to the user and **wait for explicit approval**. Revise until approved. Do not touch the host or write any files until the list is approved.

**Phase B — Create work items in the host (after user approves the list)**

For each epic and then each story beneath it, create the work item in the host:

- **GitHub (`gh`):**
  - Epic: `gh issue create --title "[Epic] <title>" --body "<description>" --label "epic,priority:must"` (adjust priority label per item)
  - Story: `gh issue create --title "<title>" --body "<description and acceptance criteria>" --label "story,priority:must"` (adjust per item)
  - Capture the returned issue URL and extract the issue number.
- **ADO (`az boards`):**
  - Epic: `az boards work-item create --type "Epic" --title "<title>" --description "<description>"`
  - Story: `az boards work-item create --type "User Story" --title "<title>" --description "<description and acceptance criteria>"`
  - Capture the returned work item ID.
- **PENDING (no CLI available):** Record with `PENDING` as the ID and add a note in `BACKLOG.md` instructing the user to create manually.

Do not batch-create. Create one item at a time and verify the returned ID before moving to the next.

**Phase C — Write `BACKLOG.md`**

Write `BACKLOG.md` as a manifest using this structure:

```markdown
# Backlog

_Generated: <date>. Host: GitHub Issues | Azure DevOps | PENDING (manual creation required)._

## <Epic title> · #<host-id>

**PRD features covered:** <PRD feature IDs>
**Priority:** Must | Should | Could

### <Story title> · #<host-id>

- **PRD requirement:** <PRD-ID>
- **Priority:** Must | Should | Could
- **Acceptance criteria:**
  - <criterion copied from PRD>

---

## Out of scope (initial backlog)

| PRD item | Reason excluded |
|----------|----------------|
| PRD-XXX  | <reason>        |
```

Show the draft and revise until the user approves.

## 4. Commit

- Commit `BACKLOG.md` to `init/backlog` with a Conventional Commit message (e.g. `docs: add BACKLOG.md — Step 8 initial backlog`).
- Never commit to `main`.

## 5. Open the PR/MR (requires explicit confirmation)

- Per project governance, never push without explicit approval. Ask the user to confirm before pushing.
- On confirmation: push `init/backlog` and open a PR/MR targeting `main` via your host's CLI (`gh pr create` / `az repos pr create` / `glab mr create`) — or, if no CLI is available, push the branch and give the user the URL to open the PR/MR in the host's web UI. Title references Step 8; the body states the epic count, story count, priority breakdown, and includes the reviewer checklist from `docs/guides/proj-init/08-backlog.md`.
- Remind the user: `BACKLOG.md` becomes **final only when the Product Owner approves and merges the PR/MR**. Once merged, initiation is complete and the team can begin sprint planning.
