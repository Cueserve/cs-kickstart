---
description: "Step 4: generate TECH-STACK.md + CONTRIBUTING.md tooling layer (Architect)"
allowed-tools: Read, Write, Edit, Glob, Bash(git:*), Bash(gh:*), Bash(az:*), Bash(glab:*)
---

# /init-techstack — Step 4: Tech Stack

You are running **Step 4** of the Project Initiation process. This step produces **`TECH-STACK.md`** and tops up **`CONTRIBUTING.md`** with the tooling layer. Owned by the **Architect**.

## 1. Preconditions — run these commands before anything else

Do not skip or proceed on assumption. Run each check yourself and act on the result.

1. **Clean working tree** — run `git status --porcelain`.
   - Empty output → proceed.
   - Non-empty → **STOP.** Tell the user: "Uncommitted changes detected — commit or stash before continuing."

2. **Upstream documents on `main`** — run both; both must pass:
   - `git show main:PRD.md` — non-zero → **STOP.** Tell the user: "PRD.md is not on `main` — Step 2 must be merged before Step 4 can run."
   - `git show main:ARCHITECTURE.md` — non-zero → **STOP.** Tell the user: "ARCHITECTURE.md is not on `main` — Step 3 must be merged before Step 4 can run."

3. **Step 0 gate** — confirm the host's required-reviewer policy and branch protection are in place (see `docs/guides/proj-init/00-repo-setup.md`). If not, **STOP** and direct the user to Step 0.

## Confirm before proceeding — do not skip

Run the checks above, then present the results to the operator as a checklist and **wait for an explicit "yes" before creating any branch or writing any file.** Never proceed on assumption.

- [ ] You are the **Architect** for this step (or acting with their authority).
- [ ] Step 0 gate is in place — required-reviewer policy + branch protection on `main` (per `00-repo-setup.md`).
- [ ] Upstream is final on `main`: `PRD.md` and `ARCHITECTURE.md`.
- [ ] Working tree is clean; branching from an up-to-date `main`.
- [ ] Your host's PR/MR CLI (`gh` / `az repos` / `glab`) is available — optional; without it you'll open the change request manually in the host's web UI (see Step 5).

If any item fails, STOP and resolve it before continuing.

## 2. Create the working branch

- From an up-to-date `main`, create and switch to `init/techstack`.
- If `init/techstack` already exists, do not reuse it silently — ask the user how to proceed.

## 3. Produce the documents

- Read the guide and follow it exactly: @docs/guides/proj-init/04-tech-stack.md
- It derives from `PRD.md` and `ARCHITECTURE.md` (already on `main`) — read both as the source of truth.
- Interview the user for every section the guide requires. Ask one focused question at a time — never assume an answer.
- Write the result to `TECH-STACK.md`. The guide is the spec; this command does not restate it.
- **Then top up `CONTRIBUTING.md`** with the tooling layer the guide describes (install/run/test/lint/build commands, hooks, runtime versions) — using only technologies now approved in `TECH-STACK.md`. The governance layer already exists from Step 0; append, do not overwrite it.
- Show both drafts and revise until the user approves the content.

## 4. Commit

- Commit `TECH-STACK.md` and the `CONTRIBUTING.md` changes to `init/techstack` with a Conventional Commit message (e.g. `docs: add TECH-STACK.md and CONTRIBUTING tooling layer (Step 4)`).
- Never commit to `main`.

## 5. Open the PR/MR (requires explicit confirmation)

- Per project governance, never push without explicit approval. Ask the user to confirm before pushing.
- On confirmation: push `init/techstack` and open a PR/MR targeting `main` via your host's CLI (`gh pr create` / `az repos pr create` / `glab mr create`) — or, if no CLI is available, push the branch and give the user the URL to open the PR/MR in the host's web UI. Title references Step 4; the body summarizes the stack choices, the tooling commands added, and includes the reviewer checklist from `docs/guides/proj-init/04-tech-stack.md`.
- Remind the user: these documents become **final only when the Architect approves and merges the PR/MR**. Do not merge it yourself.
