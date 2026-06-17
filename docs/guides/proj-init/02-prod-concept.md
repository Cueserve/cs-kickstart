# Step 2: Product Concept

**Output file:** `PRODUCT.md`
**Depends on:** nothing — this is the starting point
**Required before:** Step 3 (PRD)

---

## Goal

Create `PRODUCT.md` to clarify what the project is all about.

## Objective

This document explains what we are building and why. It is the single place anyone checks to understand the project.

## What This Document Covers

Structure is fixed by the template — `docs/guides/proj-init/templates/PRODUCT.template.md`. The template owns the section headings and their order; this guide owns what each section must contain. Fill every section; add or drop none.

1. **Overview** — what the product is, why it exists, and the core goals it serves
2. **Target Users** — who this is for; the people whose problem we are solving
3. **Purpose** — why this project exists and the problem it solves
4. **Scope (In / Out)** — what we are building and, explicitly, what we are not; the boundary that stops scope creep
5. **Success Criteria** — what "good" looks like; how we will know it is working
6. **Anti-Patterns** — what to avoid building or doing; approach/behaviour guardrails, not feature exclusions (those live in Scope)

## Why This Matters

- Everyone works from the same understanding — no conflicting versions or guesswork
- Every later decision (design, architecture, code) traces back to this document

## Rules

- If the concept changes, update `PRODUCT.md` first before touching designs, code, or anything else.
- After updating `PRODUCT.md`, reconcile `PRD.md` and all documents downstream.

## Reviewer checklist

Before approving the PR/MR, verify every item. An unchecked item is a reason to request changes.

- [ ] Output matches the template skeleton — header block, all six sections in order, and the references table present; no top-level section added or removed, and no `[placeholder]` left unfilled.
- [ ] Target users are specific — not "anyone" or "all users"; a real person with a real problem.
- [ ] Scope explicitly lists what is **not** being built — not just what is.
- [ ] Success criteria are measurable — you could verify them without asking the author.
- [ ] Anti-patterns are approach/behaviour guardrails, not feature exclusions (those belong in Scope).
- [ ] Nothing in this document dictates implementation, architecture, or tech choices.
