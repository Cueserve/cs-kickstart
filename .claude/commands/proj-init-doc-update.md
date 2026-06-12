---
description: "Update any source-of-truth document after initiation — opens a PR through the same review gate that finalized it"
allowed-tools: Read, Write, Edit, Glob, Bash(git:*), Bash(gh:*), Bash(az:*), Bash(glab:*)
---

# /proj-init-doc-update — Update a source-of-truth document

Use this any time reality diverges from one of the initiation documents. Pass the document name inline (e.g. `/proj-init-doc-update PRD.md`) or run `/proj-init-doc-update` and be asked.

## Supported documents and their review gates

| Document | Reviewer gate |
| -------- | ------------- |
| `PRODUCT.md` | Product Owner |
| `PRD.md` | Product Owner |
| `ARCHITECTURE.md` | Architect + Product Owner |
| `TECH-STACK.md` | Architect |
| `AI-TOOL-GUIDE.md` | Architect |
| `README.md` | Architect |
| `BACKLOG.md` | Product Owner |

## 1. Identify the document and the change

- **If a document name was passed as an argument** (e.g. `/proj-init-doc-update PRD.md`): use it. Validate it is in the supported list above — if not, tell the user and stop.
- **If no argument was given**: ask which document needs updating.

Then ask one question: *What changed?* (one or two sentences is enough.) Do not ask for more detail yet.

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

## 5. Run the impact analyzer and create a reconciliation checklist

This step is **required** — do not skip it.

### Impact analyzer

Using the dependency map below, identify all downstream documents. Mark each as:

- `required-update` — must be reviewed and updated
- `review-only` — validate that no update is needed
- `not-impacted`

Use the user's stated change and the edited sections to justify each mark in one short line.

Dependency map:

| Updated doc | Downstream documents |
| ----------- | -------------------- |
| `PRODUCT.md` | `PRD.md` → `ARCHITECTURE.md` → `TECH-STACK.md` → `AI-TOOL-GUIDE.md` → `README.md` → `BACKLOG.md` |
| `PRD.md` | `ARCHITECTURE.md` → `TECH-STACK.md` → `AI-TOOL-GUIDE.md` → `BACKLOG.md` |
| `ARCHITECTURE.md` | `TECH-STACK.md` → `AI-TOOL-GUIDE.md` |
| `TECH-STACK.md` | `AI-TOOL-GUIDE.md` |
| `AI-TOOL-GUIDE.md` | *(none — end of chain)* |
| `README.md` | *(none — end of chain)* |
| `BACKLOG.md` | *(none — end of chain)* |

### Create the reconciliation checklist file

Write `.claude/reconciliation/<docname>-reconcile.md` with:

```markdown
# Reconciliation: <DOCNAME> — <date>

**Change summary:** <one-line description of what changed>
**Branch:** docs/update/<docname>
**PR/MR:** <link once opened>

## Downstream checklist

- [ ] `<DOC>` — <required-update | review-only>: <one-line justification>
      Next action: run `/proj-init-doc-update <DOC>` if update is required.
- [ ] `<DOC>` — ...

## Completed
<!-- Move items here once resolved -->
```

Include the checklist file in the same commit as the document update.

## 6. Commit

Commit the updated file and the reconciliation checklist with:
`docs: update <DOCNAME> — <one-line summary of what changed>`

Never commit to `main`.

## 7. Open the PR/MR (requires explicit confirmation)

Ask the user to confirm before pushing. On confirmation:

- Push the branch and open a PR/MR targeting `main`.
- Title: `docs: update <DOCNAME> — <one-line summary>`
- Body: what changed, why, which downstream documents are flagged, path to `.claude/reconciliation/<docname>-reconcile.md`, and the reviewer checklist from the document's step guide (`docs/guides/proj-init/`).
- Reviewer: same gate as the original initiation step (see the table in Section 1).

Remind the user: the document is only updated once the PR/MR is merged to `main`. Work through the reconciliation checklist afterward — one `/proj-init-doc-update <doc>` per flagged downstream document.
