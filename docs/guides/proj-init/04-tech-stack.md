# Step 4: Tech Stack

**Output file:** `TECH-STACK.md`
**Depends on:** `PRD.md` (Step 2), `ARCHITECTURE.md` (Step 3)
**Required before:** development begins

---

## Goal

Create `TECH-STACK.md` to record approved technologies with their selection rationale and enforce technical consistency across the project.

## Objective

This document lists every approved technology (languages, frameworks, datastores, services, key libraries) with the reason and version for each, plus the rules for when and how each is used. It is the single reference for what the team is allowed to use, and the gate for adding anything new. It records choices and constraints — not how the system is wired together (that is `ARCHITECTURE.md`).

## What This Document Covers

- **Languages and frameworks** — chosen options, with version and a one-line reason
- **Datastores** — databases/storage options, with why each fits its role
- **Cloud and infrastructure services** — the platform services relied on
- **Key libraries/tools** — non-obvious dependencies that shape the build
- **Selection trade-offs** — why each major choice beat alternatives
- **Versions and constraints** — pinned versions, minimums, and known limits

## Why This Matters

- Single source to see all technologies in use, without digging through code or guessing
- Helps new developers quickly understand the stack
- Keeps track of why each tech was chosen, so future changes are easier and more informed

## Rules

- `TECH-STACK.md` derives from `PRD.md` and `ARCHITECTURE.md`.
- If a tool is not listed here, do not use it. Add it to this file and get approval first.
- Use the exact versions listed here. Do not change a version without updating this file first.
- Use each tool only for what it is listed for.
- If the approved stack cannot meet a requirement, update this file — do not add a workaround tool in the code.
- Every tool listed here must map to a requirement in `PRD.md`.
- How the stack is wired together belongs in `ARCHITECTURE.md`, not here.
