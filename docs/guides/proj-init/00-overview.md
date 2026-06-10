# Project Initiation Guide — Overview

This folder defines the sequence every new project must follow before development begins. Each step builds on the previous one. Do not skip steps or reorder them.

## Workflow

```text
PRODUCT.md → PRD.md → ARCHITECTURE.md ─┐
                  └────────────────────→ TECH-STACK.md
```

| Step | File | Output | Purpose |
| ---- | ---- | ------ | ------- |
| 1 | [01-prod-concept.md](01-prod-concept.md) | `PRODUCT.md` | Define what we are building and why |
| 2 | [02-prd.md](02-prd.md) | `PRD.md` | Translate concept into detailed, testable requirements |
| 3 | [03-architecture.md](03-architecture.md) | `ARCHITECTURE.md` | Define system structure and design decisions |
| 4 | [04-tech-stack.md](04-tech-stack.md) | `TECH-STACK.md` | Lock in approved technologies and usage rules |

## Key Rules

- Follow the steps in order. Each document derives from the one before it.
- If a document changes, reconcile every document that depends on it.
- No code or implementation work starts until Steps 1–4 are complete and agreed on.
- These documents are the single source of truth for their respective areas. Always refer back to them when making decisions or writing code.
