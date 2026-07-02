# Step-09: Finalize Governance (Terminal)

**Output:** `CONTRIBUTING.md` (init-only material removed; permanent governance + tooling layer retained)
**Depends on:** Step-08 (`BACKLOG.md`) merged — this is the last initiation step
**Required before:** `/proj-init-cleanup`

---

## Target repository

This step transforms the **target repository's** `CONTRIBUTING.md`, not this kit. Read `.proj-init/state.json` from this kit root and set `TARGET` to its `targetFolder`. If it is missing, stop and direct the operator to run Step-00 first.

Everything this step touches is in `$TARGET`. Run every git command as `git -C "$TARGET" …` and read/write `CONTRIBUTING.md` under `$TARGET/`.

## Why this step exists

`CONTRIBUTING.md` was written in two layers during initiation:

- **Governance layer (Step-01)** — branching convention, commit convention, self-review gate.
- **Tooling layer (Step-05)** — install/run/test/lint/build commands, hooks, versions.

Part of the governance layer is **initiation-only**: the `init/<step>` branch names and the *document* self-review checklist (fresh-eyes pass, "no upstream document changed," "covers every section the step guide requires"). Those rules govern producing the initiation documents — they do not describe how contributors work once development begins. Left in place, `CONTRIBUTING.md` ships as an init scaffold, not a contribution policy.

This step removes that init-only material and hands off a clean, permanent core, plus a marked stub the team fills in when development-phase realities are known.

## What is init-only vs. permanent

Step-01 wraps the init-only content in fence markers so this removal is deterministic, not a judgment-call rewrite:

```text
<!-- BEGIN INITIATION-ONLY -->
… init/<step> branch names + the document self-review checklist …
<!-- END INITIATION-ONLY -->
```

- **Remove** — everything between `<!-- BEGIN INITIATION-ONLY -->` and `<!-- END INITIATION-ONLY -->`, markers included.
- **Keep, untouched** — the permanent governance (Conventional Commits, never push to `main`, no force-push, branch-off-`main` + PR/merge = final as the general model) and the **entire** Step-05 tooling layer.

If the `INITIATION-ONLY` markers are absent from `CONTRIBUTING.md` on `main`, this step has already run (or Step-01 predates the fence convention). Stop and tell the operator — do not guess which lines to delete.

## What this step produces

A `CONTRIBUTING.md` with:

1. The init-only block removed.
2. The permanent governance and tooling layers preserved verbatim.
3. A marked development-phase stub inserted where the init block was:

```text
<!-- BEGIN DEVELOPMENT-PHASE-GOVERNANCE -->
## Development-phase governance

_Initiation is complete. The branching, review, and contribution rules for ongoing
development are the team's to define once dev-phase realities are known — team size,
review model, CI gates, release/versioning, environments. Fill this section in and
remove this note via `/proj-init-doc-update CONTRIBUTING.md`._
<!-- END DEVELOPMENT-PHASE-GOVERNANCE -->
```

Do **not** author a full development-phase policy here. Those decisions are not made at initiation; writing them now produces generic governance boilerplate. The kit's job is a clean core plus an honest hand-off.

## Rules

- This step runs **last**, after Step-08 is merged. It is the terminal initiation step.
- Remove only the fenced `INITIATION-ONLY` block. Never edit the permanent governance rules or the Step-05 tooling layer.
- Never expand the stub into real policy — leave it for the team via `/proj-init-doc-update`.
- If the `INITIATION-ONLY` markers are missing, stop; do not delete lines by inference.
- Once this merges, run `/proj-init-cleanup` to unregister the workspace.

## Reviewer checklist

Before approving the PR/MR, verify every item. An unchecked item is a reason to request changes.

- [ ] The entire `<!-- BEGIN INITIATION-ONLY -->` … `<!-- END INITIATION-ONLY -->` block is gone, markers included.
- [ ] No `init/<step>` branch name or document self-review checklist item remains anywhere in the file.
- [ ] The permanent governance (commit convention, direct-push rule, PR/merge model) is intact.
- [ ] The **entire** Step-05 tooling layer (install/run/test/lint/build, hooks, versions) is intact and unchanged.
- [ ] The `DEVELOPMENT-PHASE-GOVERNANCE` stub is present, and no fabricated dev-phase policy was added in its place.
