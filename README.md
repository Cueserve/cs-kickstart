# CS Project Kickstart

> AI-powered starter kit for structured project initiation — tool-agnostic guides with thin adapters for Claude Code and GitHub Copilot

A boilerplate project that guides team through a **clear, step‑by‑step project‑initiation process** before any coding begins. You bootstrap the initiation scaffold into a target repository, follow the steps, and end up with a consistent set of source‑of‑truth documents (`PRODUCT.md` → `README.md`) along with the rules that keep everything aligned as the project grows. This boilerplate is not tied to any tech stack to start with — technology stack is chosen during the initiation process (Step 5).

---

## 🚀 Start Here

Before writing any code, bootstrap the initiation scaffold into the real target repo, then run the Project Initiation process:

**→ [Project Initiation Guide](docs/guides/proj-init/_overview.md)**

Start with **Step 0** when the target repository does not already contain this scaffold. Step 0 copies the shared guides, templates, adapters, and starter README into a local folder or git repository; it does not create product code or choose a stack. **Claude Code users** run `/proj-init-bootstrap`. **GitHub Copilot users** run `.github/prompts/proj-init-bootstrap.prompt.md`. Other tools use [Step 0](docs/guides/proj-init/00-bootstrap-target-repo.md) directly.

After bootstrap, the process walks through Steps 1–8. Steps 2–8 each produce one source-of-truth document, finalized by a pull request. **Claude Code users** run the `/proj-init-*` slash commands. **GitHub Copilot users** run the matching prompt files from `.github/prompts/`. Both tool paths load the same shared runner, step registry, and step guides from `docs/guides/proj-init/`.

## Prerequisites

- **Git** and a repository on a supported **Git host** — GitHub, Azure DevOps, Bitbucket, or GitLab. Step 1 configures branch governance to match your host, plan, and team size — see [Step 1](docs/guides/proj-init/01-repo-setup.md) for what's available on free vs. paid plans.
- Your host's **PR/MR CLI** — `gh` (GitHub), `az repos` (Azure DevOps), `glab` (GitLab) — or the host's web UI. Bitbucket has no official CLI; use the web UI or the third-party `atlassian-cli`. Without a CLI, push the branch and open the PR/MR manually.
- An AI coding assistant — Claude Code, GitHub Copilot Chat, or any tool your team or client uses. Claude Code users get `/proj-init-*` slash commands, Copilot users get `.github/prompts/proj-init-*.prompt.md` prompt adapters, and other tools use the shared runner, step registry, and step guides directly.

---

## How It Works

Two one-time setup steps come first, then every document-producing step repeats the same loop — a document is **final only when its PR is merged to `main`**.

**Once, up front:**

- **Step 0 — Bootstrap the target repo** (if needed): run `/proj-init-bootstrap`, `.github/prompts/proj-init-bootstrap.prompt.md`, or `node scripts/bootstrap-target-repo.mjs --target <path>` to copy the initiation scaffold into the real project repository.
- **Step 1 — Set up governance**: branch protection and the approval gate, before any document is written.

**Then, for each document-producing step (2–8):**

1. **Branch** off `main` (`init/<step>`).
2. **Produce the document** — Claude Code: run the step's `/proj-init-*` command. GitHub Copilot: run the matching `.github/prompts/proj-init-*.prompt.md` prompt. Any other AI tool: open `docs/guides/proj-init/_run-step.md`, the step entry in `docs/guides/proj-init/_steps.yml`, and the step guide in your AI chat.
3. **Open a PR.**
4. **The CODEOWNER reviews and merges** — merge = finalized.
5. **The next step branches off the updated `main`** — Claude Code commands verify this automatically; other tools check manually that the upstream document is merged before starting.

No draft files, no status flags: a doc on a branch is a draft, a doc on `main` is final.

## The Steps

| Step | Claude Code | GitHub Copilot | Produces |
| ---- | ----------- | -------------- | -------- |
| 0 | `/proj-init-bootstrap` | `.github/prompts/proj-init-bootstrap.prompt.md` | initiation scaffold in the target repo/folder |
| 1 | *manual setup* | *manual setup* | branch protection + `CONTRIBUTING.md` (governance); required-reviewer policy if plan supports it |
| 2 | `/proj-init-product` | `.github/prompts/proj-init-product.prompt.md` | `PRODUCT.md` |
| 3 | `/proj-init-prd` | `.github/prompts/proj-init-prd.prompt.md` | `PRD.md` |
| 4 | `/proj-init-architecture` | `.github/prompts/proj-init-architecture.prompt.md` | `ARCHITECTURE.md` |
| 5 | `/proj-init-techstack` | `.github/prompts/proj-init-techstack.prompt.md` | `TECH-STACK.md` (+ `CONTRIBUTING.md` tooling layer) |
| 6 | `/proj-init-aitoolguide` | `.github/prompts/proj-init-aitoolguide.prompt.md` | `AI-TOOL-GUIDE.md` + one adapter per AI tool in use (e.g. `CLAUDE.md`, `.github/copilot-instructions.md`) |
| 7 | `/proj-init-readme` | `.github/prompts/proj-init-readme.prompt.md` | `README.md` (replaces this file) |
| 8 | `/proj-init-backlog` | `.github/prompts/proj-init-backlog.prompt.md` | `BACKLOG.md` + host issues/work items |

Claude commands and Copilot prompts are thin adapters. The maintained workflow lives in `docs/guides/proj-init/_run-step.md`, step-specific metadata lives in `docs/guides/proj-init/_steps.yml`, and document rules live in the numbered step guides.

Run `/proj-init-doc-status` in Claude Code or `.github/prompts/proj-init-doc-status.prompt.md` in GitHub Copilot at any time to see which steps are merged, which PR is open, and what's next.

See the [Project Initiation Guide](docs/guides/proj-init/_overview.md) for who owns each step, the PR gate, and the full rules.

## Repository Structure

```text
docs/guides/proj-init/           ← shared runner, utility workflows, step registry, and step-by-step guides
docs/guides/proj-init/templates/ ← output templates per generated doc + shared writing rules and references
scripts/check-template-drift.mjs ← guard: template headings must match each guide's section map
scripts/bootstrap-target-repo.mjs ← Step 0 bootstrap script for copying scaffold into a target repo/folder
.claude/commands/                ← thin /proj-init-* adapters + /proj-init-doc-update and /proj-init-doc-status
.github/prompts/                 ← thin Copilot prompt adapters for /proj-init-* steps and doc utilities
.github/copilot-instructions.md  ← Copilot rule: use docs/guides/proj-init/ as source of truth
README.md                        ← this boilerplate entrypoint (replaced in Step 7)

Generated after running Steps 1–8:
PRODUCT.md                       ← product concept (Step 2)
PRD.md                           ← requirements (Step 3)
ARCHITECTURE.md                  ← system design (Step 4)
TECH-STACK.md                    ← approved technologies (Step 5)
CONTRIBUTING.md                  ← governance + tooling rules (Steps 1 and 5)
AI-TOOL-GUIDE.md                 ← AI tool rules shared across all tools (Step 6)
CLAUDE.md                        ← Claude Code adapter, if in use (Step 6)
.github/copilot-instructions.md  ← Copilot adapter, if in use (Step 6)
README.md                        ← project entry point, replaces this file (Step 7)
BACKLOG.md                       ← initial backlog manifest + host issue IDs (Step 8)
```

## After Initiation

Step 7 (`/proj-init-readme`) **replaces this README** with your project's own — describing the actual product, its setup, and how to run it. Step 8 (`/proj-init-backlog`) seeds the issue tracker. The guides in `docs/guides/proj-init/` stay as the durable reference for the process.

### Keeping docs current

Run `/proj-init-doc-update <docname>` in Claude Code or `.github/prompts/proj-init-doc-update.prompt.md` in GitHub Copilot any time a source-of-truth document diverges from reality — a changed requirement, a new library, an architecture decision. It updates only the affected sections and opens a PR through the same review gate that originally finalized the document. See the [trigger table](docs/guides/proj-init/_overview.md#keeping-docs-current) for when to update which doc.
