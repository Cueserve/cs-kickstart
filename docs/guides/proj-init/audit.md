# cs-kickstart Static Completeness Audit

Read-only. No files written, no branches created, nothing executed. Run this any time to check whether the kit is a complete, runnable solution.

You are auditing **this kit** (cs-kickstart), the control plane — not a target repo.
Goal: decide whether this is a **complete, runnable, multi-session, token-lean, question-driven** solution where an operator can start from a clean checkout, run the steps across separate sessions, produce every source-of-truth document, and land them in a registered target repo via merged PRs.

## Hard scope — static only

DO NOT, under any circumstance:
- clone, register, or touch a target repo
- read, create, or modify `.proj-init/state.json`
- run `scripts/*.mjs`, any `/proj-init-*` step, or any git/`gh` command
- edit any kit file

You **read kit files and report**. Zero side effects. If any check would require running something to answer, mark it `UNPROVABLE (static)` and move on — do not run it.

## Precondition

Confirm CWD is the kit root: `README.md` title is "CS Project Kickstart" AND `docs/guides/proj-init/_steps.yml` exists.
If not, STOP with: `Not at cs-kickstart root — aborting.` Do not interrogate the user; infer from files.

## Read order (token discipline — obey this, do not slurp the repo)

Read in phases. Stop-report early only on a structural FAIL that makes later phases meaningless (e.g. `_steps.yml` missing/unparseable).

- **Phase 0 — Contract.** Read `README.md` + `docs/guides/proj-init/_overview.md`. Extract the *claimed* contract: step list, per-step output doc, ownership, PR-merge-as-final gate, "one step per session" rule.
- **Phase 1 — Registry (the spine).** Read `docs/guides/proj-init/_steps.yml` + `_run-step.md`. Derive the **expected artifact set**: for each step → {guide file, claude command, template, output doc name, upstream dependency}. Skip entries marked `runner: false` / `kind: utility` (e.g. Step-00) when deriving the doc-step artifact set — they have no template or output doc; for them verify only {guide, claude command, script}.
- **Phase 2 — Wiring (cheap, list/glob — do not open contents yet).** For every registry entry verify existence of: step guide `NN-*.md`, `.claude/commands/proj-init-*.md`, and (where the step emits a doc) a template under `templates/`. List orphans on both sides: guides/commands/templates with no registry entry, and registry entries with no file.
- **Phase 3 — Content (open only what a check names).** Deep-read only the files a specific check below requires. Do not read every guide in full unless a check demands it.
- **Phase 4 — Score + report.** Emit the report format below.

## Audit dimensions

Each check → `PASS` / `GAP` / `FAIL` with a `file:line` or `file:section` anchor. Definitions:
- **PASS** — verified true against file contents.
- **GAP** — functions, but rests on convention not enforcement, or has a named risk that can silently break the completeness claim.
- **FAIL** — missing, broken, or self-contradictory; blocks "complete solution."

### D1 — Runnable from the control plane
- Every `_steps.yml` entry resolves to an existing guide + Claude command (from Phase 2).
- `_run-step.md` actually loads {runner + step guide + template + registry} and drives the step — not a stub that defers back to prose.
- `/proj-init-doc-status` exists and reads real signal (state.json + branch/PR + `main`), not a hardcoded list.
- No step command is a dead adapter (references a guide/template path that doesn't exist).

### D2 — Produces the output
- Step-02 through Step-08 each declare exactly **one** output doc; names match README's table and the templates.
- `check-template-drift.mjs` is wired as the guard the README claims (template headings → guide section map) — verify by reading the script's intent + one guide/template pair, not by running it.
- No orphan templates and no doc-producing step missing a template (from Phase 2).

### D3 — Commits to the registered target (not the kit)
- Runner/guides resolve target path from `state.json` and write docs into the **clone**, never the kit tree.
- Explicit branch model `init/<step>` off `main`, PR opened, merge = final — present in `_run-step.md`/guides, not just README.
- Guard against kit-file leakage into target (README claims "kit files never copied") — verify the write path is scoped to target doc names only.

### D4 — Multi-session / resumable
- Each doc step verifies its **upstream doc is merged to `main`** before branching — check the actual step guides, not just the README claim.
- No step depends on in-memory carry from a prior session; all resume signal is on disk (state.json + git).
- **Named risk checks (mark GAP unless enforcement found):**
  - `state.json` gitignored + operator-local — resume breaks across machines/operators. Is single-box/single-operator stated as a precondition anywhere?
  - This kit is solo / process-enforced by design — "PR merge = final" means the author completed the self-review checklist, not that a host blocked an unapproved merge. Is Step-01 honest about this (documents the checklist as the gate, no false host-enforced/required-reviewer claim), rather than implying enforcement it does not have?
  - Idempotency: re-running a step whose PR is already open or already merged — is the behavior specified, or undefined?

### D5 — Token optimization
- A step session loads only {`_run-step.md` + that step's guide + its template + state} — **not** the whole `docs/guides/proj-init/` tree. Verify commands/`_run-step.md` scope their reads.
- Redundancy scan across `_run-step.md` / `_steps.yml` / guides / templates / adapters: same rules duplicated in multiple places = drift risk + token waste. Name duplicated blocks.
- Is per-step context scope a **guardrail or just a convention**? If nothing enforces the lean load, mark GAP (token-lean by discipline, not by design).

### D6 — Question-driven (highest risk for a reusable kit)
- Every doc-producing step guide (2–8) has an **explicit elicitation phase** that gathers project context before generating.
- Generation is **gated** on answers — the guide must not fall through to writing a doc when inputs are missing (that's the boilerplate failure mode for a repo-agnostic kit).
- Elicitation is **specific per doc** (PRODUCT asks different questions than ARCHITECTURE), not one generic questionnaire reused.
- Unanswered/skipped-question behavior is defined (ask again / block / mark TODO) — not silent defaulting.

### D7 — Adapter parity (secondary; target is Claude Code)
- Every step with a Claude command has a matching `.github/prompts/*.prompt.md` (README claims dual-tool). Missing parity = GAP, not FAIL, since primary target is Claude Code.
- Both adapter families point at the **same** shared runner/registry — no forked logic.

## Output format

```
# cs-kickstart Audit — <date>

VERDICT: <Complete | Complete-with-gaps | Incomplete>
<one sentence: can an operator run clean-checkout → 8 merged docs in target, across sessions, or not>

## Scorecard
| Dim | Area                     | Rating        | Headline |
|-----|--------------------------|---------------|----------|
| D1  | Runnable                 | PASS/GAP/FAIL | ...      |
| D2  | Produces output          | ...           | ...      |
| D3  | Commits to target        | ...           | ...      |
| D4  | Multi-session            | ...           | ...      |
| D5  | Token optimization       | ...           | ...      |
| D6  | Question-driven          | ...           | ...      |
| D7  | Adapter parity           | ...           | ...      |

## Findings (GAP/FAIL only)
For each:
- **[D#][RATING] <short title>** — `file:line-or-section`
  - What: <the observed fact in the file>
  - Why it matters: <how it breaks the completeness claim>
  - Minimal fix: <smallest change that closes it — one line>

## Orphans & drift
- Registry entries with no file / files with no registry entry
- Duplicated rule blocks (D5)
- Template ↔ guide heading mismatches (D2)

## What static audit can't prove
- Runtime loop (Step-00 clone → doc write → PR → merge gate) is UNVERIFIED here; requires a dry-run (depth B/C).
- Any check marked UNPROVABLE (static) above.
```

## Rules for the report
- Every GAP/FAIL cites a real `file:line` or `file:section`. No finding without an anchor.
- No generic advice. If you can't tie it to a file, drop it.
- Order findings FAIL-first, then GAP, within each dimension.
- Do not restate PASS items in the findings section — the scorecard covers them.
- If a whole dimension is PASS, say so in one line; don't pad.
