# Step 8: Initial Backlog

**Output file:** `BACKLOG.md` (manifest of created work items)
**Creates in host:** GitHub Issues or Azure DevOps work items
**Depends on:** `PRODUCT.md` (Step 2), `PRD.md` (Step 3), `README.md` (Step 7)
**Required before:** first sprint planning, development kickoff

---

## Goal

Translate the finalized `PRD.md` into an executable backlog — epics and stories created directly in the host's issue tracker, with `BACKLOG.md` as the permanent manifest and audit trail.

## Objective

This step closes the gap between project definition and execution. By the end, the team has a structured, prioritized backlog in their issue tracker and `BACKLOG.md` records every item created, with host IDs, so the manifest stays traceable back to PRD requirements.

## What This Document Covers

`BACKLOG.md` is a manifest, not a planning tool. It records:

- **Epics** — derived from product goals and feature areas in `PRODUCT.md`; each maps to one or more PRD features
- **Stories** — derived from PRD requirements; each story cites the PRD requirement ID(s) it fulfills
- **Host item IDs** — the issue number (GitHub) or work item ID (ADO) assigned at creation; `PENDING` if no CLI was available
- **Priority** — Must/Should/Could (MoSCoW) inherited directly from the PRD
- **Acceptance criteria** — copied or summarized from the PRD; not rewritten
- **Out-of-scope note** — any PRD item deliberately excluded from the initial backlog, with reason

## Why This Matters

- `README.md` ends initiation. Without Step 8, the first action after initiation is "where do we start?" — this step answers that.
- Work items in the tracker are the team's daily operating surface; a doc nobody reads is not a backlog.
- Traceability from code → story → PRD requirement → product goal closes the loop on the entire initiation chain.

## Rules

- Do not invent requirements. Every epic and story must trace to `PRODUCT.md` or `PRD.md`.
- Do not refine or change requirements during this step. If a gap is discovered, flag it for a `/update-doc PRD.md` — do not patch it here.
- Acceptance criteria are copied from the PRD, not rewritten. The PRD is the source of truth.
- `BACKLOG.md` must record the host item ID for every created item. If the host CLI is unavailable, record items as `PENDING` and note that manual creation is required.
- Epics first, then stories under them. Do not create stories without a parent epic.
- One story per PRD requirement item. Do not batch multiple requirements into one story.
- Labels: apply `epic` to epics, `story` to stories. Apply a priority label (`priority:must` / `priority:should` / `priority:could`) to every item — or the equivalent priority field in ADO.
- This step does not plan sprints, assign owners, or estimate effort. That happens in sprint planning — not here.

## Reviewer checklist

Before approving the PR/MR, verify every item. An unchecked item is a reason to request changes.

- [ ] Every epic maps to a product goal or feature area in `PRODUCT.md`.
- [ ] Every story cites the PRD requirement ID(s) it fulfills.
- [ ] Every item in `BACKLOG.md` has a host item ID or is explicitly marked `PENDING` with a reason.
- [ ] No story exists without a parent epic.
- [ ] No new requirements were invented — all items trace to `PRODUCT.md` or `PRD.md`.
- [ ] Acceptance criteria match the PRD and were not rewritten.
- [ ] Out-of-scope exclusions are documented with a reason.
- [ ] Priority labels / fields are applied on every host item.
