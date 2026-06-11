# Step 7: README

**Output file:** `README.md`
**Depends on:** `PRODUCT.md` (Step 2), `PRD.md` (Step 3), `ARCHITECTURE.md` (Step 4), `TECH-STACK.md` (Step 5), `AI-TOOL-GUIDE.md` (Step 6)
**Required before:** wider repository sharing, onboarding, and declaring initiation complete

---

## Goal

Create `README.md` as the entry point for any developer — human or AI — picking up this project for the first time.

## Objective

This document gives a complete, accurate picture of the project: what it is, how to get it running, and how to work on it. It is written late because it summarizes everything locked in Steps 2–6. It must stay current — a stale README is worse than none.

## What This Document Covers

- **Project overview** — what the product does and why it exists (derived from `PRODUCT.md`)
- **Key concepts** — 3–5 terms or ideas a new developer must understand before reading the code (domain terms from `PRODUCT.md`; structural concepts from `ARCHITECTURE.md`)
- **Prerequisites** — exact tools, runtimes, and accounts required before setup (with version numbers)
- **Environment setup** — step-by-step instructions to configure `.env`; document every key in `.env.example` with a description, whether it is required or optional, and where to obtain the value (service dashboard, team wiki, etc.)
- **Install and run** — exact commands to install dependencies and start the app locally
- **Run tests** — exact commands to run the test suite
- **Project structure** — top-level folder map with one-line purpose per folder
- **Further reading** — `PRD.md` for requirements and feature scope; `ARCHITECTURE.md`, `TECH-STACK.md`, and `AI-TOOL-GUIDE.md` for deeper context on decisions

## Why This Matters

- Reduces onboarding friction — no tribal knowledge required to get started
- AI tools use README as primary context when CLAUDE.md or AI-TOOL-GUIDE.md are not present
- Serves as a project health signal — if README is hard to write, the setup is too complex

## Rules

- This step **replaces the boilerplate README** with the project's own. The boilerplate README's "Start Here" callout and scaffold content are removed here. By Step 7, the project is handoff-ready for sharing. Initiation is declared complete only after Step 8 is merged. The Project Initiation guides in `docs/guides/proj-init/` remain as the durable reference.
- Production implementation may already be in progress after Step 6; Step 7 is the handoff and sharing gate.
- Write README last. It documents what exists, not what you plan to build.
- Every command in README must be tested and working before it is committed.
- `.env.example` must list every environment variable the app reads — no undocumented keys.
- Do not duplicate content from `ARCHITECTURE.md` or `TECH-STACK.md` — link to them instead.
- If setup steps change, update README in the same commit.
- If any upstream document changes (`PRODUCT.md`, `PRD.MD`, `ARCHITECTURE.md`, `TECH-STACK.md`, `AI-TOOL-GUIDE.md`), reconcile README accordingly.
- README must be AI-readable: use clear section headings, avoid ambiguous prose, and include enough context for an AI agent to parse project state without reading any other file first.

## Reviewer checklist

Before approving the PR/MR, verify every item. An unchecked item is a reason to request changes.

- [ ] Every setup command was personally tested — it works from a clean environment without prior knowledge.
- [ ] Every environment variable is documented in `.env.example` with a description and where to obtain the value.
- [ ] Version numbers are present for all prerequisites (runtimes, tools, CLIs).
- [ ] Project structure section exists with a one-line purpose per top-level folder.
- [ ] Links to `PRD.md`, `ARCHITECTURE.md`, `TECH-STACK.md`, and `AI-TOOL-GUIDE.md` are present under Further reading.
- [ ] The boilerplate "Start Here" callout and scaffold content are fully removed.
