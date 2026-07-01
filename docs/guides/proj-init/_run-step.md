# Shared Project Initiation Runner

Use this runner for document-producing Project Initiation steps. Tool-specific command and prompt files are adapters only; this file owns the shared workflow.

Registry entries marked `runner: false` (e.g. Step-00, the bootstrap utility) are **not** governed by this runner. They have their own guide and script and do not branch, commit, or open a PR — skip them here.

This kit is the **control plane**: you run this command from *this* repo, but the produced document and every git operation land in the **target repository** registered in Step-00. Resolve the target first (§0), then treat every git command and output path below as target-relative.

## 0. Resolve The Target Repository

Before anything else, read `.proj-init/state.json` from this kit root.

- Missing or unreadable: **STOP** and tell the operator: `No initiation workspace found. Run Step-00 (/proj-init-bootstrap) first.`
- Present: set `TARGET` to its `targetFolder`.

Then, for the rest of this runner and the step guide:

- Run every `git` command against the target: `git -C "$TARGET" <args>`.
- Run every host CLI (`gh`, `az repos`, `glab`) with `$TARGET` as the working directory.
- Read and write every produced document under `$TARGET/` (e.g. `$TARGET/PRODUCT.md`).
- Keep loading guides, templates, role files, and `_steps.yml` from **this kit** (they are not in the target).

## 0.5 Session Boundary (Required)

Run exactly one initiation step per chat/session.

- Do not execute two step commands in the same session.
- At the start of every step session, run `docs/guides/proj-init/doc-status.md` against `$TARGET` first.
- Continue only the single requested step after status is known.
- If the user asks to run a different step in the same session, stop and tell them to start a new session for that step.

## Inputs

Before starting, load:

1. The requested step entry from `docs/guides/proj-init/_steps.yml` (in this kit).
2. The step's guide file from the `guide` field (in this kit).
3. Any upstream documents listed in the step's `upstream` field, from `main` in the target: `git -C "$TARGET" show main:<document>`.
4. The role context file for the step's `owner` (in this kit):
   - `Product Owner` → `.claude/roles/product-owner.md`
   - `Architect` → `.claude/roles/solution-architect.md`

Act as that role for the entire step — document creation, reviewer checklist, and PR/MR summary. If the step has multiple reviewers (e.g., Step-04: `Architect + Product Owner`), load both role files.

The step guide is the content contract. The registry is the execution metadata. This runner is the workflow.

## 1. Preconditions

Run these checks against the target (`$TARGET`) before creating a branch or writing files. Do not proceed on assumption.

1. **Clean working tree** - run `git -C "$TARGET" status --porcelain`.
   - Empty output: proceed.
   - Non-empty output: **STOP** and tell the operator: `Uncommitted changes detected in the target — commit or stash before continuing.`

2. **Upstream documents on `main`** - for every document listed in `upstream`, run `git -C "$TARGET" show main:<document>`.
   - Exit 0 for every document: proceed.
   - Non-zero for any document: **STOP** and tell the operator which prerequisite document must be merged before this step can run.
   - Empty `upstream`: no upstream document is required.

3. **Step not already finalized** - unless the step sets `replacesExisting: true` in `_steps.yml`, run `git -C "$TARGET" show main:<primary-output>` for the step's primary output document — the first entry in the step's `outputs` field (for Steps 2–8 this is the document its `template` produces).
   - Non-zero (not on `main`): proceed — the step has not been finalized.
   - Exit 0 (already on `main`): **STOP**. The step is already complete. Tell the operator the document is final and to run `/proj-init-doc-update <document>` to revise it instead of re-running the step. Do not branch or regenerate.
   - `replacesExisting: true` (e.g. Step-07, which overwrites the target's pre-existing README): skip this check — the file's presence on `main` is expected and is not proof the step ran. Rely on the §3 branch check and operator confirmation.

4. **Step-01 gate** - verify Step-01 preflight evidence in `$TARGET/CONTRIBUTING.md`, then run `node scripts/check-branch-policy-enforcement.mjs --verify` (from this kit; it targets `$TARGET`). This re-probes the host — it does not just confirm branch protection exists.
   - Exit 0 (recorded mode matches host capability): proceed. A recorded `process-enforced` mode passes here — the self-review checklist is the gate.
   - Exit 1 (evidence missing, or recorded `host-enforced` but the host no longer enforces a required reviewer): **STOP**. The "final on `main`" signal cannot be trusted until the recorded mode and the host agree — send the operator back to Step-01 to reconcile it.
   - Exit 2 (capability undetermined — CLI missing or not authenticated): **STOP**. Do not proceed on an undetermined probe; resolve the tooling/auth issue first.

5. **Additional step preconditions** - apply any `specialPreconditions` from `_steps.yml` and any preconditions in the step guide.

## 2. Confirm Before Proceeding

Present the precondition results as a checklist and wait for an explicit `yes` before creating a branch, writing files, creating host issues, or pushing anything.

The checklist must include:

- Operator role matches the step's `owner`, and the corresponding role context file has been loaded.
- Reviewer gate matches the step's `reviewer`.
- Step-01 gate is in place and machine-validated.
- Approval continuity is defined in `CONTRIBUTING.md`.
- Upstream documents are final on `main`.
- This step's output is not already final on `main`, or the step is marked `replacesExisting: true`.
- Working tree is clean and work will branch from an up-to-date `main`.
- Host PR/MR CLI status is known, unless the step has a stricter host requirement.

If any item fails, stop and resolve it before continuing.

## 3. Create The Working Branch

In the target, from an up-to-date `main`, create and switch to the branch named in the step's `branch` field: `git -C "$TARGET" checkout -b <branch>` off the latest `main`.

If the branch already exists, do not reuse it silently. Ask the operator whether to reuse it, delete it, or create a new branch name.

## 4. Produce The Output

Follow the step guide exactly.

Use these shared rules for every step:

- Read every upstream document from `main` in the target (`git -C "$TARGET" show main:<document>`) and use it as source of truth.
- Interview the operator for every section the guide requires.
- Ask one focused question at a time.
- Ask as many focused questions as needed until every required section is complete and every template placeholder is resolved.
- Never assume an answer.
- Write only the files listed in `outputs`, plus any conditional outputs explicitly allowed by the step guide — all under `$TARGET/`.
- Show drafts and revise until the operator approves the content.

Use these token optimization rules for every step:

- Load only the requested step entry, its guide, and the upstream documents listed for that step. Do not load unrelated step guides.
- Reuse facts already confirmed in the current step session. Do not re-ask answered questions.
- Keep prompts and responses compact: one question at a time, one decision at a time.
- Show only changed sections when revising drafts; do not reprint unchanged sections.
- Summarize long upstream content into concise decision inputs before asking the next question.
- Stop asking once all required sections are complete and no placeholders remain.

If the step has a `template` field, produce the output by filling that template — do not invent the structure:

- Load the template named in the step's `template` field. It owns the document's structure (its headings and their order).
- Fill the header block: `Owner` (the step's `owner`), `Last updated` (today, `YYYY-MM-DD`), `Source of truth for` (one line), and `Derived from` / `Downstream` from the step's `upstream` field and the steps that list this document as upstream.
- Replace the `<!-- @inject: _doc-references.md -->` marker with the block between the `BEGIN INJECT` / `END INJECT` markers in `docs/guides/proj-init/templates/_doc-references.md`.
- Replace every `[placeholder]` with interview answers. No placeholder may remain in the committed document.
- Preserve the header block, every top-level (`## N.`) heading and its order, the references table, and the `---` dividers. Do not add or remove top-level sections.
- Apply `docs/guides/proj-init/templates/_writing-rules.md` to all prose, requirements, and tables of every generated document.

If the step has `specialActions`, perform them in the order listed after the guide-specific interview rules are satisfied.

## 5. Commit

In the target, commit the files listed in `outputs` and any conditional outputs generated by the step guide: `git -C "$TARGET" add <outputs>` then `git -C "$TARGET" commit`.

Use the `commitMessage` from `_steps.yml`.

Never commit to `main`.

## 6. Open The PR/MR

Never push without explicit operator approval.

After approval:

1. Push the step branch: `git -C "$TARGET" push -u origin <branch>`.
2. Open a PR/MR targeting `main` using the available host CLI, run from within `$TARGET`: `gh pr create`, `az repos pr create`, or `glab mr create`.
3. If no host CLI is available, push the branch and give the operator the host URL/path needed to open the PR/MR manually.
4. Use a title that references the step number and output.
5. In the body, include the step's `prSummary` and the reviewer checklist from the step guide.

End by reminding the operator that the output becomes final only when the required reviewer gate approves and merges the PR/MR.

## Rules

- This runner owns workflow rules. Do not duplicate these rules in tool-specific adapters.
- `_steps.yml` owns step metadata. Do not hard-code branches, outputs, reviewers, or dependencies in adapters.
- Step guide files own document-specific requirements and special behavior.
- If workflow changes, update this file first, then keep adapters thin.
