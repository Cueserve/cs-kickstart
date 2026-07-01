# Step-00: Register Target Repository

**Output:** A cloned target repo on disk + `.proj-init/state.json` registering it in this kit
**Depends on:** nothing — this runs before Step 1
**Required before:** every other step — Steps 1–8 read the registered target from state

---

## Goal

Point this starter kit at the real project repository. Step 0 clones the target
repo into a local folder and records where it lives, so every later
`/proj-init-*` step operates on that clone.

## Control-plane model

This kit is the **control plane**. You run all `/proj-init-*` commands from *this*
repository; they read the registered target and write the produced source-of-truth
documents into the **target clone**. The initiation machinery (guides, runner,
templates, adapters) never gets copied into the target — only the documents you
produce land there.

Step 0 does two things and nothing else:

1. `git clone <git-url> <target-folder>` — the operator supplies both.
2. Write `.proj-init/state.json` in this kit:

   ```json
   {
     "targetFolder": "<absolute path to the clone>",
     "gitUrl": "<target repo git URL>",
     "createdAt": "<ISO timestamp>"
   }
   ```

`.proj-init/` is gitignored — it is operator-local state pointing at a folder on
this machine. It is removed by `/proj-init-cleanup` once Step 8 is merged.

## Operator Questions — ASK FIRST, do not skip

STOP. Before running **any** command (including `--status` or a dry-run), ask the
operator for these and wait for answers. Never proceed with assumed, placeholder,
or prompt-derived values — if the operator's prompt seems to contain them, confirm
explicitly before using them.

1. Git URL — the remote URL of the target repository to clone.
2. Target folder — an empty or non-existent local path to clone into.
3. Existing workspace — a read-only `--status` check answers this; if one is
   already registered, ask whether to replace it (`--force`) or finish it first
   (`/proj-init-cleanup`).

Do not ask about AI tools, product, architecture, stack, or backlog in Step 0.
AI tool selection happens in Step 6; the rest belong to their own steps.

## How to Run

Always dry-run first to confirm the target folder and URL:

```text
node scripts/bootstrap-target-repo.mjs --target <target-folder> --url <git-url>
```

Review the output. If it is correct, apply it — this performs the clone and writes state:

```text
node scripts/bootstrap-target-repo.mjs --target <target-folder> --url <git-url> --apply
```

To check what is currently registered:

```text
node scripts/bootstrap-target-repo.mjs --status
```

To replace an already-registered workspace intentionally:

```text
node scripts/bootstrap-target-repo.mjs --target <target-folder> --url <git-url> --apply --force
```

## After the Script Runs

1. Confirm the clone exists at the target folder and `.proj-init/state.json` points at it (`--status`).
2. Start Step 1 (`01-repo-setup.md`) to stand up governance **in the target repo**. Every later step runs against the registered target.

## Rules

- Step 0 must clone into an empty or non-existent folder. It never writes over an existing working tree.
- Step 0 must not copy the kit's guides, runner, templates, or adapters into the target.
- Step 0 must not create product code, choose a stack, create source-of-truth documents, commit, or push.
- Only one workspace is registered at a time. Replace it only with `--force`; finish it with `/proj-init-cleanup`.
- After Step 0, Step 1 is still required. Branch protection and the approval gate must exist in the target before Step 2 creates `PRODUCT.md`.

## Verification Checklist

Before calling Step 0 complete, verify:

- [ ] Dry-run output was reviewed before `--apply`.
- [ ] The target repo was cloned into an empty/new folder.
- [ ] `.proj-init/state.json` records the target folder and git URL.
- [ ] No kit machinery (guides, runner, templates, adapters) was copied into the target.
- [ ] `--status` reports the intended target before Step 1 begins.
