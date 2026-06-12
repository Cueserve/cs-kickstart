---
agent: agent
description: Step 5 project initiation - generate TECH-STACK.md and CONTRIBUTING.md tooling layer
---

# Project Init Tech Stack

Run the shared Project Initiation workflow for Step 5.

Load all three files in the order listed, then execute them as a unified workflow where `_run-step.md` governs execution flow, `_steps.yml` supplies step metadata, and `05-tech-stack.md` supplies document-specific requirements.

1. `docs/guides/proj-init/_run-step.md`
2. Step `5` from `docs/guides/proj-init/_steps.yml`
3. `docs/guides/proj-init/05-tech-stack.md`

If any file fails to load, halt execution and output: `Error: <filename> could not be loaded. Resolve this before continuing Step 5.`

Do not duplicate or override the shared runner. The runner owns workflow, `_steps.yml` owns step metadata, and the step guide owns document-specific requirements. If any conflict arises between the three sources, precedence is: `_run-step.md` > `_steps.yml` > `05-tech-stack.md`.
