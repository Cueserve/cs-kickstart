# Project Initiation Guide — Overview

This folder defines the sequence every new project follows before development begins. Each step builds on the previous one and produces one document. Do not skip steps or reorder them.

## Workflow

```text
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

| Step | Command | Output | Approved by (PR/MR gate) | Purpose |
| ---- | ------- | ------ | ------------------------ | ------- |
| 1 | manual — [01-repo-setup.md](01-repo-setup.md) | branch protection + `CONTRIBUTING.md` (governance); required-reviewer policy if plan supports it | Architect | Stand up the approval gate before any doc is written |
| 2 | `/init-product` — [02-prod-concept.md](02-prod-concept.md) | `PRODUCT.md` | Product Owner | Define what we are building and why |
| 3 | `/init-prd` — [03-prod-requirements.md](03-prod-requirements.md) | `PRD.md` | Product Owner | Translate concept into testable requirements |
| 4 | `/init-architecture` — [04-architecture.md](04-architecture.md) | `ARCHITECTURE.md` | Architect + PO | Define system structure and design decisions |
| 5 | `/init-techstack` — [05-tech-stack.md](05-tech-stack.md) | `TECH-STACK.md` (+ `CONTRIBUTING.md` tooling layer) | Architect | Lock approved technologies and usage rules |
| 6 | `/init-aitoolguide` — [06-ai-tool-guide.md](06-ai-tool-guide.md) | `AI-TOOL-GUIDE.md` + adapter files | Architect | Define rules and constraints for all AI tools |
| 7 | `/init-readme` — [07-readme.md](07-readme.md) | `README.md` | Architect | Entry point: setup, env config, and how to run |
| 8 | `/init-backlog` — [08-backlog.md](08-backlog.md) | `BACKLOG.md` + host issues/work items | Product Owner | Seed the issue tracker; bridge initiation to execution |

## Check where you are

Run `/check-doc-status` at any time to see which steps are merged, which PR is open, and what to run next. Read-only — nothing is written or pushed.

## How to run a step

Every step is the same five-move loop. A document is **final only when its PR/MR is merged to `main`**.

1. **Branch** off `main`: `init/<step>` (e.g. `init/product`).
2. **Produce the document** — two paths depending on your AI tool:
   - **Claude Code**: run the step's `/init-*` slash command — it interviews you and writes the document automatically.
   - **Copilot Chat or any other AI tool**: open the step's guide from `docs/guides/proj-init/` in your AI chat, use it as your prompt, and save the output to the correct file manually.
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
- A document becomes final only by merging its PR/MR to `main` — past the required reviewer.
- If a document changes, run `/update-doc`. It now generates a reconciliation checklist automatically for all downstream documents that may be impacted.
- Sandbox spikes are allowed only after Step 5 is merged, on isolated spike branches, and must not merge to `main`.
- Production implementation work starts only after Step 6 is merged.
- Step 7 is required before wider repository sharing.
- Step 8 is required before sprint planning and development kickoff. Initiation is declared complete only when Step 8 is merged.
- These documents are the single source of truth for their respective areas. Always refer back to them when making decisions or writing code.

---

## Keeping docs current

After initiation, run `/update-doc <docname>` any time a source-of-truth document diverges from reality. It updates only the changed sections and opens a PR through the same review gate that finalized the document.

**When to update which document:**

| If this happens | Run `/update-doc` on |
| --------------- | -------------------- |
| Product scope, goal, or target users change | `PRODUCT.md` |
| Requirements added, removed, or acceptance criteria changed | `PRD.md` |
| System design or a major architecture decision changes | `ARCHITECTURE.md` |
| A library, framework, or tool is added, removed, or version-locked | `TECH-STACK.md` |
| AI tool rules, banned patterns, or scope boundaries change | `AI-TOOL-GUIDE.md` |
| Setup steps, env config, or run commands change | `README.md` |
| Epics or stories added, removed, rescoped, or host IDs change | `BACKLOG.md` |

`/update-doc` now runs an impact analyzer and creates a reconciliation checklist file automatically. Keep checking off that list until no downstream document is stale.
