# Step 0: Repo Setup (Prerequisite)

**Output:** `.github/CODEOWNERS` + `CONTRIBUTING.md` (governance layer) + GitHub branch-protection settings
**Depends on:** nothing — this runs before everything else
**Required before:** Step 1 (Product Concept) — the approval gate must exist before the first PR is opened

---

## Goal

Stand up the governance that gates every later step: who must approve a document before it becomes final, and the branching rules every contributor and AI tool follows. Without this, Step 1's first PR merges with no review gate and the whole workflow is bypassed on day one.

## Objective

Every project document (`PRODUCT.md`, `PRD.md`, …) is finalized by merging its PR to `main`. This step makes that gate real and mandatory:

- **`.github/CODEOWNERS`** assigns a required reviewer to each document path.
- **Branch protection on `main`** makes CODEOWNERS approval non-optional before merge.
- **`CONTRIBUTING.md` (governance layer)** documents the branching and PR rules that the protection enforces.

The enforcement (branch protection) and its documentation (`CONTRIBUTING.md`) ship together — one is the mechanism, the other explains it.

## What This Step Produces

### 1. `.github/CODEOWNERS`

Assign each output path to the role that validates it. Product docs are gated by the **product owner**; engineering/governance docs by the **architect / tech lead** — never the same reviewer for both.

```text
/PRODUCT.md        @product-owner
/PRD.md            @product-owner
/ARCHITECTURE.md   @architect @product-owner
/TECH-STACK.md     @architect
/AI-TOOL-GUIDE.md  @architect
/CONTRIBUTING.md   @architect
/.github/          @architect
```

### 2. Branch protection on `main`

- Require a pull request before merging — no direct pushes to `main`.
- Require review from **Code Owners**.
- Require branches to be up to date before merging.
- (Optional) require status checks once CI exists.

### 3. `CONTRIBUTING.md` — governance layer

This layer depends on nothing and is written now. The **tooling layer** (test/lint/build commands, hooks) depends on the stack and is appended later — see `04-tech-stack.md`.

The governance layer covers:

- **Branching strategy** — branch per step off `main`; `main` only ever holds finalized, approved docs.
- **Branch naming** — `init/<step>` for initiation work (`init/product`, `init/prd`, `init/architecture`, `init/techstack`, `init/aitools`, `init/readme`).
- **PR flow** — open a PR per branch; merge to `main` = finalized. A merged doc is the only "final" doc.
- **Approval gate** — a PR cannot merge without its CODEOWNERS reviewer. Product owner for product docs, architect for governance docs.
- **Commit convention** — Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, …). Matches `05-ai-tool-guide.md`.
- **Direct-push rule** — never push to `main`; no force-pushes to shared branches.

## Why This Matters

- The approval gate exists before the first document is written, not after.
- Validation is enforced by GitHub, not by people remembering to ask for review.
- Branch-vs-`main` state *is* draft-vs-final — no draft files, no status frontmatter to keep in sync.
- Every contributor and AI tool follows one documented branching convention.

## Rules

- This step runs **before** Step 1. Nothing earlier depends on it; everything later does.
- CODEOWNERS reviewers must differ by document type: product docs → product owner, governance/engineering docs → architect.
- Only the **governance layer** of `CONTRIBUTING.md` is written here. Do not add stack-specific commands yet — they depend on `TECH-STACK.md` (Step 4).
- Changing the branching strategy or the gate means updating `CONTRIBUTING.md` first, then reconciling branch-protection settings.
- Requires the repo to be on GitHub with branch protection enabled and reviewers holding GitHub accounts.
