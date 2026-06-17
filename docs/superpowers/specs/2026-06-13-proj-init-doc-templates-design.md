# Design: Standardized Output Templates for Project-Initiation Documents

**Date:** 2026-06-13
**Owner:** Architect (cs-kickstart maintainer)
**Status of this spec:** approved for planning

---

## 1. Problem

The project-initiation **guides** in `docs/guides/proj-init/` are well-standardized, but the **documents they generate** (`PRODUCT.md`, `PRD.md`, `ARCHITECTURE.md`, …) have no enforced output template. Structure is inferred by the AI from the prose bullets under each guide's "What This Document Covers." Two consequences:

1. **No shared envelope** — nothing guarantees every generated doc carries the same header metadata or a cross-document reference map.
2. **No literal headings** — heading text and order drift project-to-project, because the guides describe sections in prose rather than fixing them.

The reference pattern the maintainer wants to adopt lives in `D:\repo-cuevik\PractitionerPRO\tools\templates\docs\` (self-contained fill-in-the-blanks markdown templates with a header block, a document-hierarchy table, numbered sections, and `[placeholders]`).

## 2. Goal

Introduce one standardized, self-contained markdown **template per generated document**, wired into the existing shared runner so every project produced through proj-init emits documents with consistent structure — **without** discarding cs-kickstart's existing (more disciplined) section content model, and **without** importing PractitionerPRO conventions that conflict with cs-kickstart governance.

## 3. Decisions locked during brainstorming

| Decision | Choice | Rationale |
|---|---|---|
| Where templates live | **Separate template files**, one per doc | Mirrors the PractitionerPRO model; cleanest separation; doubles as a concrete skeleton for the "any other AI tool" path |
| Section content | **Keep cs-kickstart's existing section sets** | They already enforce traceability (unique `PRD-001` IDs, every feature maps to a problem, NFRs as numbers). Standardize *format*, not taxonomy. |
| Header block | **Lean** — Owner, Last updated, source-of-truth banner, references | Drops `Status` and `Version` because merge-to-`main` IS status/version in cs-kickstart (`_overview.md:49`: "No draft files, no status flags"). Those fields would rot. |
| Format elements adopted from PractitionerPRO | Numbered `## N.` headings, `[placeholders]`, tables for structured data, `---` dividers, TOC for long docs, document-references table, a shared writing-rules file | The genuinely-good scannability bones |
| Format elements rejected | `Status: Draft`, `Version: 1.0`, copy-by-script scaffolding | Conflict with the merge-is-final governance and the interview-driven generation model |

## 4. File layout

```text
docs/guides/proj-init/templates/
├── _writing-rules.md          # shared: tone, MUST/SHOULD/MAY, measurability, metadata, MoSCoW priority scale
├── README.md                  # what these templates are; how the runner consumes them
├── PRODUCT.template.md         (full skeleton)
├── PRD.template.md             (full skeleton + TOC)
├── ARCHITECTURE.template.md    (full skeleton + TOC)
├── TECH-STACK.template.md      (full skeleton)
├── README.template.md          (full skeleton — header-block exception, see §6)
├── AI-TOOL-GUIDE.template.md   (covers AI-TOOL-GUIDE.md only; adapters excluded)
└── BACKLOG.template.md         (manifest skeleton — table/host-ID driven)
```

## 5. Standard template anatomy

Every template (except the README exception in §6) opens with this block, then the numbered sections for that document.

```markdown
# <DOC>.md — <Document Title>

**Owner:** <owner role from _steps.yml>
**Last updated:** <YYYY-MM-DD>
**Source of truth for:** <one-line scope>

> Derived from: <upstream docs, or "(none — starting point)">
> Downstream: <docs that depend on this one>

## Document References

| # | Document | Role |
| - | -------- | ---- |
| 1 | PRODUCT.md | What we are building and why |
| 2 | PRD.md | Testable requirements |
| 3 | ARCHITECTURE.md | System structure & design decisions |
| 4 | TECH-STACK.md | Approved technologies & usage rules |
| 5 | AI-TOOL-GUIDE.md | Rules & constraints for AI tools |
| 6 | README.md | Setup, env config, how to run |
| 7 | BACKLOG.md | Epics/stories manifest |

---

## 1. <Section> …
```

- `Derived from` / `Downstream` are filled from the step's `upstream` field and the steps that list this doc as upstream, in `_steps.yml`.
- The `Document References` table is a constant block (the proj-init set is fixed at 7 docs; rename/add is rare and changes the templates).
- `---` dividers separate sections. Structured content (requirements, trade-offs, risks) uses tables. TOC is included only where flagged below.

## 6. Per-document section maps

Headings below are the **canonical structure** each template enforces. They are derived 1:1 from each guide's current "What This Document Covers."

### PRODUCT.template.md (full)

1. Overview
2. Target Users
3. Purpose
4. Scope (In / Out)
5. Success Criteria
6. Anti-Patterns

### PRD.template.md (full, **with TOC**)

1. Overview
2. Target Users
3. Problem Statements
4. Features / Capabilities
5. User Stories
6. Functional Requirements *(table: ID, requirement, priority)*
7. Non-Functional Requirements
8. Acceptance Criteria *(table: requirement ID, acceptance criteria)*
9. Out of Scope (This Release)
10. Dependencies & Assumptions
11. Constraints (Non-Architectural)
12. Risks & Edge Cases *(table: risk, impact, handling)*

### ARCHITECTURE.template.md (full, **with TOC**)

1. System Architecture *(requires ≥1 diagram)*
2. Data Design
3. Data Flow & Interactions
4. Key Design Decisions *(table: decision, choice, rationale)*
5. Implementation Conventions
6. Integration Points
7. Security Posture & Data Classification
8. Non-Functional Approach

### TECH-STACK.template.md (full)

1. Languages & Frameworks *(table: tech, version, reason, maps-to PRD req)*
2. Datastores
3. Cloud & Infrastructure Services
4. Key Libraries / Tools
5. Selection Trade-offs *(table: choice, alternatives rejected, why)*
6. Versions & Constraints

### README.template.md (full — **header-block exception**)
The lean metadata block does **not** sit at the top of README (the H1 is the project name and the top is the project pitch). README keeps its existing structure; the cross-doc map is its own **Further Reading** section, not the references table. An optional one-line `_Maintained by · Last updated_` footer may sit at the bottom.

1. Project Overview
2. Key Concepts
3. Prerequisites
4. Environment Setup
5. Install & Run
6. Run Tests
7. Project Structure
8. Further Reading

### AI-TOOL-GUIDE.template.md (covers the main doc only)

1. Project Context
2. Coding Conventions
3. Scope Boundaries
4. Banned Patterns
5. Testing Rules
6. Documentation Rules
7. Decision Escalation
8. Agent Behavior Rules
9. Off-Limits Boundaries
10. Workflow Conventions

Adapter files (`CLAUDE.md`, `.github/copilot-instructions.md`) are **not** templated here — they carry the preserved INITIATION-RUNNER block and tool-specific config governed by `_steps.yml` special actions.

### BACKLOG.template.md (manifest)

1. Summary *(epic count, story count, priority breakdown)*
2. Epics *(table: Epic ID, Title, maps-to PRODUCT goal, host ID)*
3. Stories *(table: Story ID, parent Epic, PRD req ID(s), priority, host ID, acceptance criteria)*
4. Out-of-Scope Notes *(item + reason)*

`PENDING` host IDs are permitted per the Step 8 host-CLI fallback.

## 7. Excluded from templating

| Artifact | Why excluded |
|---|---|
| `CONTRIBUTING.md` | Appended layers (Step 1 governance + Step 5 tooling), not a from-scratch doc — a header block would fight the existing file head |
| `CLAUDE.md`, `.github/copilot-instructions.md` | Tool config with preserved blocks (INITIATION-RUNNER), not narrative docs |

## 8. Wiring into the existing system

1. **`_steps.yml`** — add a `template:` field to each document-producing step pointing at its template file (e.g. `template: docs/guides/proj-init/templates/PRODUCT.template.md`).
2. **`_run-step.md` §4 "Produce The Output"** — add one rule: *"Load the step's `template`. Produce the output by filling it — preserve its header block, section headings, references table, and dividers; replace `[placeholders]` with interview answers. Do not add or drop top-level sections."*
3. **Each step guide** — trim "What This Document Covers" to a one-line-per-section map that points at the template as the structure contract. The guide keeps **intent, interview questions, rules, reviewer checklist**; it stops re-listing headings as prose.
4. **Reviewer checklists** — add one item to each templated step: *"Output matches the template skeleton — header block, all sections, and references table present; no top-level sections added or removed."*
5. **`_writing-rules.md`** — referenced from `_run-step.md` as shared guidance applied to every generated doc (tone, MUST/SHOULD/MAY, measurable requirements, define-acronyms-on-first-use, metadata expectations, priority scale — **MoSCoW: Must / Should / Could**, the single source PRD §6 and BACKLOG inherit).
6. **Markdownlint compliance** — every template (and therefore every generated doc) MUST pass this repo's markdownlint config. Observed active rules: MD060 (padded table pipes), MD040 (fenced blocks need a language), MD022 (blanks around headings), MD032 (blanks around lists). The template skeletons must be lint-clean as authored, since generated docs inherit their structure.

## 9. Drift control (the one real risk)

Two files now describe sections (template + guide) and could diverge. The rule that prevents it:

> **Template owns *structure* (the literal headings). Guide owns *meaning* (what each section must contain), one-to-one with the template's headings. The guide never re-lists headings as prose; the reviewer check enforces the template was followed.**

## 10. Out of scope

- No change to the five-move branch→PR→merge workflow.
- No change to `doc-status` / `doc-update` behavior (they continue to operate on the same files; they may *benefit* from the header block later, but that is not part of this work).
- No scaffolding/copy script (cs-kickstart generates by interview, not by file copy).
- No retro-fitting of already-generated documents in downstream project repos.

## 11. Impact surface

~18 files: 7 templates + `_writing-rules.md` + templates `README.md` + `_steps.yml` + `_run-step.md` + 7 guide trims (steps 2–8; the README guide is also edited for the header-block exception). Tool adapters under `.claude/commands/` and `.github/prompts/` are thin and should need **no** change — they already defer to the shared runner.
