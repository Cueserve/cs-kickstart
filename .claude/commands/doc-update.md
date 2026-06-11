---
description: "Update any source-of-truth document after initiation — opens a PR through the same review gate that finalized it"
allowed-tools: Read, Write, Edit, Glob, Bash(git:*), Bash(gh:*), Bash(az:*), Bash(glab:*)
---

# /doc-update — Update a source-of-truth document

Use this any time reality diverges from one of the initiation documents. The flow is short: say what changed, see the diff, confirm, done.

## Supported documents and their review gates

| Document | Reviewer gate |
| -------- | ------------- |
| `PRODUCT.md` | Product Owner |
| `PRD.md` | Product Owner |
| `ARCHITECTURE.md` | Architect + Product Owner |
| `TECH-STACK.md` | Architect |
| `AI-TOOL-GUIDE.md` | Architect |
| `README.md` | Architect |

## 1. Ask two questions — nothing more

Ask the user:

1. Which document needs updating?
2. What changed? (One or two sentences is enough.)

Do not ask for more detail yet. Proceed once you have both answers.

## 2. Preconditions — run before anything else

1. **Document exists on `main`** — run `git show main:<DOCNAME>`.
   - Exit 0 → proceed.
   - Non-zero → **STOP.** Tell the user: "That document is not on `main` yet — complete initiation first."

2. **Clean working tree** — run `git status --porcelain`.
   - Empty output → proceed.
   - Non-empty → **STOP.** Tell the user: "Uncommitted changes detected — commit or stash first."

## 3. Create the working branch

Branch off `main`: `docs/update/<docname>` (e.g. `docs/update/prd`).

If that branch already exists, ask the user whether to reuse it or create a new one. Do not reuse silently.

## 4. Make the update

- Read the current document from disk.
- Based on what the user described, identify which section(s) need to change. Ask one follow-up question only if a section is ambiguous — do not run a full re-interview.
- Update only the affected sections. Do not rewrite content that was not mentioned.
- Show only the changed sections as a before/after diff. Wait for the user to confirm before writing.
- Write the file.

## 5. Dependency reminder

After writing, remind the user which downstream documents may also need updating:

| Updated doc | Check these next |
| ----------- | ---------------- |
| `PRODUCT.md` | `PRD.md` → `ARCHITECTURE.md` → `TECH-STACK.md` → `AI-TOOL-GUIDE.md` → `README.md` |
| `PRD.md` | `ARCHITECTURE.md` → `TECH-STACK.md` → `AI-TOOL-GUIDE.md` |
| `ARCHITECTURE.md` | `TECH-STACK.md` → `AI-TOOL-GUIDE.md` |
| `TECH-STACK.md` | `AI-TOOL-GUIDE.md` |
| `AI-TOOL-GUIDE.md` | *(none — end of chain)* |
| `README.md` | *(none — end of chain)* |

State which downstream docs are affected. The user decides whether to run `/doc-update` on those next.

## 6. Commit

Commit the updated file with a Conventional Commit message:
`docs: update <DOCNAME> — <one-line summary of what changed>`

Never commit to `main`.

## 7. Open the PR/MR (requires explicit confirmation)

Ask the user to confirm before pushing. On confirmation:

- Push the branch and open a PR/MR targeting `main`.
- Title: `docs: update <DOCNAME> — <one-line summary>`
- Body: what changed, why, which downstream documents may also need updating, and the reviewer checklist from the document's step guide (`docs/guides/proj-init/`).
- Reviewer: same gate as the original initiation (see the table in Section 1).

Remind the user: the document is only updated once the PR/MR is merged to `main`.
