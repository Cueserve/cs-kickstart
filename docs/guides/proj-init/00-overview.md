# Project Initiation Guide — Overview

This folder defines the sequence every new project follows before development begins. Each step builds on the previous one and produces one document. Do not skip steps or reorder them.

## Workflow

```text
Step 0: Repo Setup (the gate)
   │
   ▼
PRODUCT.md → PRD.md → ARCHITECTURE.md ─┐
                  └────────────────────→ TECH-STACK.md → AI-TOOL-GUIDE.md → README.md
```

| Step | Command | Output | Approved by (PR/MR gate) | Purpose |
| ---- | ------- | ------ | ------------------------ | ------- |
| 0 | manual — [00-repo-setup.md](00-repo-setup.md) | branch protection + `CONTRIBUTING.md` (governance); required-reviewer policy if plan supports it | Architect | Stand up the approval gate before any doc is written |
| 1 | `/init-product` — [01-prod-concept.md](01-prod-concept.md) | `PRODUCT.md` | Product Owner | Define what we are building and why |
| 2 | `/init-prd` — [02-prd.md](02-prd.md) | `PRD.md` | Product Owner | Translate concept into testable requirements |
| 3 | `/init-architecture` — [03-architecture.md](03-architecture.md) | `ARCHITECTURE.md` | Architect + PO | Define system structure and design decisions |
| 4 | `/init-techstack` — [04-tech-stack.md](04-tech-stack.md) | `TECH-STACK.md` (+ `CONTRIBUTING.md` tooling layer) | Architect | Lock approved technologies and usage rules |
| 5 | `/init-aitools` — [05-ai-tool-guide.md](05-ai-tool-guide.md) | `AI-TOOL-GUIDE.md` + adapter files | Architect | Define rules and constraints for all AI tools |
| 6 | `/init-readme` — [06-readme.md](06-readme.md) | `README.md` | Architect | Entry point: setup, env config, and how to run |

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

- **Product Owner** — runs and owns Steps 1–2, co-reviews Step 3, and approves every product-document PR/MR.
- **Architect / Tech Lead** — runs Step 0 and Steps 3–6, and approves every engineering-document PR/MR.
- **Small teams and solo projects** — one person may hold both roles. The same person who wrote the document should still not merge it immediately: use the process-enforced self-review checklist in [00-repo-setup.md](00-repo-setup.md) as the gate substitute.
- **No self-finalizing (preferred)** — when a second reviewer is available, they must approve before merge. When they are not, the self-review checklist is the fallback — never a direct push.

## Key Rules

- Follow the steps in order. Each document derives from the one before it.
- A document becomes final only by merging its PR/MR to `main` — past the required reviewer.
- If a document changes, run `/doc-update` and reconcile every downstream document that depends on it.
- No code or implementation work starts until Step 0 is in place and Steps 1–5 are merged.
- These documents are the single source of truth for their respective areas. Always refer back to them when making decisions or writing code.

---

## Keeping docs current

After initiation, run `/doc-update <docname>` any time a source-of-truth document diverges from reality. It updates only the changed sections and opens a PR through the same review gate that finalized the document.

**When to update which document:**

| If this happens | Run `/doc-update` on |
| --------------- | -------------------- |
| Product scope, goal, or target users change | `PRODUCT.md` |
| Requirements added, removed, or acceptance criteria changed | `PRD.md` |
| System design or a major architecture decision changes | `ARCHITECTURE.md` |
| A library, framework, or tool is added, removed, or version-locked | `TECH-STACK.md` |
| AI tool rules, banned patterns, or scope boundaries change | `AI-TOOL-GUIDE.md` |
| Setup steps, env config, or run commands change | `README.md` |

Each update command will remind you which downstream documents may also need updating — follow the chain until nothing is stale.
