# Step 3: Architecture

**Output file:** `ARCHITECTURE.md`
**Depends on:** `PRD.md` (Step 2)
**Required before:** Step 4 (Tech Stack), and before development begins

---

## Goal

Create `ARCHITECTURE.md` to translate the requirements in `PRD.md` into implementable system design that defines how the system is organized and how its parts work together.

## Objective

This document defines how the product is structured: components, data flow, and structural decisions that satisfy `PRD.md`. It is the team's build blueprint. It captures structure and decisions — not line-by-line code, and not the stack inventory (that is `TECH-STACK.md`).

## What This Document Covers

- **System architecture** — high-level breakdown of components, modules, or services and how they connect, with at least one diagram
- **Data design** — core entities, schema/storage layout, and how data flows
- **Data flow and interactions** — how data moves between components and external systems
- **Key design decisions** — important structural choices (layering, sync vs async, service boundaries, etc.) and their rationale; technology selection lives in `TECH-STACK.md`
- **Implementation conventions** — patterns, standards, and structural rules developers must follow (how to build, not the code itself)
- **Integration points** — how the system connects with APIs, services, or dependencies
- **Non-functional approach** — how `PRD.md` non-functional requirements (security, scale, performance, availability, etc.) are met structurally

## Why This Matters

- Everyone builds against the same structure — no improvised architectures
- Structural decisions are recorded with reasoning, so changes are made with awareness of what they overturn
- It is what the dev team and AI guidance files (`AI-TOOL-GUIDE.md`, `CLAUDE.md`, and `.github/copilot-instructions.md`) reference when writing code

## Rules

- `ARCHITECTURE.md` derives from `PRD.md`; it translates requirements into structure.
- Every structural choice traces to a requirement — no gold-plating.
- Structure and decisions only — no code, no stack inventory.
- Reference technology choices in `TECH-STACK.md`, do not duplicate them here.
- If `PRD.md` changes, reconcile this document.
- If structural changes are needed, update this document before modifying code.

## Reviewer checklist

Before approving the PR/MR, verify every item. An unchecked item is a reason to request changes.

- [ ] Every major component is named and its responsibility is clearly described.
- [ ] At least one diagram is present (text diagram is acceptable; whitebox or sequence diagram preferred).
- [ ] Every key design decision includes a rationale — not just "we chose X" but "we chose X because Y".
- [ ] Every structural choice traces to at least one requirement in `PRD.md` — no gold-plating.
- [ ] Non-functional requirements from `PRD.md` (performance, security, scale) are addressed structurally.
- [ ] No technology inventory (that belongs in `TECH-STACK.md`) and no code.
