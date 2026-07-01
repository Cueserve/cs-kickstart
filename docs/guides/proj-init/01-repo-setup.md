# Step-01: Repo Setup (Prerequisite)

**Output:** `CONTRIBUTING.md` (governance layer) + branch protection (required on all plans) + required-reviewer policy (if your host and plan support it)
**Depends on:** nothing — this runs before everything else
**Required before:** Step 2 (Product Concept) — the approval gate must exist before the first PR/MR is opened

---

## Target repository

This step configures the **target repository** registered in Step 0, not this kit. Read `.proj-init/state.json` from this kit root and set `TARGET` to its `targetFolder`. If it is missing, stop and direct the operator to run Step 0 first.

Everything this step produces — `CONTRIBUTING.md`, `CODEOWNERS`, branch protection, preflight evidence — is created in `$TARGET`. Run every git command as `git -C "$TARGET" …`, run every host CLI (`gh`, `az repos`, `glab`) from within `$TARGET`, and write every file under `$TARGET/`.

## Goal

Stand up the governance that gates every later step: who must approve a document before it becomes final, and the branching rules every contributor and AI tool follows. Without this, Step 2's first change merges with no review gate and the whole workflow is bypassed on day one.

## Objective

Every project document (`PRODUCT.md`, `PRD.md`, …) is finalized by merging its change request to `main`. This step sets up that gate. How strong the gate is depends on your host and plan:

- **Branch protection** — blocks direct pushes to `main` and requires a PR/MR before merging. Available on all hosts and all plans. Required.
- **Required-reviewer policy** — assigns a mandatory reviewer to each document path so the host enforces approval before merge. Available on some hosts and paid plans only — see "Enforcement modes" below. Optional.
- **`CONTRIBUTING.md` (governance layer)** — documents which enforcement mode the project uses and the branching rules every contributor and AI tool follows.

See "Enforcement modes" to choose the right setup for your team.

## Host-neutral by design

This template assumes no specific Git host. The *concepts* below are portable; the *configuration* differs per host. Set up your host's equivalent of each:

| Concern | GitHub | Azure DevOps | Bitbucket | GitLab |
| ------- | ------ | ------------ | --------- | ------ |
| Required reviewer by path | `.github/CODEOWNERS` + ruleset | Branch policy → *automatically included reviewers* (path-based) | `CODEOWNERS` + default reviewers | `CODEOWNERS` + Code Owner approval |
| Block direct push to `main`, require review before merge | Branch protection rule / ruleset | Branch policies (min reviewers, no direct push) | Branch restrictions / merge checks | Protected branches + approval rules |
| Open the change request from the CLI | `gh pr create` | `az repos pr create` | web UI (no official CLI; third-party `atlassian-cli` available) | `glab mr create` |
| Name for the change request | Pull Request (PR) | Pull Request (PR) | Pull Request (PR) | Merge Request (MR) |

> Throughout these guides, **"PR/MR"** means your host's review-and-merge request. On GitHub, Azure DevOps, and Bitbucket that is a **Pull Request**; on GitLab it is a **Merge Request**.

## Step 1 preflight checks (machine-validated, fail hard)

Step 1 is not complete until these checks pass. Run them during Step 1 setup and re-run them at the start of every `/proj-init-*` command.

If any required check fails, stop immediately. Do not continue with Step 2+ until fixed.

### GitHub (`gh`)

Run:

- `gh api repos/<owner>/<repo>/branches/main/protection`
- Host-enforced mode only: `gh api repos/<owner>/<repo>/contents/.github/CODEOWNERS?ref=main`

Pass criteria:

- `main` protection exists and direct pushes are blocked.
- PR review enforcement is enabled.
- In host-enforced mode, `CODEOWNERS` exists on `main`.

### Azure DevOps (`az repos`)

Run:

- `az repos policy list --repository-id <repo-id> --branch main --project <project-name> --org <org-url>`

Pass criteria:

- Policy list contains a blocking PR policy for `main`.
- Policy list contains minimum reviewer/approval policy.
- In host-enforced mode, path-based required reviewers are configured.

### GitLab (`glab`)

Run:

- `glab api projects/<project-id>/protected_branches/main`
- Host-enforced mode only: `glab api projects/<project-id>/repository/files/CODEOWNERS?ref=main`

Pass criteria:

- `main` is protected and direct pushes are blocked.
- Approval rules are configured for merge requests.
- In host-enforced mode, `CODEOWNERS` exists on `main`.

### Bitbucket (REST API or web UI)

Bitbucket has no official PR CLI. Validate via REST API or web UI settings:

- `main` branch restrictions block direct pushes.
- Merge checks require PR review.
- In host-enforced mode, required/default reviewers are configured.

### Evidence required

- Save a short "Step 1 preflight evidence" block in `CONTRIBUTING.md` with:
  - host name,
  - check timestamp,
  - command(s) run,
  - pass/fail result.
- Every `/proj-init-*` run must verify this evidence still matches current host settings.

## Enforcement modes

Choose the mode that fits your host, plan, and team. Both are valid; they differ only in whether the Git host mechanically blocks a merge without approval.

### Host-enforced (recommended when available)

The host blocks merges without the required reviewer's approval. Supported on:

| Host | Free plan | Paid plan |
| ---- | --------- | --------- |
| GitHub | Public repos only | Pro / Team / Enterprise (private repos) |
| Azure DevOps | ✓ Branch policies are free (Basic plan, any team size) | Standard and above |
| Bitbucket | Basic branch restrictions only (no required reviewers) | Standard / Premium |
| GitLab | Protected branches only (no Code Owner enforcement) | Premium |

If your plan supports it, configure CODEOWNERS and branch protection rules as described under "What This Step Produces."

### Process-enforced (free plans, solo projects, small teams)

No host policy blocks the merge. The gate is documented process. Use this when:

- Your plan does not support required reviewers for private repos.
- Your team is one or two people holding both PO and Architect roles.

In this mode:

- Configure branch protection to block **direct pushes to `main`** — this is free on every host.
- Skip the CODEOWNERS / path-based reviewer policy.
- Before merging any `init/*` PR/MR, the author self-certifies:
  - [ ] At least one full day has passed since writing the document (fresh-eyes check).
  - [ ] The document covers every section the step guide requires.
  - [ ] No upstream document changed after this branch was created.
  - [ ] A PR/MR was opened — no direct push to `main`.

Record the chosen mode in `CONTRIBUTING.md`.

### Team roles on small teams

On a team of two or more, keep roles separate: the person who wrote the document should not be the one who merges it.

On a solo project, one person holds both PO and Architect roles. The process-enforced self-review checklist is the substitute for a second reviewer — never a direct push.

## What This Step Produces

### 1. Required-reviewer policy *(host-enforced mode only)*

Skip this sub-section if you are using process-enforced mode.

Assign each output path to the role that validates it. Product docs are gated by the **product owner**; engineering/governance docs by the **architect / tech lead** — never the same reviewer for both. On GitHub, Bitbucket, and GitLab this is a `CODEOWNERS` file; on Azure DevOps it is a path-based branch policy.

Example (`CODEOWNERS` syntax — translate to ADO path policies):

```text
/PRODUCT.md        @product-owner
/PRD.md            @product-owner
/ARCHITECTURE.md   @architect @product-owner
/TECH-STACK.md     @architect
/AI-TOOL-GUIDE.md  @architect
/CONTRIBUTING.md   @architect
```

### 2. Branch protection on `main`

- Require a PR/MR before merging — no direct pushes to `main`. *(All plans and modes.)*
- Require approval from the path's required reviewer before merge. *(Host-enforced mode only.)*
- Require the source branch to be up to date with `main` before merging.
- (Optional) require status checks once CI exists.

### 3. `CONTRIBUTING.md` — governance layer

This layer depends on nothing and is written now. The **tooling layer** (test/lint/build commands, hooks) depends on the stack and is appended later — see `05-tech-stack.md`.

The governance layer covers:

- **Branching strategy** — branch per step off `main`; `main` only ever holds finalized, approved docs.
- **Branch naming** — `init/<step>` for initiation work (`init/product`, `init/prd`, `init/architecture`, `init/techstack`, `init/aitools`, `init/readme`).
- **Review flow** — open a PR/MR per branch; merge to `main` = finalized. A merged doc is the only "final" doc.
- **Approval gate** — in host-enforced mode: a PR/MR cannot merge without the required reviewer (product owner for product docs, architect for governance docs). In process-enforced mode: the author completes the self-review checklist before merging.
- **Approval continuity** — define primary and backup approvers for product and architect gates, review SLA (first response within one business day), and escalation/delegation path if approvers are unavailable.
- **Step 1 preflight evidence** — record the host checks and latest validation timestamp.
- **Enforcement mode** — state which mode this project uses (host-enforced or process-enforced) and why.
- **Commit convention** — Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, …). Matches `06-ai-tool-guide.md`.
- **Direct-push rule** — never push to `main`; no force-pushes to shared branches.

## Why This Matters

- The approval gate exists before the first document is written, not after.
- The gate is explicit — either the host enforces it mechanically, or a documented self-review checklist does. Either way, a merged PR/MR is the only path to `main`.
- Branch-vs-`main` state *is* draft-vs-final — no draft files, no status frontmatter to keep in sync.
- Every contributor and AI tool follows one documented branching convention.

## Rules

- This step runs **before** Step 2. Nothing earlier depends on it; everything later does.
- Required reviewers must differ by document type: product docs → product owner, governance/engineering docs → architect. In process-enforced mode, the self-review checklist serves the same separation.
- Only the **governance layer** of `CONTRIBUTING.md` is written here. Do not add stack-specific commands yet — they depend on `TECH-STACK.md` (Step 5).
- Changing the enforcement mode or branching strategy means updating `CONTRIBUTING.md` first, then reconciling the host's branch-protection settings.
- Step 1 is incomplete until machine preflight checks pass and evidence is recorded in `CONTRIBUTING.md`.
- If preflight checks fail on any `/proj-init-*` run, stop and return to Step 1. Do not continue by trust or assumption.
- Requires the repo to be on a supported Git host — GitHub, Azure DevOps, Bitbucket, or GitLab. Branch protection (no direct push to `main`) is required regardless of plan. Required-reviewer enforcement is optional — configure it if your host and plan support it.
- Anyone running the `/proj-init-*` commands opens PRs/MRs via their host's CLI (`gh` / `az repos` / `glab`) or the host's web UI.
