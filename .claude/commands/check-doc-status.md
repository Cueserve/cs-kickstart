---
description: "Show project initiation status — which steps are merged, in progress, or not started"
allowed-tools: Read, Glob, Bash(git:*), Bash(gh:*), Bash(az:*), Bash(glab:*)
---

# /check-doc-status — Project Initiation Status

Read-only. No files written, no branches created. Run this any time to see where initiation stands.

## What to check

Run all checks silently first, then render the status table once. Do not print intermediate command output.

### Step 1 — Repo governance

- Run `git show main:CONTRIBUTING.md` — exit 0 = governance in place.
- If exit 0, also check that `CONTRIBUTING.md` contains branch protection evidence (look for the preflight block written by Step 1). If the file exists but the evidence block is missing, mark as `partial`.

### Steps 2–8 — Documents on `main`

For each document, run `git show main:<doc>` and capture the exit code:

| Step | Document |
| ---- | -------- |
| 2 | `PRODUCT.md` |
| 3 | `PRD.md` |
| 4 | `ARCHITECTURE.md` |
| 5 | `TECH-STACK.md` |
| 6 | `AI-TOOL-GUIDE.md` |
| 7 | `README.md` |
| 8 | `BACKLOG.md` |

Exit 0 = merged. Non-zero = not on `main`.

### In-progress branches

Run `git fetch --prune` then `git branch -r` and collect any branch matching `init/*` (e.g. `origin/init/prd`).

### Open PRs

Try each host CLI in order and use the first that succeeds:

- **GitHub**: `gh pr list --base main --state open --json number,title,headRefName,author` — filter results to entries where `headRefName` starts with `init/`.
- **ADO**: `az repos pr list --status active` — filter to PRs where the source branch starts with `init/`.
- **GitLab**: `glab mr list --state opened` — filter to MRs where the source branch starts with `init/`.
- If no CLI is available, skip this check and note it in the output.

## Status table

Render a single Markdown table with one row per step. Use the status symbols below.

| Symbol | Meaning |
| ------ | ------- |
| `✓ merged` | Document is on `main` |
| `⟳ PR open` | A PR/MR targeting `main` is open for this step's branch |
| `⊙ branch open` | Branch exists but no open PR yet |
| `— not started` | No branch, no document on `main` |
| `⚠ partial` | Step 1 only: CONTRIBUTING.md exists but preflight evidence block is missing |

Example output format:

```
## Project Initiation Status

| Step | Document / Gate | Status | Detail |
|------|-----------------|--------|--------|
| 1    | Repo governance | ✓ merged | CONTRIBUTING.md with preflight evidence on `main` |
| 2    | PRODUCT.md      | ✓ merged | |
| 3    | PRD.md          | ✓ merged | |
| 4    | ARCHITECTURE.md | ⟳ PR open | PR #14 — "docs: add ARCHITECTURE.md (Step 4)" |
| 5    | TECH-STACK.md   | — not started | |
| 6    | AI-TOOL-GUIDE.md | — not started | |
| 7    | README.md       | — not started | |
| 8    | BACKLOG.md      | — not started | |

**Next:** Step 5 — `/init-techstack` (blocked until Step 4 PR is merged)
```

## "Next" callout rules

After the table, always print one `**Next:**` line:

- If any step before the first gap is `PR open` or `branch open` → state that it must be merged before the next step can start, and name the blocked step.
- If all steps are merged → print "Initiation complete. Run `/update-doc <docname>` if any document diverges from reality."
- Otherwise → name the lowest-numbered step that is `not started` and the command to run it.

## Nothing else

Do not suggest fixes, do not ask questions, do not offer to run any command. Status only.
