---
description: Step 7 project initiation - replace boilerplate README.md
allowed-tools: Read, Write, Edit, Glob, Bash(git:*), Bash(gh:*), Bash(az:*), Bash(glab:*)
---

# Project Init README

Run the shared Project Initiation workflow for Step 7.

Load all three files in the order listed, then execute them as a unified workflow where `_run-step.md` governs execution flow, `_steps.yml` supplies step metadata, and `07-readme.md` supplies document-specific requirements.

1. `docs/guides/proj-init/_run-step.md`
2. Step `7` from `docs/guides/proj-init/_steps.yml`
3. `docs/guides/proj-init/07-readme.md`

If any file fails to load, halt execution and output: `Error: <filename> could not be loaded. Resolve this before continuing Step 7.`

Do not duplicate or override the shared runner. The runner owns workflow, `_steps.yml` owns step metadata, and the step guide owns document-specific requirements. If any conflict arises between the three sources, precedence is: `_run-step.md` > `_steps.yml` > `07-readme.md`.
