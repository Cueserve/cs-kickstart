---
agent: agent
description: Step-01 project initiation - configure repo governance gate in the registered target repo
---

# Project Init Repo Setup

Run the shared Project Initiation workflow for Step-01.

Load all three files in the order listed, then execute them as a unified workflow where `_run-step.md` governs execution flow, `_steps.yml` supplies step metadata, and `01-repo-setup.md` supplies step-specific requirements.

1. `docs/guides/proj-init/_run-step.md`
2. Step `1` from `docs/guides/proj-init/_steps.yml`
3. `docs/guides/proj-init/01-repo-setup.md`

If any file fails to load, halt execution and output: `Error: <filename> could not be loaded. Resolve this before continuing Step-01.`

Do not duplicate or override the shared runner. The runner owns workflow, `_steps.yml` owns step metadata, and the step guide owns step-specific requirements. If any conflict arises between the three sources, precedence is: `_run-step.md` > `_steps.yml` > `01-repo-setup.md`.

Session/token policy: run one step per session, ask one focused question at a time, and show only changed sections when revising drafts.
