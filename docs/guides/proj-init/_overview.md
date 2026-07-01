# Project Initiation Guide — Overview

This folder defines the sequence every new project follows before development begins. This kit is the control plane: Step 0 clones the target repository and registers it, and Steps 1–8 run from this kit against that clone. Run the steps in order; do not skip or reorder them.

## Workflow

```text
Step 0: Register Target Repo (clone + .proj-init/state.json)
   │
   ▼
Step 1: Repo Setup (the gate)
   │
   ▼
PRODUCT.md → PRD.md → ARCHITECTURE.md
              │              │           
              ────────────────
                     │
                     ▼
               TECH-STACK.md → AI-TOOL-GUIDE.md → README.md → BACKLOG.md
```

| Step | Claude Code | GitHub Copilot | Output | Approved by (PR/MR gate) | Purpose |
| ---- | ----------- | -------------- | ------ | ------------------------ | ------- |
| 0 | `/proj-init-bootstrap` | `.github/prompts/proj-init-bootstrap.prompt.md` | cloned target repo + `.proj-init/state.json` | Operator review before apply | Clone the target repo and register it so later steps operate on it |
| 1 | `/proj-init-repo-setup` | `.github/prompts/proj-init-repo-setup.prompt.md` | branch protection + `CONTRIBUTING.md` (governance); required-reviewer policy if plan supports it | Architect | Stand up the approval gate before any doc is written |
| 2 | `/proj-init-product` | `.github/prompts/proj-init-product.prompt.md` | `PRODUCT.md` | Product Owner | Define what we are building and why |
| 3 | `/proj-init-prd` | `.github/prompts/proj-init-prd.prompt.md` | `PRD.md` | Product Owner | Translate concept into testable requirements |
| 4 | `/proj-init-architecture` | `.github/prompts/proj-init-architecture.prompt.md` | `ARCHITECTURE.md` | Architect + PO | Define system structure and design decisions |
| 5 | `/proj-init-techstack` | `.github/prompts/proj-init-techstack.prompt.md` | `TECH-STACK.md` (+ `CONTRIBUTING.md` tooling layer) | Architect | Lock approved technologies and usage rules |
| 6 | `/proj-init-aitoolguide` | `.github/prompts/proj-init-aitoolguide.prompt.md` | `AI-TOOL-GUIDE.md` + adapter files | Architect | Define rules and constraints for all AI tools |
| 7 | `/proj-init-readme` | `.github/prompts/proj-init-readme.prompt.md` | `README.md` | Architect | Entry point: setup, env config, and how to run |
| 8 | `/proj-init-backlog` | `.github/prompts/proj-init-backlog.prompt.md` | `BACKLOG.md` + host issues/work items | Product Owner | Seed the issue tracker; bridge initiation to execution |
| — | `/proj-init-cleanup` | `.github/prompts/proj-init-cleanup.prompt.md` | workspace unregistered | Operator confirm | Unregister the workspace after Step 8 merges |

Step 0 is maintained in [00-bootstrap-target-repo.md](00-bootstrap-target-repo.md) and implemented by `scripts/bootstrap-target-repo.mjs`. The document-producing workflow for Steps 2–8 is maintained in one place: [_run-step.md](_run-step.md) — it resolves the registered target and runs every git operation and output write against it. Step metadata is maintained in [_steps.yml](_steps.yml). The output structure of each generated document is fixed by its template in [templates/](templates/), with shared writing rules in [templates/_writing-rules.md](templates/_writing-rules.md). Claude commands and Copilot prompts are adapters only. Post-init utility workflows live in [doc-status.md](doc-status.md), [doc-update.md](doc-update.md), and [cleanup.md](cleanup.md).

## Check where you are

Run `/proj-init-doc-status` in Claude Code or `.github/prompts/proj-init-doc-status.prompt.md` in GitHub Copilot at any time to see which steps are merged, which PR is open, and what to run next. Read-only — nothing is written or pushed.

## Register a target repo

Run Step 0 once, before Step 1, to clone the target repo and register it in `.proj-init/state.json`.

1. **Dry-run first** — Claude Code: `/proj-init-bootstrap`; GitHub Copilot: `.github/prompts/proj-init-bootstrap.prompt.md`; any other tool: read [00-bootstrap-target-repo.md](00-bootstrap-target-repo.md). The underlying script is `node scripts/bootstrap-target-repo.mjs --target <folder> --url <git-url>`.
2. **Confirm the target folder and git URL** — the folder must be empty or non-existent; the URL is the target repo's remote.
3. **Apply** — re-run with `--apply` to clone the target and write `.proj-init/state.json`.
4. **Start Step 1** — repo governance is set up in the target and is still required before Step 2.

Step 0 does not copy kit files into the target, create source-of-truth documents, choose technology, create product code, commit, or push.

## How to run a step

Every step is the same five-move loop. A document is **final only when its PR/MR is merged to `main`**.

Run exactly one step per session. Before running any step command, run `/proj-init-doc-status` (or the Copilot prompt equivalent) so the session starts from current truth.

1. **Branch** off `main`: `init/<step>` (e.g. `init/product`).
2. **Produce the document** — choose the path for your AI tool:
   - **Claude Code**: run the step's `/proj-init-*` slash command. It loads `_run-step.md`, `_steps.yml`, and the step guide.
   - **GitHub Copilot**: run the matching `.github/prompts/proj-init-*.prompt.md` prompt. It loads the same shared runner, registry, and step guide.
   - **Any other AI tool**: open `_run-step.md`, the step entry in `_steps.yml`, and the step guide in your AI chat.
3. **Open a PR/MR.**
4. **The required reviewer reviews and merges** — merge = finalized. Product docs are gated by the product owner; engineering docs by the architect.
5. **The next step branches off the updated `main`.** Claude Code commands verify this automatically; if using another AI tool, confirm the upstream document is merged before starting.

No draft files, no status flags: a doc on a branch is a draft, a doc on `main` is final.

## Who does what

- **Product Owner** — runs and owns Steps 2–3 and Step 8, co-reviews Step 4, and approves every product-document PR/MR.
- **Architect / Tech Lead** — runs Step 1 and Steps 4–7, and approves every engineering-document PR/MR.
- **Small teams and solo projects** — one person may hold both roles. The same person who wrote the document should still not merge it immediately: use the process-enforced self-review checklist in [01-repo-setup.md](01-repo-setup.md) as the gate substitute.
- **No self-finalizing (preferred)** — when a second reviewer is available, they must approve before merge. When they are not, the self-review checklist is the fallback — never a direct push.

## Approval continuity (required in Step 1)

To avoid approval bottlenecks, Step 1 must define a backup path in `CONTRIBUTING.md`:

- Name one primary and one backup approver for the Product Owner gate.
- Name one primary and one backup approver for the Architect gate.
- Set a review SLA: first response within one business day.
- Escalation rule: if the primary approver misses SLA, assign the backup approver. If both are unavailable for one more business day, escalate to the repo admin/project owner for temporary delegation.

## Key Rules

- Follow the steps in order. Each document derives from the one before it.
- Run Step 0 before Step 1 to clone the target repo and register it. Every later step reads that registration and operates on the clone.
- Run one step per session. Do not execute multiple initiation steps in a single chat/session.
- Start each step session with `/proj-init-doc-status` (or `.github/prompts/proj-init-doc-status.prompt.md`) before running the step command.
- A document becomes final only by merging its PR/MR to `main` — past the required reviewer.
- If a document changes, run `/proj-init-doc-update`. It now generates a reconciliation checklist automatically for all downstream documents that may be impacted.
- Sandbox spikes are allowed only after Step 5 is merged, on isolated spike branches, and must not merge to `main`.
- Production implementation work starts only after Step 6 is merged.
- Step 7 is required before wider repository sharing.
- Step 8 is required before sprint planning and development kickoff. Initiation is declared complete only when Step 8 is merged. Run `/proj-init-cleanup` afterward to unregister the workspace from this kit.
- These documents are the single source of truth for their respective areas. Always refer back to them when making decisions or writing code.

---

## Keeping docs current

After initiation, run `/proj-init-doc-update <docname>` in Claude Code or `.github/prompts/proj-init-doc-update.prompt.md` in GitHub Copilot any time a source-of-truth document diverges from reality. It updates only the changed sections and opens a PR through the same review gate that finalized the document.

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
