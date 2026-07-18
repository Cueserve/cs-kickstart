# Step-07: README

**Output file:** `README.md` (repo root)
**Depends on:** `docs/PRODUCT.md` (Step-02), `docs/PRD.md` (Step-03), `docs/ARCHITECTURE.md` (Step-04), `docs/TECH-STACK.md` (Step-05), `docs/AI-TOOL-GUIDE.md` (Step-06)
**Required before:** wider repository sharing, onboarding, and declaring initiation complete

---

## Goal

Create `README.md` as the entry point for any developer — human or AI — picking up this project for the first time.

## Objective

This document gives a complete, accurate picture of the project: what it is, how to get it running, and how to work on it. It is written late because it summarizes everything locked in Steps 2–6. It must stay current — a stale README is worse than none.

## What This Document Covers

Structure is fixed by the template — `docs/guides/proj-init/templates/README.template.md`. README is the header-block exception: the H1 is the project name, directly under it a vision tagline and a tech-stack badge row, and the cross-document map is the **Further Reading** section, not the references table. The template owns the section headings and their order; this guide owns what each must contain. Fill every section; add or drop none.

1. **Tagline & badges** — directly under the H1: a blockquote tagline that is a **verbatim copy** of the Vision line from `PRODUCT.md` §1 Overview (no paraphrase), followed by a badge row with one static shields.io badge per core technology — each Language & Framework in `TECH-STACK.md` §1 that a developer directly installs or invokes, plus the primary platform in §3. A platform-managed runtime — one the §3 platform provides rather than the developer installing it — is covered by the platform badge and gets no separate badge.
2. **Project Overview** — a **condensed** 3–4 sentence cold-start summary for a developer, then a link to `PRODUCT.md` as the source of truth. Summarize; do not restate `PRODUCT.md` in full.
3. **Key Concepts** — a developer glossary: 3–5 terms or ideas a new developer must understand before reading the code. Draw **primarily on structural concepts from `ARCHITECTURE.md`** (components, boundaries, data flow, key patterns), plus only the few unavoidable domain nouns from `PRODUCT.md` §1 Description / §2 Target Users. **Do not** restate the capability areas from `PRODUCT.md` §3 Features — that section is a product/business capability list, not a glossary.
4. **Prerequisites** — exact tools, runtimes, and accounts required before setup (with version numbers)
5. **Environment Setup** — step-by-step instructions to configure `.env`; document every key in `.env.example` with a description, whether it is required or optional, and where to obtain the value (service dashboard, team wiki, etc.)
6. **Install & Run** — exact commands to install dependencies and start the app locally
7. **Run Tests** — exact commands to run the test suite
8. **Project Structure** — top-level folder map with one-line purpose per folder
9. **Further Reading** — `docs/PRD.md` for requirements and feature scope; `docs/ARCHITECTURE.md`, `docs/TECH-STACK.md`, and `docs/AI-TOOL-GUIDE.md` for deeper context on decisions

## Why This Matters

- Reduces onboarding friction — no tribal knowledge required to get started
- AI tools use README as primary context when CLAUDE.md or AI-TOOL-GUIDE.md are not present
- Serves as a project health signal — if README is hard to write, the setup is too complex

## Rules

- This step **writes the target repo's project README**, replacing whatever README the cloned repo currently has (a placeholder, template boilerplate, or an earlier draft). By Step-07, the project is handoff-ready for sharing. Initiation is declared complete only after Step-09 is merged (Step-08 seeds the backlog; Step-09 finalizes `CONTRIBUTING.md`). The Project Initiation guides live in this kit under `docs/guides/proj-init/` and remain as the durable reference — they are not part of the target repo.
- Production implementation may already be in progress after Step-06; Step-07 is the handoff and sharing gate.
- Write README last. It documents what exists, not what you plan to build.
- **Detect scaffold mode first, and announce it.** Check whether `package.json` exists on the target's `main` (`git -C "$TARGET" show main:package.json`). This kit is docs-first — Step-07 can legitimately run before the application is scaffolded, so the setup sections have two modes:
  - **Scaffolded** (`package.json` present): every setup command MUST be tested and working before commit, and `.env.example` MUST be reconciled against the real file in the repo — no undocumented keys.
  - **Docs-first** (no `package.json`): the app is not yet scaffolded, so no command can be run. Write **Prerequisites**, **Environment Setup**, **Install & Run**, and **Run Tests** from `TECH-STACK.md` as the *intended* setup. Each of those four sections MUST open with the marker `> **Pending scaffold — unverified.** …`. Commands MUST NOT be presented as tested. `.env.example` keys are derived from `TECH-STACK.md` §6 and flagged for reconciliation when the scaffold lands. This is a sanctioned path, not an override — the mode is recorded in the PR summary so the reviewer applies the matching checklist branch.
- Do not duplicate content from `ARCHITECTURE.md` or `TECH-STACK.md` — link to them instead.
- If setup steps change, update README in the same commit.
- If any upstream document changes (`PRODUCT.md`, `PRD.MD`, `ARCHITECTURE.md`, `TECH-STACK.md`, `AI-TOOL-GUIDE.md`), reconcile README accordingly.
- README must be AI-readable: use clear section headings, avoid ambiguous prose, and include enough context for an AI agent to parse project state without reading any other file first.

## Reviewer checklist

Before approving the PR/MR, verify every item. An unchecked item is a reason to request changes.

- [ ] Output matches `templates/README.template.md` — vision tagline and tech-stack badge row directly under the H1, all nine sections in order, and **Further Reading** present with links to `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/TECH-STACK.md`, and `docs/AI-TOOL-GUIDE.md`; no top-level section added or removed, and no `[placeholder]` left unfilled.
- [ ] Tagline under the H1 is a **verbatim copy** of the Vision line from `PRODUCT.md` §1 (not paraphrased), and the badge row covers the core stack — each developer-installed Language & Framework from `TECH-STACK.md` §1 plus the primary platform from §3; platform-managed runtimes are not badged separately.
- [ ] Project Overview is a condensed summary (not a full restatement of `PRODUCT.md`) and links to `PRODUCT.md`.
- [ ] **Key Concepts is a developer glossary** — terms are structural concepts (from `ARCHITECTURE.md`) plus a few unavoidable domain nouns; it does **not** restate the capability areas from `PRODUCT.md` §3 Features.
- [ ] **Scaffold mode is stated in the PR summary**, and the setup sections match it:
  - **Scaffolded:** every setup command was personally tested — it works from a clean environment without prior knowledge — and every environment variable is documented in `.env.example` with a description and where to obtain the value.
  - **Docs-first:** Prerequisites, Environment Setup, Install & Run, and Run Tests each carry the `Pending scaffold — unverified` marker; no command is presented as tested; every documented env key traces to `TECH-STACK.md` §6.
- [ ] Version numbers are present for all prerequisites (runtimes, tools, CLIs).
- [ ] Project structure section exists with a one-line purpose per top-level folder.
- [ ] Links to `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/TECH-STACK.md`, and `docs/AI-TOOL-GUIDE.md` are present under Further reading.
- [ ] The target repo's prior/placeholder README content is fully replaced — no leftover boilerplate or template scaffolding remains.
