# Project Initiation Document Status

Read-only. No files written, no branches created. Run this any time to see where initiation stands.

## Resolve the target

Read `.proj-init/state.json` from this kit root and set `TARGET` to its `targetFolder`. If it is missing, print `No initiation workspace found. Run Step-00 (/proj-init-bootstrap) first.` and stop. All git and host-CLI checks below run against `$TARGET`.

## What to check

Run all checks silently first, then render the status table once. Do not print intermediate command output.

### Step-01 — Repo governance

- Run `git -C "$TARGET" show main:CONTRIBUTING.md` — exit 0 = governance in place.
- If exit 0, also check that `CONTRIBUTING.md` contains branch protection evidence (look for the preflight block written by Step-01). If the file exists but the evidence block is missing, mark as `partial`.

### Steps 2–8 — Documents on `main`

For each document, run `git -C "$TARGET" show main:<doc>` and capture the exit code:

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

Run `git -C "$TARGET" fetch --prune` then `git -C "$TARGET" branch -r` and collect any branch matching `init/*` (e.g. `origin/init/prd`).

### Open PRs

Try each host CLI in order, run from within `$TARGET`, and use the first that succeeds:

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
| `⚠ partial` | Step-01 only: CONTRIBUTING.md exists but preflight evidence block is missing |

Example output format:

```markdown
## Project Initiation Status

| Step | Document / Gate | Status | Detail |
|------|-----------------|--------|--------|
| 1    | Repo governance | ✓ merged | CONTRIBUTING.md with preflight evidence on `main` |
| 2    | PRODUCT.md      | ✓ merged | |
| 3    | PRD.md          | ✓ merged | |
| 4    | ARCHITECTURE.md | ⟳ PR open | PR #14 — "docs: add ARCHITECTURE.md (Step-04)" |
| 5    | TECH-STACK.md   | — not started | |
| 6    | AI-TOOL-GUIDE.md | — not started | |
| 7    | README.md       | — not started | |
| 8    | BACKLOG.md      | — not started | |

**Next:** Step-05 — `/proj-init-techstack` (blocked until Step-04 PR is merged)
```

## "Next" callout rules

After the table, always print one `**Next:**` line:

- If any step before the first gap is `PR open` or `branch open` → state that it must be merged before the next step can start, and name the blocked step.
- If all steps are merged → print "Initiation complete. Run `/proj-init-cleanup` to unregister the workspace, and `/proj-init-doc-update <docname>` if any document diverges from reality."
- Otherwise → name the lowest-numbered step that is `not started` and the command to run it.

## Nothing else

Do not suggest fixes, do not ask questions, do not offer to run any command. Status only.