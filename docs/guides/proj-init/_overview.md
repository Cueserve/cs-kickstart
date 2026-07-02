# Project Initiation Guide — Overview

This folder defines the sequence every new project follows before development begins. This kit is the control plane: Step-00 clones the target repository and registers it, and Step-01 through Step-09 run from this kit against that clone. Run the steps in order; do not skip or reorder them.

## Workflow

```text
Step-00: Register Target Repo (clone + .proj-init/state.json)
   │
   ▼
Step-01: Repo Setup (the gate)
   │
   ▼
PRODUCT.md → PRD.md → ARCHITECTURE.md
              │              │           
              ────────────────
                     │
                     ▼
               TECH-STACK.md → AI-TOOL-GUIDE.md → README.md → BACKLOG.md
                                                                   │
                                                                   ▼
                                              Step-09: Finalize Governance (strip init-only CONTRIBUTING.md)
```

| Step | Run | Output | Approved by (PR/MR gate) | Purpose |
| ---- | --- | ------ | ------------------------ | ------- |
| 0 | `/proj-init-bootstrap` | cloned target repo + `.proj-init/state.json` | Operator review before apply | Clone the target repo and register it so later steps operate on it |
| 1 | `/proj-init-repo-setup` | `CONTRIBUTING.md` (governance) + branch protection if plan supports it | Architect | Stand up the branching convention and self-review gate before any doc is written |
| 2 | `/proj-init-product` | `PRODUCT.md` | Product Owner | Define what we are building and why |
| 3 | `/proj-init-prd` | `PRD.md` | Product Owner | Translate concept into testable requirements |
| 4 | `/proj-init-architecture` | `ARCHITECTURE.md` | Architect + PO | Define system structure and design decisions |
| 5 | `/proj-init-techstack` | `TECH-STACK.md` (+ `CONTRIBUTING.md` tooling layer) | Architect | Lock approved technologies and usage rules |
| 6 | `/proj-init-aitoolguide` | `AI-TOOL-GUIDE.md` + adapter files | Architect | Define rules and constraints for all AI tools |
| 7 | `/proj-init-readme` | `README.md` | Architect | Entry point: setup, env config, and how to run |
| 8 | `/proj-init-backlog` | `BACKLOG.md` + host issues/work items | Product Owner | Seed the issue tracker; bridge initiation to execution |
| 9 | `/proj-init-finalize` | `CONTRIBUTING.md` (init-only material stripped) | Architect | Remove initiation-only governance; hand off a permanent contribution core |
| — | `/proj-init-cleanup` | workspace unregistered | Operator confirm | Unregister the workspace after Step-09 merges |

GitHub Copilot users can run matching prompt adapters in `.github/prompts/proj-init-*.prompt.md`; they resolve to the same underlying workflow.

Step-00 is maintained in [00-bootstrap.md](00-bootstrap.md) and implemented by `scripts/bootstrap-target-repo.mjs`. The shared workflow for Step-02 through Step-09 is maintained in one place: [_run-step.md](_run-step.md) — it resolves the registered target and runs every git operation and output write against it. Step-02 through Step-08 each produce a source-of-truth document; Step-09 transforms `CONTRIBUTING.md` rather than producing a new document, but runs on the same branch/PR/merge rail. Step metadata is maintained in [_steps.yml](_steps.yml). The output structure of each generated document is fixed by its template in [templates/](templates/), with shared writing rules in [templates/_writing-rules.md](templates/_writing-rules.md). Claude commands and Copilot prompts are adapters only. Post-init utility workflows live in [doc-status.md](doc-status.md), [doc-update.md](doc-update.md), and [cleanup.md](cleanup.md).

## Check where you are

Run `/proj-init-doc-status` at any time to see which steps are merged, which PR is open, and what to run next. Read-only — nothing is written or pushed.

## Register a target repo

Run Step-00 once, before Step-01, to clone the target repo and register it in `.proj-init/state.json`.

1. **Dry-run first** — run `/proj-init-bootstrap`; any other tool: read [00-bootstrap.md](00-bootstrap.md). The underlying script is `node scripts/bootstrap-target-repo.mjs --target <folder> --url <git-url>`.
2. **Confirm the target folder and git URL** — the folder must be empty or non-existent; the URL is the target repo's remote.
3. **Apply** — re-run with `--apply` to clone the target and write `.proj-init/state.json`.
4. **Start Step-01** — repo governance is set up in the target and is still required before Step-02.

Step-00 does not copy kit files into the target, create source-of-truth documents, choose technology, create product code, commit, or push.

## How to run a step

Every step is the same five-move loop. A document is **final only when its PR/MR is merged to `main`**.

Run exactly one step per session. Before running any step command, run `/proj-init-doc-status` so the session starts from current truth.

1. **Branch** off `main`: `init/<step>` (e.g. `init/product`).
2. **Produce the document** — run the step's `/proj-init-*` command. Any other AI tool: open `_run-step.md`, the step entry in `_steps.yml`, and the step guide in your AI chat.
3. **Open a PR/MR.**
4. **Complete the self-review checklist, then merge** — merge = finalized. Solo / process-enforced: the author is both product owner and architect and self-certifies before merging.
5. **The next step branches off the updated `main`.** Command adapters can verify this automatically; otherwise confirm the upstream document is merged before starting.

No draft files, no status flags: a doc on a branch is a draft, a doc on `main` is final.

## Who does what

- **Product Owner hat** — owns Step-02, Step-03, and Step-08, and co-authors Step-04.
- **Architect hat** — owns Step-01, Step-04 through Step-07, and Step-09.
- **Solo / process-enforced** — one person wears both hats. Adopt the hat the step calls for while authoring, then complete the self-review checklist in [01-repo-setup.md](01-repo-setup.md) before merging — never a direct push to `main`.

## Key Rules

- Follow the steps in order. Each document derives from the one before it.
- Run Step-00 before Step-01 to clone the target repo and register it. Every later step reads that registration and operates on the clone.
- Initiation is single-operator and single-machine: `.proj-init/state.json` is operator-local and gitignored. Run every step from the same machine and operator that ran Step-00. To resume on another machine or as another operator, re-run Step-00 to re-register the target.
- Run one step per session. Do not execute multiple initiation steps in a single chat/session.
- Start each step session with `/proj-init-doc-status` before running the step command.
- A document becomes final only by merging its PR/MR to `main` — past the required reviewer.
- If a document changes, run `/proj-init-doc-update`. It now generates a reconciliation checklist automatically for all downstream documents that may be impacted.
- Sandbox spikes are allowed only after Step-05 is merged, on isolated spike branches, and must not merge to `main`.
- Production implementation work starts only after Step-06 is merged.
- Step-07 is required before wider repository sharing.
- Step-08 is required before sprint planning and development kickoff. Step-09 then strips the initiation-only material from `CONTRIBUTING.md`. Initiation is declared complete only when Step-09 is merged. Run `/proj-init-cleanup` afterward to unregister the workspace from this kit.
- These documents are the single source of truth for their respective areas. Always refer back to them when making decisions or writing code.

---

## Keeping docs current

After initiation, run `/proj-init-doc-update <docname>` any time a source-of-truth document diverges from reality. It updates only the changed sections and opens a PR through the same review gate that finalized the document.

**When to update which document:**

| If this happens | Run `/proj-init-doc-update` on |
| --------------- | -------------------- |
| Product scope, goal, or target users change | `PRODUCT.md` |
| Requirements added, removed, or acceptance criteria changed | `PRD.md` |
| System design or a major architecture decision changes | `ARCHITECTURE.md` |
| A library, framework, or tool is added, removed, or version-locked | `TECH-STACK.md` |
| AI tool rules, banned patterns, or scope boundaries change | `AI-TOOL-GUIDE.md` |
| Setup steps, env config, or run commands change | `README.md` |
| Epics or stories added, removed, rescoped, or host IDs change | `BACKLOG.md` |

`/proj-init-doc-update` now runs an impact analyzer and creates a reconciliation checklist file automatically. Keep checking off that list until no downstream document is stale.
