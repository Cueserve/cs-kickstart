---
description: "Step 5: generate AI-TOOL-GUIDE.md + tool adapter files (Architect)"
allowed-tools: Read, Write, Edit, Glob, Bash(git:*), Bash(gh:*), Bash(az:*), Bash(glab:*)
---

# /init-aitools — Step 5: AI Tool Guide

You are running **Step 5** of the Project Initiation process. This step produces **`AI-TOOL-GUIDE.md`** plus its tool adapter files. Owned by the **Architect**.

## 1. Preconditions — run these commands before anything else

Do not skip or proceed on assumption. Run each check yourself and act on the result.

1. **Clean working tree** — run `git status --porcelain`.
   - Empty output → proceed.
   - Non-empty → **STOP.** Tell the user: "Uncommitted changes detected — commit or stash before continuing."

2. **Upstream document on `main`** — run `git show main:TECH-STACK.md`.
   - Exit 0 → proceed.
   - Non-zero → **STOP.** Tell the user: "TECH-STACK.md is not on `main` — Step 4 must be merged before Step 5 can run."

3. **Step 0 gate** — confirm the host's required-reviewer policy and branch protection are in place (see `docs/guides/proj-init/00-repo-setup.md`). If not, **STOP** and direct the user to Step 0.

## Confirm before proceeding — do not skip

Run the checks above, then present the results to the operator as a checklist and **wait for an explicit "yes" before creating any branch or writing any file.** Never proceed on assumption.

- [ ] You are the **Architect** for this step (or acting with their authority).
- [ ] Step 0 gate is in place — required-reviewer policy + branch protection on `main` (per `00-repo-setup.md`).
- [ ] Upstream is final on `main`: `TECH-STACK.md`.
- [ ] Working tree is clean; branching from an up-to-date `main`.
- [ ] Your host's PR/MR CLI (`gh` / `az repos` / `glab`) is available — optional; without it you'll open the change request manually in the host's web UI (see Step 5).

If any item fails, STOP and resolve it before continuing.

## 2. Create the working branch

- From an up-to-date `main`, create and switch to `init/aitools`.
- If `init/aitools` already exists, do not reuse it silently — ask the user how to proceed.

## 3. Produce the documents

- Read the guide and follow it exactly: @docs/guides/proj-init/05-ai-tool-guide.md
- It derives from `TECH-STACK.md` (already on `main`) — only approved technologies apply.
- Before starting the interview, ask one question: **which AI tool(s) will the team use on this project?** (Claude Code, GitHub Copilot, both, or another tool.) Record the answer — it determines which adapter files to generate.
- Interview the user for every section the guide requires. Ask one focused question at a time — never assume an answer.
- Write outputs based on the tools in use:
  - `AI-TOOL-GUIDE.md` — always. All shared rules live here regardless of tools in use.
  - `CLAUDE.md` — only if Claude Code is in use. References `AI-TOOL-GUIDE.md` + Claude-specific config only.
  - `.github/copilot-instructions.md` — only if GitHub Copilot is in use. Copilot reads this path regardless of Git host.
  - For any other AI tool: ask what native config file it reads and generate the equivalent adapter.
  - Adapters carry only tool-specific config — never duplicate the shared rules from `AI-TOOL-GUIDE.md`.
- Show the drafts and revise until the user approves the content.

## 4. Commit

- Commit `AI-TOOL-GUIDE.md` and the generated adapter files to `init/aitools` with a Conventional Commit message (e.g. `docs: add AI-TOOL-GUIDE.md and tool adapters (Step 5)`).
- Never commit to `main`.

## 5. Open the PR/MR (requires explicit confirmation)

- Per project governance, never push without explicit approval. Ask the user to confirm before pushing.
- On confirmation: push `init/aitools` and open a PR/MR targeting `main` via your host's CLI (`gh pr create` / `az repos pr create` / `glab mr create`) — or, if no CLI is available, push the branch and give the user the URL to open the PR/MR in the host's web UI. Title references Step 5; the body summarizes the AI rules, lists the adapter files generated, and includes the reviewer checklist from `docs/guides/proj-init/05-ai-tool-guide.md`.
- Remind the user: these documents become **final only when the Architect approves and merges the PR/MR**. Do not merge it yourself.
