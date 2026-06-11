# CS Project Kickstart

> AI-powered starter kit for structured project initiation — tool-agnostic guides with slash-command automation for Claude Code

A boilerplate project that guides team through a **clear, step‑by‑step project‑initiation process** before any coding begins. You clone it, follow the steps, and end up with a consistent set of source‑of‑truth documents (`PRODUCT.md` → `README.md`) along with the rules that keep everything aligned as the project grows. This boilerplate is not tied to any tech stack to start with — technology stack is chosen during the initiation process (Step 5).

---

## 🚀 Start Here

Before writing any code, run the Project Initiation process:

**→ [Project Initiation Guide](docs/guides/proj-init/00-overview.md)**

It walks through eight steps. Each step produces one source-of-truth document, finalized by a pull request. **Claude Code users** run the `/init-*` slash commands for an automated flow. **Teams using Copilot or any other AI assistant** follow the step guides in `docs/guides/proj-init/` directly in their AI chat.

## Prerequisites

- **Git** and a repository on a supported **Git host** — GitHub, Azure DevOps, Bitbucket, or GitLab. Step 1 configures branch governance to match your host, plan, and team size — see [Step 1](docs/guides/proj-init/01-repo-setup.md) for what's available on free vs. paid plans.
- Your host's **PR/MR CLI** — `gh` (GitHub), `az repos` (Azure DevOps), `glab` (GitLab) — or the host's web UI. Bitbucket has no official CLI; use the web UI or the third-party `atlassian-cli`. Without a CLI, push the branch and open the PR/MR manually.
- An AI coding assistant — Claude Code, GitHub Copilot Chat, or any tool your team or client uses. Claude Code users get automated `/init-*` slash commands; other tools follow the step guides directly.

---

## How It Works

Every step is the same loop — a document is **final only when its PR is merged to `main`**:

1. **Branch** off `main` (`init/<step>`).
2. **Produce the document** — Claude Code: run the step's `/init-*` command. Any other AI tool: open the step's guide from `docs/guides/proj-init/` in your AI chat and follow it directly.
3. **Open a PR.**
4. **The CODEOWNER reviews and merges** — merge = finalized.
5. **The next step branches off the updated `main`** — Claude Code commands verify this automatically; other tools check manually that the upstream document is merged before starting.

No draft files, no status flags: a doc on a branch is a draft, a doc on `main` is final.

## The Steps

| Step | Command | Produces |
| ---- | ------- | -------- |
| 1 | *manual setup* | branch protection + `CONTRIBUTING.md` (governance); required-reviewer policy if plan supports it |
| 2 | `/init-product` | `PRODUCT.md` |
| 3 | `/init-prd` | `PRD.md` |
| 4 | `/init-architecture` | `ARCHITECTURE.md` |
| 5 | `/init-techstack` | `TECH-STACK.md` (+ `CONTRIBUTING.md` tooling layer) |
| 6 | `/init-aitoolguide` | `AI-TOOL-GUIDE.md` + one adapter per AI tool in use (e.g. `CLAUDE.md`, `.github/copilot-instructions.md`) |
| 7 | `/init-readme` | `README.md` (replaces this file) |
| 8 | `/init-backlog` | `BACKLOG.md` + host issues/work items |

Commands are Claude Code slash commands. Teams using Copilot or another AI tool follow the linked guide for each step directly in their AI chat.

Run `/check-doc-status` at any time to see which steps are merged, which PR is open, and what's next.

See the [Project Initiation Guide](docs/guides/proj-init/00-overview.md) for who owns each step, the PR gate, and the full rules.

## Repository Structure

```text
docs/guides/proj-init/           ← step-by-step guides (use directly in any AI chat)
.claude/commands/                ← /init-* slash commands + /update-doc (Claude Code automation)
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

Step 7 (`/init-readme`) **replaces this README** with your project's own — describing the actual product, its setup, and how to run it. Step 8 (`/init-backlog`) seeds the issue tracker. The guides in `docs/guides/proj-init/` stay as the durable reference for the process.

### Keeping docs current

Run `/update-doc <docname>` any time a source-of-truth document diverges from reality — a changed requirement, a new library, an architecture decision. It updates only the affected sections and opens a PR through the same review gate that originally finalized the document. See the [trigger table](docs/guides/proj-init/00-overview.md#keeping-docs-current) for when to update which doc.
