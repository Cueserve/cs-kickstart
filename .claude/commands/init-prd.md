---
description: "Step 3: generate PRD.md from its initiation guide (Product Owner)"
allowed-tools: Read, Write, Edit, Glob, Bash(git:*), Bash(gh:*), Bash(az:*), Bash(glab:*)
---

# /init-prd — Step 3: Product Requirements Document

You are running **Step 3** of the Project Initiation process. This step produces **`PRD.md`**, owned by the **Product Owner**.

## 1. Preconditions — run these commands before anything else

Do not skip or proceed on assumption. Run each check yourself and act on the result.

1. **Clean working tree** — run `git status --porcelain`.
   - Empty output → proceed.
   - Non-empty → **STOP.** Tell the user: "Uncommitted changes detected — commit or stash before continuing."

2. **Upstream document on `main`** — run `git show main:PRODUCT.md`.
   - Exit 0 → proceed.
   - Non-zero → **STOP.** Tell the user: "PRODUCT.md is not on `main` — Step 2 must be merged before Step 3 can run."

3. **Step 1 gate (machine-validated)** — verify Step 1 preflight evidence in `CONTRIBUTING.md` and re-run host checks from `docs/guides/proj-init/01-repo-setup.md`. If checks fail or evidence is missing/stale, **STOP** and direct the user to Step 1.

## Confirm before proceeding — do not skip

Run the checks above, then present the results to the operator as a checklist and **wait for an explicit "yes" before creating any branch or writing any file.** Never proceed on assumption.

- [ ] You are the **Product Owner** for this step (or acting with their authority).
- [ ] Step 1 gate is in place and machine-validated — required-reviewer policy + branch protection on `main`, with current preflight evidence in `CONTRIBUTING.md`.
- [ ] Approval continuity is defined in `CONTRIBUTING.md` (primary + backup approvers, one-business-day SLA, escalation/delegation path).
- [ ] Upstream is final on `main`: `PRODUCT.md`.
- [ ] Working tree is clean; branching from an up-to-date `main`.
- [ ] Your host's PR/MR CLI (`gh` / `az repos` / `glab`) is available — optional; without it you'll open the change request manually in the host's web UI (see Step 5).

If any item fails, STOP and resolve it before continuing.

## 2. Create the working branch

- From an up-to-date `main`, create and switch to `init/prd`.
- If `init/prd` already exists, do not reuse it silently — ask the user how to proceed.

## 3. Produce the document

- Read the guide and follow it exactly: @docs/guides/proj-init/03-prod-requirements.md
- It derives from `PRODUCT.md` (already on `main`) — read that as the source of truth and expand it into requirements.
- Interview the user for every section the guide requires. Ask one focused question at a time — never assume an answer.
- Write the result to `PRD.md`. The guide is the spec; this command does not restate it.
- Show the draft and revise until the user approves the content.

## 4. Commit

- Commit `PRD.md` to `init/prd` with a Conventional Commit message (e.g. `docs: add PRD.md (Step 3)`).
- Never commit to `main`.

## 5. Open the PR/MR (requires explicit confirmation)

- Per project governance, never push without explicit approval. Ask the user to confirm before pushing.
- On confirmation: push `init/prd` and open a PR/MR targeting `main` via your host's CLI (`gh pr create` / `az repos pr create` / `glab mr create`) — or, if no CLI is available, push the branch and give the user the URL to open the PR/MR in the host's web UI. Title references Step 3; the body summarizes the requirements and includes the reviewer checklist from `docs/guides/proj-init/03-prod-requirements.md`.
- Remind the user: `PRD.md` becomes **final only when the Product Owner approves and merges the PR/MR**. Do not merge it yourself.
