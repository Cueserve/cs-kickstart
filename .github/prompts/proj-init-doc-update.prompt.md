---
agent: agent
description: Update any source-of-truth document after initiation through the same review gate that finalized it. Accepts --target <folder> to update a finished or other project without re-registering.
---

# Project Init Document Update

Run the shared Project Initiation document update workflow.

Load `docs/guides/proj-init/doc-update.md`, then execute it exactly.

If the file fails to load, halt execution and output: `Error: docs/guides/proj-init/doc-update.md could not be loaded. Resolve this before continuing.`

Do not duplicate or override the shared workflow. `doc-update.md` owns the update workflow, implementation, and rules.