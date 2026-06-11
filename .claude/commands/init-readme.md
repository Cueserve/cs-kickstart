---
description: "Step 6: generate README.md, replacing the boilerplate entry point (Architect)"
allowed-tools: Read, Write, Edit, Glob, Bash(git:*), Bash(gh:*), Bash(az:*), Bash(glab:*)
---

# /init-readme — Step 6: README

You are running **Step 6**, the final step of the Project Initiation process. This step produces the project's **`README.md`**, **replacing the boilerplate template README**. Owned by the **Architect**.

## 1. Preconditions — run these commands before anything else

Do not skip or proceed on assumption. Run each check yourself and act on the result.

1. **Clean working tree** — run `git status --porcelain`.
   - Empty output → proceed.
   - Non-empty → **STOP.** Tell the user: "Uncommitted changes detected — commit or stash before continuing."

2. **All upstream documents on `main`** — run each; all must pass:
   - `git show main:PRODUCT.md` — non-zero → **STOP.** "PRODUCT.md not on `main` — Step 1 must be merged."
   - `git show main:PRD.md` — non-zero → **STOP.** "PRD.md not on `main` — Step 2 must be merged."
   - `git show main:ARCHITECTURE.md` — non-zero → **STOP.** "ARCHITECTURE.md not on `main` — Step 3 must be merged."
   - `git show main:TECH-STACK.md` — non-zero → **STOP.** "TECH-STACK.md not on `main` — Step 4 must be merged."
   - `git show main:AI-TOOL-GUIDE.md` — non-zero → **STOP.** "AI-TOOL-GUIDE.md not on `main` — Step 5 must be merged."

3. **Step 0 gate** — confirm the host's required-reviewer policy and branch protection are in place (see `docs/guides/proj-init/00-repo-setup.md`). If not, **STOP** and direct the user to Step 0.

## Confirm before proceeding — do not skip

Run the checks above, then present the results to the operator as a checklist and **wait for an explicit "yes" before creating any branch or writing any file.** Never proceed on assumption.

- [ ] You are the **Architect** for this step (or acting with their authority).
- [ ] Step 0 gate is in place — required-reviewer policy + branch protection on `main` (per `00-repo-setup.md`).
- [ ] Upstream is final on `main`: `PRODUCT.md`, `PRD.md`, `ARCHITECTURE.md`, `TECH-STACK.md`, `AI-TOOL-GUIDE.md`.
- [ ] Working tree is clean; branching from an up-to-date `main`.
- [ ] Your host's PR/MR CLI (`gh` / `az repos` / `glab`) is available — optional; without it you'll open the change request manually in the host's web UI (see Step 5).

If any item fails, STOP and resolve it before continuing.

## 2. Create the working branch

- From an up-to-date `main`, create and switch to `init/readme`.
- If `init/readme` already exists, do not reuse it silently — ask the user how to proceed.

## 3. Produce the document

- Read the guide and follow it exactly: @docs/guides/proj-init/06-readme.md
- It summarizes everything locked in Steps 1–5 — read those documents (on `main`) as the source of truth. Do not duplicate `ARCHITECTURE.md`/`TECH-STACK.md`; link to them.
- **This replaces the current boilerplate `README.md`.** Remove the "Start Here" initiation callout and all boilerplate scaffold content — by this step, initiation is complete and the entry point is the project itself. The guides in `docs/guides/proj-init/` remain untouched as the durable reference.
- Every command you put in the README must be real and working — test before committing.
- Show the draft and revise until the user approves the content.

## 4. Commit

- Commit the new `README.md` to `init/readme` with a Conventional Commit message (e.g. `docs: replace boilerplate README with project README (Step 6)`).
- Never commit to `main`.

## 5. Open the PR/MR (requires explicit confirmation)

- Per project governance, never push without explicit approval. Ask the user to confirm before pushing.
- On confirmation: push `init/readme` and open a PR/MR targeting `main` via your host's CLI (`gh pr create` / `az repos pr create` / `glab mr create`) — or, if no CLI is available, push the branch and give the user the URL to open the PR/MR in the host's web UI. Title references Step 6; the body notes that the boilerplate README is replaced and includes the reviewer checklist from `docs/guides/proj-init/06-readme.md`.
- Remind the user: the README becomes **final only when the Architect approves and merges the PR/MR**. Once merged, initiation is complete and development can begin.
