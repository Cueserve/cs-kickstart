# Project Initiation Cleanup

Run this once initiation is complete to unregister the target workspace from this kit. It removes `.proj-init/state.json` — the operator-local record written by Step-00. Nothing in the target repository is touched.

## Resolve the target

Read `.proj-init/state.json` from this kit root.

- Missing: print `No initiation workspace registered. Nothing to clean up.` and stop.
- Present: set `TARGET` to its `targetFolder` and continue.

## 1. Confirm initiation is complete

Step-09 (`/proj-init-finalize-governance`) is the terminal step. It is done when the `INITIATION-ONLY` fence has been stripped from `CONTRIBUTING.md` on `main`. Confirm that before clearing state — otherwise the operator loses the registered target mid-process.

- Run `git -C "$TARGET" show main:BACKLOG.md`.
  - Non-zero → **STOP** and tell the operator: `BACKLOG.md is not on main yet — finish Step-08 (then Step-09) before cleanup. Re-run with an explicit override only if you intend to abandon this workspace.`
- Run `git -C "$TARGET" show main:CONTRIBUTING.md` and check for the string `INITIATION-ONLY`.
  - Not present → Step-09 is merged; proceed.
  - Present → **STOP** and tell the operator: `CONTRIBUTING.md still carries the initiation-only governance block — run Step-09 (/proj-init-finalize-governance) before cleanup. Re-run with an explicit override only if you intend to abandon this workspace.`

If the operator explicitly chooses to abandon an incomplete workspace, allow cleanup after they confirm.

## 2. Clear the state

Show the operator which workspace will be unregistered (target folder + git URL), then wait for an explicit `yes`.

On confirmation, run:

```text
node scripts/bootstrap-target-repo.mjs --clear
```

Report that the workspace was unregistered. The target clone on disk is left untouched — the operator removes it manually if they no longer need it.

## Rules

- Cleanup only removes `.proj-init/state.json` from this kit. It never deletes, commits to, or pushes the target repository.
- Do not clear state before Step-09 is merged (the `INITIATION-ONLY` fence is gone from `CONTRIBUTING.md` on `main`) unless the operator explicitly abandons the workspace.
- After cleanup, running any `/proj-init-*` step will stop until Step-00 registers a workspace again.
