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

- **Overview** — what the product is, why it exists, and the core goals it serves
- **Target users** — who this is for; the people whose problem we are solving
- **Purpose** — why this project exists and the problem it solves
- **Scope (in/out)** — what we are building and, explicitly, what we are not; the boundary that stops scope creep
- **Success criteria** — what "good" looks like; how we will know it is working
- **Anti-patterns** — what to avoid building or doing; approach/behavior guardrails, not feature exclusions (those live in Scope)

## Why This Matters

- Everyone works from the same understanding — no conflicting versions or guesswork
- Every later decision (design, architecture, code) traces back to this document

## Rules

- If the concept changes, update `PRODUCT.md` first before touching designs, code, or anything else.
- After updating `PRODUCT.md`, reconcile `PRD.md` and all documents downstream.

## Reviewer checklist

Before approving the PR/MR, verify every item. An unchecked item is a reason to request changes.

- [ ] All six sections are present: Overview, Target users, Purpose, Scope, Success criteria, Anti-patterns.
- [ ] Target users are specific — not "anyone" or "all users"; a real person with a real problem.
- [ ] Scope explicitly lists what is **not** being built — not just what is.
- [ ] Success criteria are measurable — you could verify them without asking the author.
- [ ] Anti-patterns are approach/behaviour guardrails, not feature exclusions (those belong in Scope).
- [ ] Nothing in this document dictates implementation, architecture, or tech choices.
