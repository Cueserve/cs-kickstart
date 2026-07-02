---
agent: agent
description: Step-09 project initiation - remove init-only material from CONTRIBUTING.md and hand off a permanent contribution policy core
---

# Project Init Finalize Governance

Run the shared Project Initiation workflow for Step-09.

Load all three files in the order listed, then execute them as a unified workflow where `_run-step.md` governs execution flow, `_steps.yml` supplies step metadata, and `09-finalize-governance.md` supplies document-specific requirements.

1. `docs/guides/proj-init/_run-step.md`
2. Step `9` from `docs/guides/proj-init/_steps.yml`
3. `docs/guides/proj-init/09-finalize-governance.md`

If any file fails to load, halt execution and output: `Error: <filename> could not be loaded. Resolve this before continuing Step-09.`

Do not duplicate or override the shared runner. The runner owns workflow, `_steps.yml` owns step metadata, and the step guide owns document-specific requirements. If any conflict arises between the three sources, precedence is: `_run-step.md` > `_steps.yml` > `09-finalize-governance.md`.

Session/token policy: run one step per session, ask one focused question at a time, and show only changed sections when revising drafts.
