# Step 6: README

**Output file:** `README.md`
**Depends on:** `PRODUCT.md` (Step 1), `PRD.md` (Step 2), `ARCHITECTURE.md` (Step 3), `TECH-STACK.md` (Step 4), `AI-TOOL-GUIDE.md` (Step 5)
**Required before:** sharing the repository with anyone or starting active development

---

## Goal

Create `README.md` as the entry point for any developer — human or AI — picking up this project for the first time.

## Objective

This document gives a complete, accurate picture of the project: what it is, how to get it running, and how to work on it. It is written last because it summarizes everything locked in Steps 1–5. It must stay current — a stale README is worse than none.

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

- This step **replaces the boilerplate template README** with the project's own. The template README's "Starting a New Project?" callout and the dummy worked-example content are removed here — by Step 6 the initiation process is complete, so the boilerplate entry point is no longer needed. The Project Initiation guides in `docs/guides/proj-init/` remain as the durable reference.
- Write README last. It documents what exists, not what you plan to build.
- Every command in README must be tested and working before it is committed.
- `.env.example` must list every environment variable the app reads — no undocumented keys.
- Do not duplicate content from `ARCHITECTURE.md` or `TECH-STACK.md` — link to them instead.
- If setup steps change, update README in the same commit.
- If any upstream document changes (`PRODUCT.md`, `PRD.md`, `ARCHITECTURE.md`, `TECH-STACK.md`, `AI-TOOL-GUIDE.md`), reconcile README accordingly.
- README must be AI-readable: use clear section headings, avoid ambiguous prose, and include enough context for an AI agent to parse project state without reading any other file first.
