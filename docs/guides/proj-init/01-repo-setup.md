# Step-01: Repo Setup (Prerequisite)

**Output:** `CONTRIBUTING.md` (governance layer) + branch protection on `main` if your host/plan supports it
**Depends on:** nothing — this runs before everything else
**Required before:** Step-02 (Product Concept) — the branching convention and self-review gate must exist before the first PR/MR is opened

---

## Target repository

This step configures the **target repository** registered in Step-00, not this kit. Read `.proj-init/state.json` from this kit root and set `TARGET` to its `targetFolder`. If it is missing, stop and direct the operator to run Step-00 first.

Everything this step produces — `CONTRIBUTING.md` and any branch protection — is created in `$TARGET`. Run every git command as `git -C "$TARGET" …`, run every host CLI (`gh`, `az repos`, `glab`) from within `$TARGET`, and write every file under `$TARGET/`.

## This kit is solo / process-enforced

This is a single-operator kit: one person holds both the Product Owner and Architect hats. There is **no host-enforced required-reviewer policy** — no CODEOWNERS, no path-based reviewer gate, no capability probe. The gate is a documented **self-review checklist** the author completes before merging. Branch protection is best-effort: turn it on if your plan allows, but it is not what makes a document "final."

## Goal

Stand up the lightweight governance every later step follows: the branching convention, the commit convention, and the self-review gate that stands in for a second reviewer. Without this, Step-02's first change has no documented branching rule and no gate before it lands on `main`.

## Objective

Every project document (`PRODUCT.md`, `PRD.md`, …) is finalized by merging its change request to `main`. This step documents that gate. The gate is **process, not host policy**:

- **CONTRIBUTING.md (governance layer)** — the branching rules, commit convention, and self-review checklist every contributor and AI tool follows. This is the real gate.
- **Branch protection on `main`** — block direct pushes / require a PR before merge, *if your host and plan allow it*. On GitHub free + private repos this may be unavailable; that is fine — skip it and rely on the self-review checklist.

## Host-neutral by design

This template assumes no specific Git host. The *concepts* below are portable; the *configuration* differs per host. Set up your host's equivalent of each:

| Concern | GitHub | Azure DevOps | Bitbucket | GitLab |
| ------- | ------ | ------------ | --------- | ------ |
| Block direct push to `main`, require review before merge | Branch protection rule / ruleset | Branch policies (no direct push) | Branch restrictions / merge checks | Protected branches |
| Open the change request from the CLI | `gh pr create` | `az repos pr create` | web UI (no official CLI; third-party `atlassian-cli` available) | `glab mr create` |
| Name for the change request | Pull Request (PR) | Pull Request (PR) | Pull Request (PR) | Merge Request (MR) |

> Throughout these guides, **"PR/MR"** means your host's review-and-merge request. On GitHub, Azure DevOps, and Bitbucket that is a **Pull Request**; on GitLab it is a **Merge Request**.

## Branch protection (best-effort)

Turn on your host's "block direct push to `main` / require a PR before merging" setting if the plan allows it:

- **GitHub** — branch protection rule or ruleset. Note: on free-plan **private** repos this is often unavailable via the protection API — skip it.
- **Azure DevOps** — branch policies (free on the Basic plan, any team size).
- **GitLab** — protected branches.
- **Bitbucket** — branch restrictions.

If your plan cannot set it, **do not block Step-02** over it. The self-review checklist below is the gate that matters.

## The gate: self-review checklist

Before merging any `init/*` PR/MR, the author self-certifies:

- [ ] At least a few hours — ideally a full day — have passed since writing the document (fresh-eyes pass).
- [ ] The document covers every section the step guide requires.
- [ ] No upstream document changed after this branch was created.
- [ ] A PR/MR was opened — no direct push to `main`.

Record this checklist in `CONTRIBUTING.md` so every later step and AI tool applies the same gate. Place it **inside the `INITIATION-ONLY` fence** (see below) — it governs producing the initiation documents, not development-phase contribution, so Step-09 removes it when initiation completes.

## What This Step Produces

### `CONTRIBUTING.md` — governance layer

This layer depends on nothing and is written now. The **tooling layer** (test/lint/build commands, hooks) depends on the stack and is appended later — see `05-tech-stack.md`.

The governance layer covers two kinds of content: **permanent** rules that outlive initiation, and **initiation-only** rules that govern producing the initiation documents. Fence the initiation-only content so Step-09 can remove it deterministically when initiation completes.

**Permanent** (stays after initiation — write it outside any fence):

- **Review flow** — open a PR/MR per branch off `main`; merge to `main` = finalized. A merged change is the only "final" one.
- **Commit convention** — Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, …). Matches `06-ai-tool-guide.md`.
- **Direct-push rule** — never push to `main`; no force-pushes to shared branches.

**Initiation-only** (Step-09 removes this — wrap it in the fence shown below):

- **Branch naming** — `init/<step>` for initiation work (`init/product`, `init/prd`, `init/architecture`, `init/techstack`, `init/aitoolguide`, `init/readme`, `init/backlog`).
- **Branch-per-step** — one branch per initiation step off `main`; `main` only ever holds finalized, approved docs.
- **The gate** — the self-review checklist above. Solo / process-enforced: the author completes it before merging; there is no second reviewer to block the merge.

Wrap the initiation-only content in HTML-comment markers so its removal in Step-09 is a deterministic strip, not a rewrite:

```markdown
<!-- BEGIN INITIATION-ONLY -->
## Initiation branching & self-review gate

… init/<step> branch naming, branch-per-step rule, and the self-review checklist …
<!-- END INITIATION-ONLY -->
```

Keep the markers verbatim (this mirrors the protected-block convention used elsewhere in the kit). Step-09 (`/proj-init-finalize-governance`) deletes everything between them, markers included, once Step-08 is merged.

## Why This Matters

- The branching convention and self-review gate exist before the first document is written, not after.
- Branch-vs-`main` state *is* draft-vs-final — no draft files, no status frontmatter to keep in sync.
- Every contributor and AI tool follows one documented branching convention.

## Rules

- This step runs **before** Step-02. Nothing earlier depends on it; everything later does.
- Only the **governance layer** of `CONTRIBUTING.md` is written here. Do not add stack-specific commands yet — they depend on `TECH-STACK.md` (Step-05).
- Solo / process-enforced: one person holds both the Product Owner and Architect hats. The self-review checklist is the gate — never a direct push to `main`.
- Changing the branching strategy or commit convention means updating `CONTRIBUTING.md` first, then reconciling any host branch-protection setting.
- Anyone running the `/proj-init-*` commands opens PRs/MRs via their host's CLI (`gh` / `az repos` / `glab`) or the host's web UI.
