# Step-08: Initial Backlog

**Output file:** `BACKLOG.md` (manifest of created work items)
**Creates in host:** GitHub Issues or Azure DevOps work items
**Depends on:** `PRODUCT.md` (Step-02), `PRD.md` (Step-03), `ARCHITECTURE.md` (Step-04), `TECH-STACK.md` (Step-05), `README.md` (Step-07)
**Required before:** first sprint planning, development kickoff

---

## Goal

Translate the finalized `PRD.md` into an executable backlog — epics and stories created directly in the host's issue tracker, with `BACKLOG.md` as the permanent manifest and audit trail.

## Objective

This step closes the gap between project definition and execution. By the end, the team has a structured, prioritized backlog in their issue tracker and `BACKLOG.md` records every item created, with host IDs, so the manifest stays traceable back to PRD requirements.

## What This Document Covers

`BACKLOG.md` is a manifest, not a planning tool. Structure is fixed by the template — `docs/guides/proj-init/templates/BACKLOG.template.md`. The template owns the section headings and their order; this guide owns what each section must contain. Fill every section; add or drop none.

1. **Summary** — epic count, story count, and the Must/Should/Could priority breakdown for the created backlog
2. **Epics** — derived from product goals and feature areas in `PRODUCT.md`; each maps to one or more PRD features and records its host item ID (`PENDING` if no CLI was available)
3. **Stories** — derived from PRD requirements; each cites the PRD requirement ID(s) it fulfills, its parent epic, MoSCoW priority, host item ID, and acceptance criteria copied (not rewritten) from the PRD
4. **Out-of-Scope Notes** — any PRD item deliberately excluded from the initial backlog, with reason

## Why This Matters

- `README.md` makes the project handoff-ready; this backlog is the last document produced (Step-09 then finalizes `CONTRIBUTING.md`). Without Step-08, the first action after initiation is "where do we start?" — this step answers that.
- Work items in the tracker are the team's daily operating surface; a doc nobody reads is not a backlog.
- Traceability from code → story → PRD requirement → product goal closes the loop on the entire initiation chain.

## Rules

- Do not invent requirements. Every epic and story must trace to `PRODUCT.md` or `PRD.md`.
- Load `ARCHITECTURE.md`, `TECH-STACK.md`, and `README.md` for context and readiness checks only. Do not derive new backlog scope from them.
- Do not refine or change requirements during this step. If a gap is discovered, flag it for a `/proj-init-doc-update PRD.md` — do not patch it here.
- Acceptance criteria are copied from the PRD, not rewritten. The PRD is the source of truth.
- `BACKLOG.md` must record the host item ID for every created item. If the host CLI is unavailable, record items as `PENDING` and note that manual creation is required.
- Epics first, then stories under them. Do not create stories without a parent epic.
- One story per PRD requirement item. Do not batch multiple requirements into one story.
- Labels: apply `epic` to epics, `story` to stories. Apply a priority label (`priority:must` / `priority:should` / `priority:could`) to every item — or the equivalent priority field in ADO.
- This step does not plan sprints, assign owners, or estimate effort. That happens in sprint planning — not here.

## Reviewer checklist

Before approving the PR/MR, verify every item. An unchecked item is a reason to request changes.

- [ ] Output matches the template skeleton (`templates/BACKLOG.template.md`) — header block, all four sections in order, and the references table present; no top-level section added or removed, and no `[placeholder]` left unfilled.
- [ ] Every epic maps to a product goal or feature area in `PRODUCT.md`.
- [ ] Every story cites the PRD requirement ID(s) it fulfills.
- [ ] Every item in `BACKLOG.md` has a host item ID or is explicitly marked `PENDING` with a reason.
- [ ] No story exists without a parent epic.
- [ ] No new requirements were invented — all items trace to `PRODUCT.md` or `PRD.md`.
- [ ] Acceptance criteria match the PRD and were not rewritten.
- [ ] Out-of-scope exclusions are documented with a reason.
- [ ] Priority labels / fields are applied on every host item.
