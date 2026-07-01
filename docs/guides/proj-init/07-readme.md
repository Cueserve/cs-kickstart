# Step-07: README

**Output file:** `README.md`
**Depends on:** `PRODUCT.md` (Step-02), `PRD.md` (Step-03), `ARCHITECTURE.md` (Step-04), `TECH-STACK.md` (Step-05), `AI-TOOL-GUIDE.md` (Step-06)
**Required before:** wider repository sharing, onboarding, and declaring initiation complete

---

## Goal

Create `README.md` as the entry point for any developer — human or AI — picking up this project for the first time.

## Objective

This document gives a complete, accurate picture of the project: what it is, how to get it running, and how to work on it. It is written late because it summarizes everything locked in Steps 2–6. It must stay current — a stale README is worse than none.

## What This Document Covers

Structure is fixed by the template — `docs/guides/proj-init/templates/README.template.md`. README is the header-block exception: the H1 is the project name and the top is the project pitch; the cross-document map is the **Further Reading** section, not the references table. The template owns the section headings and their order; this guide owns what each must contain. Fill every section; add or drop none.

1. **Project Overview** — what the product does and why it exists (derived from `PRODUCT.md`)
2. **Key Concepts** — 3–5 terms or ideas a new developer must understand before reading the code (domain terms from `PRODUCT.md`; structural concepts from `ARCHITECTURE.md`)
3. **Prerequisites** — exact tools, runtimes, and accounts required before setup (with version numbers)
4. **Environment Setup** — step-by-step instructions to configure `.env`; document every key in `.env.example` with a description, whether it is required or optional, and where to obtain the value (service dashboard, team wiki, etc.)
5. **Install & Run** — exact commands to install dependencies and start the app locally
6. **Run Tests** — exact commands to run the test suite
7. **Project Structure** — top-level folder map with one-line purpose per folder
8. **Further Reading** — `PRD.md` for requirements and feature scope; `ARCHITECTURE.md`, `TECH-STACK.md`, and `AI-TOOL-GUIDE.md` for deeper context on decisions

## Why This Matters

- Reduces onboarding friction — no tribal knowledge required to get started
- AI tools use README as primary context when CLAUDE.md or AI-TOOL-GUIDE.md are not present
- Serves as a project health signal — if README is hard to write, the setup is too complex

## Rules

- This step **writes the target repo's project README**, replacing whatever README the cloned repo currently has (a placeholder, template boilerplate, or an earlier draft). By Step-07, the project is handoff-ready for sharing. Initiation is declared complete only after Step-08 is merged. The Project Initiation guides live in this kit under `docs/guides/proj-init/` and remain as the durable reference — they are not part of the target repo.
- Production implementation may already be in progress after Step-06; Step-07 is the handoff and sharing gate.
- Write README last. It documents what exists, not what you plan to build.
- Every command in README must be tested and working before it is committed.
- `.env.example` must list every environment variable the app reads — no undocumented keys.
- Do not duplicate content from `ARCHITECTURE.md` or `TECH-STACK.md` — link to them instead.
- If setup steps change, update README in the same commit.
- If any upstream document changes (`PRODUCT.md`, `PRD.MD`, `ARCHITECTURE.md`, `TECH-STACK.md`, `AI-TOOL-GUIDE.md`), reconcile README accordingly.
- README must be AI-readable: use clear section headings, avoid ambiguous prose, and include enough context for an AI agent to parse project state without reading any other file first.

## Reviewer checklist

Before approving the PR/MR, verify every item. An unchecked item is a reason to request changes.

- [ ] Output matches `templates/README.template.md` — project pitch on top, all eight sections in order, and **Further Reading** present with links to `PRD.md`, `ARCHITECTURE.md`, `TECH-STACK.md`, and `AI-TOOL-GUIDE.md`; no top-level section added or removed, and no `[placeholder]` left unfilled.
- [ ] Every setup command was personally tested — it works from a clean environment without prior knowledge.
- [ ] Every environment variable is documented in `.env.example` with a description and where to obtain the value.
- [ ] Version numbers are present for all prerequisites (runtimes, tools, CLIs).
- [ ] Project structure section exists with a one-line purpose per top-level folder.
- [ ] Links to `PRD.md`, `ARCHITECTURE.md`, `TECH-STACK.md`, and `AI-TOOL-GUIDE.md` are present under Further reading.
- [ ] The target repo's prior/placeholder README content is fully replaced — no leftover boilerplate or template scaffolding remains.
