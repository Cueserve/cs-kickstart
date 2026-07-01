# Step-06: AI Tool Guide

**Output file:** `AI-TOOL-GUIDE.md` + one adapter file per AI tool in use on this project
**Depends on:** `ARCHITECTURE.md` (Step-04), `TECH-STACK.md` (Step-05)
**Required before:** production implementation and any AI-assisted source-code changes begin

---

## Goal

Create `AI-TOOL-GUIDE.md` as the single source of truth for how AI tools must behave on this project, then wire it into each tool's native config file.

## Objective

This document defines the rules, constraints, and conventions that guide AI assistants (Claude Code, GitHub Copilot, or any future tool) working on this project. Rules live in one place — `AI-TOOL-GUIDE.md` — to prevent drift between tools. Each tool gets a thin adapter file that points to it.

## Structure

`AI-TOOL-GUIDE.md` always exists. Each AI tool in use on the project gets one thin adapter file pointing to it:

| AI tool | Adapter file | Notes |
| ------- | ------------ | ----- |
| Claude Code | `CLAUDE.md` | Read automatically by Claude Code in the repo root |
| GitHub Copilot | `.github/copilot-instructions.md` | Copilot reads this path regardless of Git host |
| Other tools | Tool's native config file | Ask the team what config path the tool reads |

Only generate adapters for tools the team will actually use. Do not create adapter files for tools not in use — they add maintenance overhead with no benefit.

## What This Document Covers

Structure is fixed by the template — `docs/guides/proj-init/templates/AI-TOOL-GUIDE.template.md`. The template owns the section headings and their order; this guide owns what each section must contain. Sections 8–10 are detailed in their own sections below. Fill every section; add or drop none.

1. **Project Context** — brief summary of what the project is, how it is structured, and the tech stack in use
2. **Coding Conventions** — naming, formatting, file structure rules for this project
3. **Scope Boundaries** — what AI tools are and are not allowed to touch
4. **Banned Patterns** — things AI must never generate or suggest (e.g., mocks, certain libs, anti-patterns flagged in ARCHITECTURE.md)
5. **Testing Rules** — how tests must be written; what counts as a valid test
6. **Documentation Rules** — when and how to comment; what to leave out
7. **Decision Escalation** — explicit criteria for when AI must stop and get approval: new package additions, schema/migration changes, auth-related code, breaking API changes, anything touching CI/CD or deployment config
8. **Agent Behavior Rules** — how AI agents operate (plan before execute, ask don't assume, scope discipline, stop and report); see the section below
9. **Off-Limits Boundaries** — files AI must never touch without instruction (secrets/env, lock files, migrations, CI/CD, auth code, dependency changes); see the section below
10. **Workflow Conventions** — branching, commits, PRs, pushing, breaking-change sign-off; see the section below

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
- **CI/CD config** — pipeline definitions (e.g. `.github/workflows/`, `azure-pipelines.yml`, `bitbucket-pipelines.yml`, `.gitlab-ci.yml`), `vercel.json`, deployment configs require human review
- **Auth-related code** — any file handling tokens, sessions, permissions, or identity
- **Dependency additions** — do not add or remove packages without explicit approval; state the package and reason first

## Why This Matters

- Rules stay in sync across tools — no separate maintenance per tool
- New team members and new tools onboard to the same standards automatically
- Prevents AI tools from drifting into architectural patterns or technologies not approved in `ARCHITECTURE.md` and `TECH-STACK.md`

## Workflow Conventions

- **Branch creation** — AI tools do not create branches autonomously. Branch creation is a human action.
- **Commit messages** — follow the project's commit convention (defined in `CONTRIBUTING.md` or `AI-TOOL-GUIDE.md`). Default: Conventional Commits (`feat:`, `fix:`, `chore:`, etc.).
- **PRs** — AI tools do not open, close, or comment on PRs without explicit instruction.
- **Pushing to remote** — never push to any remote branch without explicit human approval.
- **Breaking changes** — any change that modifies a public API, DB schema, or shared contract requires human sign-off before commit.

## Rules

- `AI-TOOL-GUIDE.md` derives from `ARCHITECTURE.md` and `TECH-STACK.md` — structural boundaries and only approved technologies apply.
- Adapter files have two layers: (1) a reference to `AI-TOOL-GUIDE.md` for shared project rules, and (2) tool-specific config that has no cross-tool equivalent (e.g., Claude's tone/memory behavior, Copilot's suggestion filters). Only layer 2 lives in the adapter — never duplicate layer 1 rules there.
- If a rule changes, update `AI-TOOL-GUIDE.md` first, then sync all adapter files in use.
- Adding a new AI tool to the project requires a new adapter file — run `/proj-init-doc-update AI-TOOL-GUIDE.md` to add the tool and generate its adapter.

## Reviewer checklist

Before approving the PR/MR, verify every item. An unchecked item is a reason to request changes.

- [ ] `AI-TOOL-GUIDE.md` matches the template skeleton (`templates/AI-TOOL-GUIDE.template.md`) — header block, all ten sections in order, and the references table present; no top-level section added or removed, and no `[placeholder]` left unfilled.
- [ ] AI tools in use on the project are identified and an adapter file exists for each.
- [ ] Scope boundaries are explicit — specific files, directories, or actions AI must not touch without approval.
- [ ] Banned patterns are project-specific, not generic boilerplate (e.g. references actual libraries or anti-patterns flagged in `ARCHITECTURE.md`).
- [ ] Decision escalation criteria name concrete scenarios, not "when in doubt" — the AI should be able to self-evaluate.
- [ ] Adapter files contain only tool-specific config — no duplication of shared rules from `AI-TOOL-GUIDE.md`.
