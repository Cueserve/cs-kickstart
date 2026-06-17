# Step 3: Product Requirements Document (PRD)

**Output file:** `PRD.md`
**Depends on:** `PRODUCT.md` (Step 2)
**Required before:** Step 4 (Architecture) and Step 5 (Tech Stack)

---

## Goal

Create `PRD.md` to translate the concept in `PRODUCT.md` into detailed, actionable requirements that define what to build and guide design, architecture, and development.

## Objective

This document specifies exactly what the product must do: a single detailed specification with precise, testable requirements. It lets the team build without ambiguity. No implementation details belong here.

## What This Document Covers

Structure is fixed by the template — `docs/guides/proj-init/templates/PRD.template.md`. The template owns the section headings and their order; this guide owns what each section must contain. Fill every section; add or drop none.

1. **Overview** — what the product is, why it exists, and the core goals it serves; a concise reference anchored to `PRODUCT.md`
2. **Target Users** — who the product is for, refined into actionable personas or usage contexts for requirement clarity
3. **Problem Statements** — specific definitions of the problems being solved, directly tied to user needs, and used to justify every feature included
4. **Features / Capabilities** — the discrete things the product does (major features expanded from `PRODUCT.md`), each clearly named and described in terms of user value
5. **User Stories** — structured as "As a [user], I want [action] so that [outcome]," ensuring every feature maps back to real user needs
6. **Functional Requirements** — exact system behaviors, rules, workflows, and logic required to implement each feature
7. **Non-Functional Requirements** — measurable quality attributes such as performance, security, scalability, availability, and compliance (stated as requirements, not solutions)
8. **Acceptance Criteria** — clear, testable conditions that define when each requirement is complete; the operational definition of "done," tied to success criteria in `PRODUCT.md`
9. **Out of Scope (This Release)** — explicit exclusions at the feature and requirement level for the current version, refining the broader scope boundaries defined in `PRODUCT.md`
10. **Dependencies & Assumptions** — external systems, services, integrations, teams, and conditions assumed to be true that impact delivery or correctness
11. **Constraints (Non-Architectural)** — business, legal, regulatory, or operational limits that shape requirements without dictating implementation design
12. **Risks & Edge Cases** — known uncertainties, failure scenarios, and atypical user/system behaviors that must be considered during implementation

## Why This Matters

- Design and code cannot start from concept alone — they need concrete requirements
- Acceptance criteria make "done" objective instead of opinion
- One agreed requirement list eliminates the "I thought we were building X" problem

## Rules

- `PRD.md` derives from `PRODUCT.md`. If `PRODUCT.md` changes, reconcile this document.
- Requirements only — no architecture, stack, or implementation details.

## Reviewer checklist

Before approving the PR/MR, verify every item. An unchecked item is a reason to request changes.

- [ ] Output matches the template skeleton (`templates/PRD.template.md`) — header block, all twelve sections in order, and the references table present; no top-level section added or removed, and no `[placeholder]` left unfilled.
- [ ] Every requirement has a unique ID (e.g. `PRD-001`, `PRD-002`).
- [ ] Every requirement has explicit acceptance criteria — "done" is objectively verifiable, not a matter of opinion.
- [ ] Every user story follows the "As a [user], I want [action] so that [outcome]" structure — no orphaned features.
- [ ] Non-functional requirements state numbers, not adjectives ("responds in under 200ms", not "fast").
- [ ] Out-of-scope items for this release are explicit, not implied.
- [ ] No implementation, architecture, or stack details — requirements only.
- [ ] Every feature traces back to a problem statement or user need in `PRODUCT.md`.
