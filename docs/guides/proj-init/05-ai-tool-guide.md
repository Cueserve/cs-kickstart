# Step 5: AI Tool Guide

**Output file:** `AI-TOOL-GUIDE.md` + `CLAUDE.md` + `.github/copilot-instructions.md`
**Depends on:** `TECH-STACK.md` (Step 4)
**Required before:** any code or agent work begins

---

## Goal

Create `AI-TOOL-GUIDE.md` as the single source of truth for how AI tools must behave on this project, then wire it into each tool's native config file.

## Objective

This document defines the rules, constraints, and conventions that guide AI assistants (Claude Code, GitHub Copilot, or any future tool) working on this project. Rules live in one place — `AI-TOOL-GUIDE.md` — to prevent drift between tools. Each tool gets a thin adapter file that points to it.

## Structure

``` Text
AI-TOOL-GUIDE.md                       ← all rules live here
CLAUDE.md                              ← Claude Code adapter (references AI-TOOL-GUIDE.md + Claude-specific config)
.github/copilot-instructions.md        ← Copilot adapter (mirrors or references AI-TOOL-GUIDE.md content)
```

## What This Document Covers

- **Project context** — brief summary of what the project is and the tech stack in use
- **Coding conventions** — naming, formatting, file structure rules for this project
- **Scope boundaries** — what AI tools are and are not allowed to touch
- **Banned patterns** — things AI must never generate or suggest (e.g., mocks, certain libs, anti-patterns flagged in ARCHITECTURE.md)
- **Testing rules** — how tests must be written; what counts as a valid test
- **Documentation rules** — when and how to comment; what to leave out
- **Decision escalation** — explicit criteria for when AI must stop and get approval: new package additions, schema/migration changes, auth-related code, breaking API changes, anything touching CI/CD or deployment config

## Agent Behavior Rules

These rules apply to all AI tools working on this project:

- **Plan before execute** — for any non-trivial task, show a plan and wait for approval before writing code or editing files.
- **Ask, don't assume** — if the task is ambiguous, ask one clarifying question. Never guess intent and proceed.
- **Scope discipline** — only touch what was explicitly asked. Flag out-of-scope issues without acting on them.
- **Stop and report** — if blocked or on a wrong path, say so immediately. Don't burn cycles on a dead end.
- **One change at a time** — when modifying existing files, propose one change, explain why, and wait for approval. No silent batch edits.
- **No invented scope** — do not add features, refactors, error handling, or abstractions beyond what was requested.
- **Uncertainty is explicit** — if unsure, say so. Never present a guess as a fact.

## Off-Limits Boundaries

AI tools must never touch the following without explicit human instruction:

- **Secrets and env files** — `.env`, `.env.*`, any file containing API keys, tokens, or credentials
- **Lock files** — `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml` — these are side-effects of package commands, not direct edits
- **Database migrations** — never create, modify, or delete migration files autonomously
- **CI/CD config** — `.github/workflows/`, `vercel.json`, deployment configs require human review
- **Auth-related code** — any file handling tokens, sessions, permissions, or identity
- **Dependency additions** — do not add or remove packages without explicit approval; state the package and reason first

## Why This Matters

- Rules stay in sync across tools — no separate maintenance per tool
- New team members and new tools onboard to the same standards automatically
- Prevents AI tools from drifting into patterns or technologies not approved in TECH-STACK.md

## Workflow Conventions

- **Branch creation** — AI tools do not create branches autonomously. Branch creation is a human action.
- **Commit messages** — follow the project's commit convention (defined in `CONTRIBUTING.md` or `AI-TOOL-GUIDE.md`). Default: Conventional Commits (`feat:`, `fix:`, `chore:`, etc.).
- **PRs** — AI tools do not open, close, or comment on PRs without explicit instruction.
- **Pushing to remote** — never push to any remote branch without explicit human approval.
- **Breaking changes** — any change that modifies a public API, DB schema, or shared contract requires human sign-off before commit.

## Rules

- `AI-TOOL-GUIDE.md` derives from `TECH-STACK.md` — only approved technologies apply.
- Adapter files have two layers: (1) a reference to `AI-TOOL-GUIDE.md` for shared project rules, and (2) tool-specific config that has no cross-tool equivalent (e.g., Claude's tone/memory behavior, Copilot's suggestion filters). Only layer 2 lives in the adapter — never duplicate layer 1 rules there.
- If a rule changes, update `AI-TOOL-GUIDE.md` first, then sync both adapter files.
- Adding a new AI tool to the project requires a new adapter file — rules stay in `AI-TOOL-GUIDE.md`.
