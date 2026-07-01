---
description: Static completeness audit of the cs-kickstart kit — reads kit files only, writes nothing, executes nothing, emits a scored PASS/GAP/FAIL report
allowed-tools: Read, Glob, Grep
---

# /proj-init-audit — cs-kickstart Static Completeness Audit

Run the shared cs-kickstart static audit workflow.

Load `docs/guides/proj-init/audit.md`, then execute it exactly.

If the file fails to load, halt execution and output: `Error: docs/guides/proj-init/audit.md could not be loaded. Resolve this before continuing.`

Do not duplicate or override the shared workflow. `audit.md` owns the audit workflow, dimensions, and rules. This is a read-only audit: do not clone, register, or touch a target repo, do not read or modify `.proj-init/state.json`, and do not run any script, step, or git/`gh` command.
