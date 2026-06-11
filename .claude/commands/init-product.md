---
description: "Step 1: generate PRODUCT.md from its initiation guide (Product Owner)"
allowed-tools: Read, Write, Edit, Glob, Bash(git:*), Bash(gh:*), Bash(az:*), Bash(glab:*)
---

# /init-product — Step 1: Product Concept

You are running **Step 1** of the Project Initiation process. This step produces **`PRODUCT.md`**, owned by the **Product Owner**.

## 1. Preconditions — run these commands before anything else

Do not skip or proceed on assumption. Run each check yourself and act on the result.

1. **Clean working tree** — run `git status --porcelain`.
   - Empty output → proceed.
   - Non-empty → **STOP.** Tell the user: "Uncommitted changes detected — commit or stash before continuing."

2. **No upstream document required** — Step 1 is the starting point; nothing precedes it.

3. **Step 0 gate** — confirm the host's required-reviewer policy and branch protection are in place (see `docs/guides/proj-init/00-repo-setup.md`). If not, **STOP** and direct the user to Step 0.

## Confirm before proceeding — do not skip

Run the checks above, then present the results to the operator as a checklist and **wait for an explicit "yes" before creating any branch or writing any file.** Never proceed on assumption.

- [ ] You are the **Product Owner** for this step (or acting with their authority).
- [ ] Step 0 gate is in place — required-reviewer policy + branch protection on `main` (per `00-repo-setup.md`).
- [ ] Upstream is final on `main`: none — Step 1 is the starting point.
- [ ] Working tree is clean; branching from an up-to-date `main`.
- [ ] Your host's PR/MR CLI (`gh` / `az repos` / `glab`) is available — optional; without it you'll open the change request manually in the host's web UI (see Step 5).

If any item fails, STOP and resolve it before continuing.

## 2. Create the working branch

- From an up-to-date `main`, create and switch to `init/product`.
- If `init/product` already exists, do not reuse it silently — ask the user how to proceed.

## 3. Produce the document

- Read the guide and follow it exactly: @docs/guides/proj-init/01-prod-concept.md
- Interview the user for every section the guide requires. Ask one focused question at a time — never assume an answer.
- Write the result to `PRODUCT.md`. The guide is the spec; this command does not restate it.
- Show the draft and revise until the user approves the content.

## 4. Commit

- Commit `PRODUCT.md` to `init/product` with a Conventional Commit message (e.g. `docs: add PRODUCT.md (Step 1)`).
- Never commit to `main`.

## 5. Open the PR/MR (requires explicit confirmation)

- Per project governance, never push without explicit approval. Ask the user to confirm before pushing.
- On confirmation: push `init/product` and open a PR/MR targeting `main` via your host's CLI (`gh pr create` / `az repos pr create` / `glab mr create`) — or, if no CLI is available, push the branch and give the user the URL to open the PR/MR in the host's web UI. Title references Step 1; the body summarizes the product concept decisions and includes the reviewer checklist from `docs/guides/proj-init/01-prod-concept.md`.
- Remind the user: `PRODUCT.md` becomes **final only when the Product Owner approves and merges the PR/MR**. Do not merge it yourself.
