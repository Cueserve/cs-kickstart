# CS Project Kickstart

> AI-powered starter kit for structured project initiation — tool-agnostic guides with thin adapters for Claude Code and GitHub Copilot

A control-plane kit that guides teams through a **clear, step‑by‑step project‑initiation process** before any coding begins. You run this kit as the control plane: Step-00 clones your target repository and registers it, you run the steps from here, and the target ends up with a consistent set of source‑of‑truth documents (`PRODUCT.md` → `README.md`) along with the rules that keep everything aligned as the project grows. The kit's guides, runner, and adapters are never copied into the target — only the documents you produce land there. This kit is not tied to any tech stack — the technology stack is chosen during the initiation process (Step-05).

---

## 🚀 Start Here

Before writing any code, register your target repo (Step-00), then run the Project Initiation process from this kit:

**→ [Project Initiation Guide](docs/guides/proj-init/_overview.md)**

Start with **Step-00**. It clones your target repository into a local folder and registers it in `.proj-init/state.json`, so every later step operates on that clone. It does not copy any kit files into the target, create product code, or choose a stack. Run `/proj-init-bootstrap` (or use [Step-00](docs/guides/proj-init/00-bootstrap.md) directly in another AI tool).

After Step-00, the process walks through Step-01 to Step-08. Step-02 through Step-08 each produce one source-of-truth document, finalized by a pull request. Use the `/proj-init-*` commands as the primary interface. All adapters load the same shared runner, step registry, and step guides from `docs/guides/proj-init/` in this kit, and write the produced documents into the registered target repo.

Run exactly one step per session. Start each step session by running `/proj-init-doc-status` before executing the step command.

## Prerequisites

- **Git** and a repository on a supported **Git host** — GitHub, Azure DevOps, Bitbucket, or GitLab. Step-01 configures branch governance to match your host, plan, and team size — see [Step-01](docs/guides/proj-init/01-repo-setup.md) for what's available on free vs. paid plans.
- Your host's **PR/MR CLI** — `gh` (GitHub), `az repos` (Azure DevOps), `glab` (GitLab) — or the host's web UI. Bitbucket has no official CLI; use the web UI or the third-party `atlassian-cli`. Without a CLI, push the branch and open the PR/MR manually.
- An AI coding assistant — Claude Code, GitHub Copilot Chat, or any tool your team or client uses. Use `/proj-init-*` as the primary interface; adapters point to the same shared workflow.

---

## How It Works

Two one-time setup steps come first, then every document-producing step repeats the same loop — a document is **final only when its PR is merged to `main`**.

**Once, up front:**

- **Step-00 — Register the target repo**: run `/proj-init-bootstrap` or `node scripts/bootstrap-target-repo.mjs --target <folder> --url <git-url> --apply` to clone the target repo and register it in `.proj-init/state.json`.
- **Step-01 — Set up governance** (in the target): branch protection and the approval gate, before any document is written.

**Then, for each document-producing step (2–8):**

1. **Branch** off `main` (`init/<step>`).
2. **Produce the document** — run the step's `/proj-init-*` command. Any other AI tool: open `docs/guides/proj-init/_run-step.md`, the step entry in `docs/guides/proj-init/_steps.yml`, and the step guide in your AI chat.
3. **Open a PR.**
4. **The CODEOWNER reviews and merges** — merge = finalized.
5. **The next step branches off the updated `main`** — command adapters can verify this automatically; otherwise check manually that the upstream document is merged before starting.

No draft files, no status flags: a doc on a branch is a draft, a doc on `main` is final.

## The Steps

| Step | Run | Produces |
| ---- | --- | -------- |
| 0 | `/proj-init-bootstrap` | cloned target repo + `.proj-init/state.json` registration |
| 1 | `/proj-init-repo-setup` | branch protection + `CONTRIBUTING.md` (governance); required-reviewer policy if plan supports it |
| 2 | `/proj-init-product` | `PRODUCT.md` |
| 3 | `/proj-init-prd` | `PRD.md` |
| 4 | `/proj-init-architecture` | `ARCHITECTURE.md` |
| 5 | `/proj-init-techstack` | `TECH-STACK.md` (+ `CONTRIBUTING.md` tooling layer) |
| 6 | `/proj-init-aitoolguide` | `AI-TOOL-GUIDE.md` + one adapter per AI tool in use (e.g. `CLAUDE.md`, `.github/copilot-instructions.md`) |
| 7 | `/proj-init-readme` | the target's project `README.md` |
| 8 | `/proj-init-backlog` | `BACKLOG.md` + host issues/work items |
| — | `/proj-init-cleanup` | unregisters the workspace after Step-08 merges |

Step-02 through Step-08 write their output into the **registered target repo**, not this kit. Adapters are thin wrappers over the same workflow. The maintained workflow lives in `docs/guides/proj-init/_run-step.md`, step-specific metadata lives in `docs/guides/proj-init/_steps.yml`, and document rules live in the numbered step guides.

GitHub Copilot users can run the matching adapter prompts in `.github/prompts/proj-init-*.prompt.md` if preferred; they resolve to the same underlying steps.

Run `/proj-init-doc-status` at any time to see which steps are merged, which PR is open, and what's next.

See the [Project Initiation Guide](docs/guides/proj-init/_overview.md) for who owns each step, the PR gate, and the full rules.

## Repository Structure

```text
This kit (the control plane):
docs/guides/proj-init/           ← shared runner, utility workflows, step registry, and step-by-step guides
docs/guides/proj-init/templates/ ← output templates per generated doc + shared writing rules and references
scripts/check-template-drift.mjs ← guard: template headings must match each guide's section map
scripts/check-branch-policy-enforcement.mjs    ← guard: recorded Step-01 enforcement mode must match what the host actually enforces
scripts/branch-policy-enforcement/ ← per-host approval-gate capability probes (github, azure-devops, gitlab, bitbucket) + shared util
scripts/bootstrap-target-repo.mjs ← Step-00 script: clone the target repo and register it in .proj-init/state.json
.claude/commands/                ← thin /proj-init-* adapters + /proj-init-doc-update, /proj-init-doc-status, /proj-init-cleanup
.github/prompts/                 ← thin Copilot prompt adapters for /proj-init-* steps and doc utilities
.github/copilot-instructions.md  ← Copilot rule: use docs/guides/proj-init/ as source of truth
.proj-init/state.json            ← Step-00 workspace registration (gitignored, operator-local)
README.md                        ← this kit's entrypoint (the control-plane README)

Generated in the TARGET repo after running Step-01 through Step-08:
PRODUCT.md                       ← product concept (Step-02)
PRD.md                           ← requirements (Step-03)
ARCHITECTURE.md                  ← system design (Step-04)
TECH-STACK.md                    ← approved technologies (Step-05)
CONTRIBUTING.md                  ← governance + tooling rules (Step-01 and Step-05)
AI-TOOL-GUIDE.md                 ← AI tool rules shared across all tools (Step-06)
CLAUDE.md                        ← Claude Code adapter, if in use (Step-06)
.github/copilot-instructions.md  ← Copilot adapter, if in use (Step-06)
README.md                        ← the target's project entry point (Step-07)
BACKLOG.md                       ← initial backlog manifest + host issue IDs (Step-08)
```

## After Initiation

Step-07 (`/proj-init-readme`) writes **the target's own README** — describing the actual product, its setup, and how to run it. Step-08 (`/proj-init-backlog`) seeds the issue tracker. Once Step-08 is merged, run `/proj-init-cleanup` to unregister the workspace from this kit. The guides in `docs/guides/proj-init/` stay as the durable reference for the process, and this kit's own README is never overwritten.

### Keeping docs current

Run `/proj-init-doc-update <docname>` any time a source-of-truth document diverges from reality — a changed requirement, a new library, an architecture decision. It updates only the affected sections and opens a PR through the same review gate that originally finalized the document. See the [trigger table](docs/guides/proj-init/_overview.md#keeping-docs-current) for when to update which doc.
