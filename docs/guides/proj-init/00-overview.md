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

| Step | Command | Output | Approved by (PR gate) | Purpose |
| ---- | ------- | ------ | --------------------- | ------- |
| 0 | manual — [00-repo-setup.md](00-repo-setup.md) | `.github/CODEOWNERS`, branch protection, `CONTRIBUTING.md` (governance) | Architect | Stand up the approval gate before any doc is written |
| 1 | `/init-product` — [01-prod-concept.md](01-prod-concept.md) | `PRODUCT.md` | Product Owner | Define what we are building and why |
| 2 | `/init-prd` — [02-prd.md](02-prd.md) | `PRD.md` | Product Owner | Translate concept into testable requirements |
| 3 | `/init-architecture` — [03-architecture.md](03-architecture.md) | `ARCHITECTURE.md` | Architect + PO | Define system structure and design decisions |
| 4 | `/init-techstack` — [04-tech-stack.md](04-tech-stack.md) | `TECH-STACK.md` (+ `CONTRIBUTING.md` tooling layer) | Architect | Lock approved technologies and usage rules |
| 5 | `/init-aitools` — [05-ai-tool-guide.md](05-ai-tool-guide.md) | `AI-TOOL-GUIDE.md` + adapter files | Architect | Define rules and constraints for all AI tools |
| 6 | `/init-readme` — [06-readme.md](06-readme.md) | `README.md` | Architect | Entry point: setup, env config, and how to run |

## How to run a step

Every step is the same five-move loop. A document is **final only when its PR is merged to `main`**.

1. **Branch** off `main`: `init/<step>` (e.g. `init/product`).
2. **Run the command** — it asks you that step's questions and writes the document.
3. **Open a PR.**
4. **The CODEOWNER reviews and merges** — merge = finalized. Product docs are gated by the product owner; engineering docs by the architect.
5. **The next step branches off the updated `main`.** A command refuses to start if its upstream document isn't merged yet.

No draft files, no status flags: a doc on a branch is a draft, a doc on `main` is final.

## Who does what

- **Product Owner** — runs and owns Steps 1–2, co-reviews Step 3, and approves every product-document PR.
- **Architect / Tech Lead** — runs Step 0 and Steps 3–6, and approves every engineering-document PR.
- **No self-finalizing** — anyone may run a step they own, but nobody merges their own document without the CODEOWNER's approval.

## Key Rules

- Follow the steps in order. Each document derives from the one before it.
- A document becomes final only by merging its PR to `main` — past the required CODEOWNER.
- If a document changes, open a new PR and reconcile every document that depends on it.
- No code or implementation work starts until Step 0 is in place and Steps 1–5 are merged.
- These documents are the single source of truth for their respective areas. Always refer back to them when making decisions or writing code.
