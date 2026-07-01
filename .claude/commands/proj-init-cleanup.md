---
description: Project initiation cleanup - unregister the target workspace after initiation completes
allowed-tools: Read, Bash(node:*), Bash(git:*)
---

# Project Init Cleanup

Run the shared Project Initiation cleanup workflow.

Load `docs/guides/proj-init/cleanup.md`, then execute it exactly.

If the file fails to load, halt execution and output: `Error: docs/guides/proj-init/cleanup.md could not be loaded. Resolve this before continuing cleanup.`

Do not duplicate or override the shared workflow. `cleanup.md` owns the cleanup workflow, implementation, and rules.
