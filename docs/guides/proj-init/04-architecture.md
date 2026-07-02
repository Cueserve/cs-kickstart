# Step-04: Architecture

**Output file:** `docs/ARCHITECTURE.md`
**Depends on:** `docs/PRD.md` (Step-03)
**Required before:** Step-05 (Tech Stack)

---

## Goal

Create `ARCHITECTURE.md` to translate the requirements in `PRD.md` into implementable system design that defines how the system is organized and how its parts work together.

## Objective

This document defines how the product is structured: components, data flow, and structural decisions that satisfy `PRD.md`. It is the team's build blueprint. It captures structure and decisions — not line-by-line code, and not the stack inventory (that is `TECH-STACK.md`).

## What This Document Covers

Structure is fixed by the template — `docs/guides/proj-init/templates/ARCHITECTURE.template.md`. The template owns the section headings and their order; this guide owns what each section must contain. Fill every section; add or drop none.

1. **System Architecture** — high-level breakdown of components, modules, or services and how they connect, with at least one diagram
2. **Data Design** — core entities, schema/storage layout, and how data flows
3. **Data Flow & Interactions** — how data moves between components and external systems
4. **Key Design Decisions** — important structural choices (layering, sync vs async, service boundaries, etc.) and their rationale; technology selection lives in `TECH-STACK.md`
5. **Implementation Conventions** — patterns, standards, and structural rules developers must follow (how to build, not the code itself)
6. **Integration Points** — how the system connects with APIs, services, or dependencies
7. **Security Posture & Data Classification** — what data the system handles and its sensitivity level (public / internal / confidential / restricted); auth and authorization model; encryption at rest and in transit approach; trust boundaries and network exposure; compliance requirements from `PRD.md` (GDPR, HIPAA, SOC 2, etc.) and how the architecture satisfies them; known threat vectors the design must account for
8. **Non-Functional Approach** — how remaining `PRD.md` non-functional requirements (scale, performance, availability, resilience) are met structurally

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

- [ ] Output matches the template skeleton (`templates/ARCHITECTURE.template.md`) — header block, all eight sections in order, and the references table present; no top-level section added or removed, and no `[placeholder]` left unfilled.
- [ ] Every major component is named and its responsibility is clearly described.
- [ ] At least one diagram is present (text diagram is acceptable; whitebox or sequence diagram preferred).
- [ ] Every key design decision includes a rationale — not just "we chose X" but "we chose X because Y".
- [ ] Every structural choice traces to at least one requirement in `PRD.md` — no gold-plating.
- [ ] A security posture and data classification section is present: data sensitivity levels are named, the auth/authz model is described, encryption approach (at rest and in transit) is stated, and trust boundaries are explicit.
- [ ] Any compliance requirements from `PRD.md` are named and the architectural response to each is described — not deferred.
- [ ] Non-functional requirements from `PRD.md` (performance, scale, availability) are addressed structurally.
- [ ] No technology inventory (that belongs in `TECH-STACK.md`) and no code.
